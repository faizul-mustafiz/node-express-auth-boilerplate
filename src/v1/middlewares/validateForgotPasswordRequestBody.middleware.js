const BadRequestError = require('../errors/BadRequestError');
const forgotPasswordRequestBody = require('../validators/forgotPasswordRequestBody.validator');
const logger = require('../loggers/logger');
const validateForgotPasswordRequestBody = async (req, res, next) => {
  try {
    /**
     * * check if {email} is present in request body and validate using joi
     * * if email provided send 400 bad request
     * @function BadRequestError(origin,message)
     */
    const result = await forgotPasswordRequestBody.validateAsync(req.body);
    logger.debug('forgot-password-request-body-validation-result: %s', result);
    next();
  } catch (error) {
    const errorMessage = `{email} not provided or incorrect. ${error.details[0].message}`;
    error = new BadRequestError(
      'validateForgotPasswordRequestBody-error',
      errorMessage,
    );
    next(error);
  }
};
module.exports = validateForgotPasswordRequestBody;
