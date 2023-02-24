const BadRequestError = require('../errors/BadRequestError');
const verifyRequestBody = require('../validators/verifyRequestBody.validator');
const logger = require('../loggers/logger');
const validateVerifyRequestBody = async (req, res, next) => {
  try {
    /**
     * * check if {code} is present in request body and validate using joi
     * * if code not provided send 400 BadRequestError
     * @param BadRequestError(origin, message)
     */
    const result = await verifyRequestBody.validateAsync(req.body);
    logger.debug('verify-request-body-validation-result: %s', result);
    /**
     * * pass the OTP code, need for verification as res.locals.code
     * * res.locals are persistent throughout the request life cycle or simply to say until the request is resolved
     */
    const { code } = req.body;
    res.locals.code = code;
    next();
  } catch (error) {
    const errorMessage = `{code} not provided or incorrect. ${error.details[0].message}`;
    error = new BadRequestError(
      'validateVerifyRequestBody-error',
      errorMessage,
    );
    next(error);
  }
};
module.exports = validateVerifyRequestBody;
