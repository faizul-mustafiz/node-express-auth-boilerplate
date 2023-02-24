const BadRequestError = require('../errors/BadRequestError');
const logger = require('../loggers/logger');
const authRequest = require('../validators/authRequest.validator');
const authValidator = async (req, res, next) => {
  /**
   * * get {email, password } form request body and validate using joi
   * * if any of these not provided send 400 bad request
   */
  try {
    const result = await authRequest.validateAsync(req.body);
    logger.debug('auth-schema-validation-result: %s', result);
    next();
  } catch (error) {
    error = new BadRequestError(
      'authValidator-error',
      'Any of these fields {email, password} not provided or incorrect',
    );
    next(error);
  }
};
module.exports = authValidator;
