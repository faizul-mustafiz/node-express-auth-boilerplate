require('dotenv');
const { Success } = require('../responses/httpResponse');
const User = require('../models/user.model');
const logger = require('../loggers/logger');
const origin = {
  getAllUser: 'getAllUser-base-error:',
  getOneUser: 'getOneUser-base-error:',
  updateOneUser: 'updateOneUser-base-error:',
  deleteOneUser: 'deleteOneUser-base-error:',
};
const NonAuthoritativeError = require('../errors/NonAuthoritativeError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

getAllUser = async (req, res, next) => {
  try {
    const result = await User.find();
    const count = await User.count();
    logger.debug('getAllUser-result: %s', result);
    logger.info('getAllUser-count: %s', count);
    /**
     * * if there is no user in the user collection send 203 NonAuthoritativeError
     * @param NonAuthoritativeError(origin, message)
     */
    if (count === 0) {
      throw new NonAuthoritativeError(
        'getAllUser-count-zero',
        'User collection is Empty',
      );
    }
    return Success(res, {
      message: 'Successfully found all user documents',
      result,
    });
  } catch (error) {
    error.origin = error.origin ? error.origin : origin.getAllUser;
    next(error);
  }
};
getOneUser = async (req, res, next) => {
  try {
    logger.debug('getOneUser: %s', req.params);
    /**
     * * if there is no userId in request param send 404 NotFoundError
     * @param NotFoundError(origin, message)
     */
    const { userId } = req.params;
    if (!userId) {
      throw new NotFoundError(
        'getOneUser-no-userId-param',
        'Invalid path not found',
      );
    }
    /**
     * * if there is no data for provided userId in request param send 404 NotFoundError
     * @param NotFoundError(origin, message)
     */
    const result = await User.findOne({ _id: userId });
    if (!result) {
      throw new NotFoundError(
        'getOneUser-no-user-with-provided-id',
        'No document found by this request',
      );
    }
    return Success(res, {
      message: 'Successfully found user document',
      result,
    });
  } catch (error) {
    error.origin = error.origin ? error.origin : origin.getOneUser;
    next(error);
  }
};
updateOneUser = async (req, res, next) => {
  try {
    /**
     * * if there is no userId in request param send 404 NotFoundError
     * @param NotFoundError(origin, message)
     */
    const { userId } = req.params;
    if (!userId) {
      throw new NotFoundError(
        'getOneUser-no-userId-param',
        'Invalid path not found',
      );
    }
    const { email } = req.body;
    if (email) {
      const existingUser = await User.emailExist(email);
      logger.debug('existingUser: %s', existingUser);
      /**
       * * if the updated email matches to an existing user email send 400 BadRequestError
       * @param BadRequestError(origin, message)
       */
      if (existingUser && existingUser?._id != userId) {
        throw new BadRequestError(
          'update-email-is-of-an-existing-user',
          'There is already an account present with the email provided for update. Please login or try forgot password',
        );
      }
    }

    const updatingUserDocument = await User.findOne({ _id: userId });
    logger.debug('updatingUserDocument: %s', updatingUserDocument);
    if (!updatingUserDocument) {
      throw new NotFoundError(
        'updateOneUser-no-user-with-provided-id',
        'No document found by this request',
      );
    }

    let changes = { ...req.body };
    changes.password = await User.generateHash(changes.password);
    logger.debug('changes: %s', changes);
    const updatedUser = Object.assign(updatingUserDocument, changes);
    logger.debug('updatedUser: %s', updatedUser);
    const result = await updatedUser.save();
    logger.debug('result: %s', result);
    return Success(res, {
      message: 'Successfully updated user',
      result: result,
    });
  } catch (error) {
    error.origin = error.origin ? error.origin : origin.updateOneUser;
    next(error);
  }
};
deleteOneUser = async (req, res, next) => {
  try {
    /**
     * * if there is no userId in request param send 404 NotFoundError
     * @param NotFoundError(origin, message)
     */
    const { userId } = req.params;
    if (!userId) {
      throw new NotFoundError(
        'deleteOneUser-no-userId-param',
        'Invalid path not found',
      );
    }
    /**
     * * if there is no data for provided userId in request param send 404 NotFoundError
     * @param NotFoundError(origin, message)
     */
    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
      throw new NotFoundError(
        'deleteOneUser-no-user-with-provided-id',
        'No document found by this request',
      );
    }
    const result = await User.findOneAndDelete({ _id: userId });
    return Success(res, {
      message: 'Successfully deleted user',
      result: result,
    });
  } catch (error) {
    error.origin = error.origin ? error.origin : origin.deleteOneUser;
    next(error);
  }
};
module.exports = {
  getAllUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
};
