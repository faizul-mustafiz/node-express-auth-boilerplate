const BadRequestError = require('../errors/BadRequestError');
const authRequestBody = require('../validators/authRequestBody.validator');
const logger = require('../loggers/logger');
const validateAuthRequestBody = async (req, res, next) => {
  try {
    /**
     * * check if {email, password} is present in request body and validate using joi
     * * if any of these not provided send 400 BadRequestError
     * @param BadRequestError(origin, message)
     */
    const result = await authRequestBody.validateAsync(req.body);
    logger.debug('auth-request-body-validation-result: %s', result);
    next();
  } catch (error) {
    const errorMessage = `Any of these fields {email, password} not provided or incorrect. ${error.details[0].message}`;
    error = new BadRequestError('validateAuthRequestBody-error', errorMessage);
    next(error);
  }
};
module.exports = validateAuthRequestBody;
