const BadRequestError = require('../errors/BadRequestError');

const hasOTP = (req, res, next) => {
  try {
    /**
     * * check if verification code is given in the body
     * * if there is no verification code send 400 BadRequestError
     * @param BadRequestError(origin, message)
     */
    const { code } = req.body;
    if (!code) {
      throw new BadRequestError(
        'hasOtp-no-otp-provided',
        'Verification code was not provided',
      );
    }
    /**
     * * pass the OTP code, need for verification as res.locals.code
     * * res.locals are persistent throughout the request life cycle or simply to say until the request is resolved
     */
    res.locals.code = code;
    next();
  } catch (error) {
    error.origin = error.origin ? error.origin : 'hasOTP-base-error:';
    next(error);
  }
};
module.exports = hasOTP;
