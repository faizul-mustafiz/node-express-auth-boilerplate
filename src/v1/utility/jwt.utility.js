const _crypto = require('crypto');
const uuid = require('uuid');
const otpGenerator = require('otp-generator');
const TokenType = require('../enums/tokenType.enum');
const AuthActionType = require('../enums/authActionType.enum');

/**
 * * The data must be of type string or an instance of Buffer, TypedArray, or DataView.
 * * If you want to pass json first stringify and then pass the data.
 */
generateIdentityHash = (data) => {
  return _crypto.createHash('sha1').update(data).digest('hex');
};
generateTokenId = () => {
  return uuid.v4();
};
generateTokenPayloadForRedis = (user, type, tokenId) => {
  return {
    email: user.email,
    id: user.id,
    type: type,
    tokenId: tokenId,
  };
};
generateVerifyTokenPayloadForRedis = (payload, actionType, otp) => {
  return actionType == AuthActionType.signUp
    ? {
        email: payload.email,
        password: payload.password,
        actionType: actionType,
        otp: otp,
        tokenType: TokenType.Verify,
      }
    : {
        email: payload.email,
        actionType: actionType,
        otp: otp,
        tokenType: TokenType.Verify,
      };
};
generateChangePasswordTokenPayloadForRedis = (email, type, otp) => {
  return {
    email: email,
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
  generateChangePasswordTokenPayloadForRedis,
  generateOtp,
  getAuthorizationHeader,
  splitAuthorizationHeader,
};
