const { BadRequest } = require('../responses/httpResponse');
const logger = require('../loggers/logger');
const authSchema = require('./schema/auth.schema');
const authValidator = async (req, res, next) => {
  /**
   * * get {email, password } form request body and validate using joi
   * * if any of these not provided send 400 bad request
   */
  try {
    const result = await authSchema.validateAsync(req.body);
    logger.debug('auth-schema-validation-result: %s', result);
    next();
  } catch (error) {
    logger.error('auth-validator-error', error);
    return BadRequest(res, {
      message:
        'Any of these fields {email, password} not provided or incorrect',
      result: {},
    });
  }
};
module.exports = authValidator;
