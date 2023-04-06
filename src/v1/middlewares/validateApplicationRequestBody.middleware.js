const BadRequestError = require('../errors/BadRequestError');
const {
  applicationCreateRequestBody,
  applicationUpdateRequestBody,
} = require('../validators/applicationRequestBody.validator');
const logger = require('../loggers/logger');

const validateApplicationCreateRequestBody = async (req, res, next) => {
  try {
    /**
     * * check if {appName, origin, appUser} is present in request body and validate using joi
     * * if any of these not provided send 400 BadRequestError
     * @param BadRequestError(origin, message)
     */
    const result = await applicationCreateRequestBody.validateAsync(req.body);
    logger.debug(
      'application-create-request-body-validation-result: %s',
      result,
    );
    next();
  } catch (error) {
    const errorMessage = `Any of these fields {appName, origin, appUser} not provided or incorrect. ${error.details[0].message}`;
    error = new BadRequestError(
      'validateApplicationRequestBody-error',
      errorMessage,
    );
    next(error);
  }
};

const validateApplicationUpdateRequestBody = async (req, res, next) => {
  try {
    /**
     * * check if {appName, origin, appUser} is present in request body and validate using joi
     * * if any of these not provided send 400 BadRequestError
     * @param BadRequestError(origin, message)
     */
    const result = await applicationUpdateRequestBody.validateAsync(req.body);
    logger.debug(
      'application-update-request-body-validation-result: %s',
      result,
    );
    next();
  } catch (error) {
    const errorMessage = `Any of these fields {appName, origin, appUser} not provided or incorrect. ${error.details[0].message}`;
    error = new BadRequestError(
      'validateApplicationRequestBody-error',
      errorMessage,
    );
    next(error);
  }
};
module.exports = {
  validateApplicationCreateRequestBody,
  validateApplicationUpdateRequestBody,
};
