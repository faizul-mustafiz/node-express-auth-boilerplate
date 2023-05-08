const BadRequestError = require('../errors/BadRequestError');
const changePasswordRequestBody = require('../validators/changePasswordRequestBody.validator');
const logger = require('../loggers/logger');
const validateChangePasswordRequestBody = async (req, res, next) => {
  try {
    /**
     * * check if {code, password} is present in request body and validate using joi
     * * if any of these not provided send 400 BadRequestError
     * @function BadRequestError(origin,message)
     */
    const result = await changePasswordRequestBody.validateAsync(req.body);
    logger.debug('change-password-request-body-validation-result: %s', result);
    /**
     * * pass the OTP code, need for verification as res.locals.code
     * * res.locals are persistent throughout the request life cycle or simply to say until the request is resolved
     */
    const { code } = req.body;
    res.locals.code = code;
    next();
  } catch (error) {
    const errorMessage = `Any of these fields {code, new_password} not provided or incorrect. ${error.details[0].message}`;
    error = new BadRequestError(
      'validateChangePasswordRequestBody-error',
      errorMessage,
    );
    next(error);
  }
};
module.exports = validateChangePasswordRequestBody;
