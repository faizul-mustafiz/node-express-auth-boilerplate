const hasOTP = (req, res, next) => {
  /**
   * * check if verification code is given in the body
   * * if there is no verification code send 400 bad request
   */
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Verification code was not provided',
      result: {},
    });
  }
  /**
   * * pass the OTP code, need for verification as res.locals.code
   * * res.locals are persistent throughout the request life cycle or simply to say until the request is resolved
   */
  res.locals.code = code;
  next();
};
module.exports = hasOTP;
