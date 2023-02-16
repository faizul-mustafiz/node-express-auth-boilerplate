const _crypto = require('crypto');
const bcrypt = require('bcryptjs');
const uuid = require('uuid').v4();
const otpGenerator = require('otp-generator');

/**
 * * The data must be of type string or an instance of Buffer, TypedArray, or DataView.
 * *If you want to pass json first stringify and then pass the data.
 */
generateIdentityHash = (data) => {
  return _crypto.createHash('sha1').update(data).digest('hex');
};
generateTokenId = () => {
  return uuid;
};
generateTokenPayloadForRedis = (user, type) => {
  return {
    email: user.email,
    id: user.id,
    type: type,
  };
};
generateVerifyTokenPayloadForRedis = (email, password, type, otp) => {
  return {
    email: email,
    password: password,
    type: type,
    otp: otp,
  };
};
generateOtp = (length) => {
  return otpGenerator.generate(length, {
    digits: true,
    upperCaseAlphabets: true,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};
getAuthorizationHeader = (req) => {
  return req.headers['authorization'] || req.headers['Authorization'];
};
splitAuthorizationHeader = (authorization) => {
  const bearer =
    authorization && authorization.startsWith('Bearer ') ? authorization : null;
  const token = bearer ? bearer.split('Bearer ')[1] : null;
  return {
    bearer,
    token,
  };
};

module.exports = {
  generateIdentityHash,
  generateTokenId,
  generateTokenPayloadForRedis,
  generateVerifyTokenPayloadForRedis,
  generateOtp,
  getAuthorizationHeader,
  splitAuthorizationHeader,
};
