require('dotenv');
const Application = require('../models/application.model');
const logger = require('../loggers/logger');

const {
  generateApplicationCredentialData,
  setApplicationCredentialToRedis,
  deleteApplicationCredentialFromRedis,
} = require('../helpers/applicationCredential.helper');
const ApplicationControllerOrigin = require('../enums/applicationControllerOrigin.enum');

const NonAuthoritativeError = require('../errors/NonAuthoritativeError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const { Created, Success } = require('../responses/httpResponse');

getAllApplications = async (req, res, next) => {
  try {
    const result = await Application.find();
    const count = await Application.count();
    logger.debug('getAllApplications-result: %s', result);
    logger.info('getAllApplications-count: %s', count);
    /**
     * * if there is no application in the applications collection send 203 NonAuthoritativeError
     * @param NonAuthoritativeError(origin, message)
     */
    if (count === 0) {
      throw new NonAuthoritativeError(
        'getAllApplications-count-zero',
        'Applications collection is Empty',
      );
    }
    return Success(res, {
      message: 'Successfully found all applications documents',
      result,
    });
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : ApplicationControllerOrigin.getAllApplications;
    next(error);
  }
};
getOneApplication = async (req, res, next) => {
  try {
    logger.debug('getOneApplication: %s', req.params);
    /**
     * * if there is no appId in request param send 404 NotFoundError
     * @param NotFoundError(origin, message)
     */
    const { appId } = req.params;
    if (!appId) {
      throw new NotFoundError(
        'getOneApplication-no-appId-param',
        'Invalid path not found',
      );
    }
    /**
     * * if there is no data for provided appId in request param send 404 NotFoundError
     * @param NotFoundError(origin, message)
     */
    const result = await Application.findOne({ appId });
    logger.debug('application-get-result: %s', result);
    if (!result) {
      throw new NotFoundError(
        'getOneApplication-no-application-with-provided-id',
        'No document found by this request',
      );
    }
    return Success(res, {
      message: 'Successfully found application document',
      result,
    });
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : ApplicationControllerOrigin.getOneApplication;
    next(error);
  }
};
createOneApplication = async (req, res, next) => {
  try {
    let { appName } = req.body;
    logger.debug('appName: %s', appName);
    const existingApplication = await Application.appNameExists(appName);
    if (existingApplication) {
      throw new BadRequestError(
        'createOneApplication-application-exists:',
        'An application with this name already exists',
      );
    }
    const generatedApplicationData = generateApplicationCredentialData();
    const applicationObject = { ...generatedApplicationData, ...req.body };
    await setApplicationCredentialToRedis(applicationObject);
    const application = new Application(applicationObject);
    logger.debug('application: %s', application);
    const result = await application.save();
    return Created(res, {
      message: 'Application created',
      result,
    });
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : ApplicationControllerOrigin.createOneApplication;
    next(error);
  }
};
updateOneApplication = async (req, res, next) => {
  try {
    /**
     * * if there is no appId in request param send 404 NotFoundError
     * @param NotFoundError(origin, message)
     */
    const { appId } = req.params;
    if (!appId) {
      throw new NotFoundError(
        'updateOneApplication-no-appId-param',
        'Invalid path not found',
      );
    }

    const { appName } = req.body;
    if (appName) {
      const existingApplication = await Application.appNameExists(appName);
      logger.debug('existingApplication: %s', existingApplication);
      /**
       * * if the updating appName matches to an existing appName send 400 BadRequestError
       * @param BadRequestError(origin, message)
       */
      if (existingApplication && existingApplication?.appId != appId) {
        throw new BadRequestError(
          'update-appName-is-of-an-existing-appName',
          'There is already an application present with provided application name for update. Try another name',
        );
      }
    }

    const updatingApplicationDocument = await Application.findOne({ appId });
    logger.debug(
      'updatingApplicationDocument: %s',
      updatingApplicationDocument,
    );
    if (!updatingApplicationDocument) {
      throw new NotFoundError(
        'updateOneApplication-no-application-with-provided-id',
        'No document found by this request',
      );
    }
    let changes = { ...req.body };
    logger.debug('changes: %s', changes);
    const updatedApplication = Object.assign(
      updatingApplicationDocument,
      changes,
    );
    logger.debug('updatedApplication: %s', updatedApplication);
    await setApplicationCredentialToRedis(updatingApplicationDocument);
    const result = await updatedApplication.save();
    logger.debug('result: %s', result);
    return Success(res, {
      message: 'Successfully updated application',
      result: result,
    });
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : ApplicationControllerOrigin.updateOneApplication;
    next(error);
  }
};
deleteOneApplication = async (req, res, next) => {
  try {
    /**
     * * if there is no appId in request param send 404 NotFoundError
     * @param NotFoundError(origin, message)
     */
    const { appId } = req.params;
    if (!appId) {
      throw new NotFoundError(
        'deleteOneApplication-no-appId-param',
        'Invalid path not found',
      );
    }
    /**
     * * if there is no data for provided appId in request param send 404 NotFoundError
     * @param NotFoundError(origin, message)
     */
    const application = await Application.findOne({ appId });
    if (!application) {
      throw new NotFoundError(
        'deleteOneApplication-no-application-with-provided-id',
        'No document found by this request',
      );
    }
    await deleteApplicationCredentialFromRedis(appId);
    const result = await Application.findOneAndDelete({ appId });
    return Success(res, {
      message: 'Successfully deleted application',
      result: result,
    });
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : ApplicationControllerOrigin.deleteOneApplication;
    next(error);
  }
};
module.exports = {
  getAllApplications,
  getOneApplication,
  createOneApplication,
  updateOneApplication,
  deleteOneApplication,
};
