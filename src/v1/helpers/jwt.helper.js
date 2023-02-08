const jwt = require('jsonwebtoken');
const {
  accessTokenConfig,
  refreshTokenConfig,
  verifyTokenConfig,
  resetPasswordTokenConfig,
  changePasswordTokenConfig,
  publicKey,
  privateKey,
} = require('../configs/jwt.config');
const { generateTokenId } = require('../utility/jwt.utility');
const {
  setIdentityWithHSet,
  setVerifyTokenIdentity,
  setRestPasswordTokenIdentity,
  setChangePasswordTokenIdentity,
} = require('../helpers/redis.helper');
const TokenType = require('../models/static/token-type.model');

signAccessToken = async (identity, payload) => {
  const jwtId = generateTokenId();
  const tokenExpire =
    Math.floor(new Date().getTime() / 1000) +
    Number(accessTokenConfig.expiryTime);
  const jwtPayload = {
    iat: Math.floor(new Date().getTime() / 1000),
    nbf: Math.floor(new Date().getTime() / 1000),
    exp: tokenExpire,
    type: TokenType.Access,
    identity: identity,
    jti: jwtId,
  };
  const accessToken = jwt.sign(jwtPayload, privateKey, {
    algorithm: 'ES512',
  });
  console.log('access-token:', accessToken);
  await setIdentityWithHSet(identity, Number(tokenExpire), payload);
  return accessToken;
};
signRefreshToken = async (identity, payload) => {
  const jwtId = generateTokenId();
  const tokenExpire =
    Math.floor(new Date().getTime() / 1000) +
    Number(refreshTokenConfig.expiryTime);
  const jwtPayload = {
    iat: Math.floor(new Date().getTime() / 1000),
    nbf: Math.floor(new Date().getTime() / 1000),
    exp: tokenExpire,
    type: TokenType.Refresh,
    identity: identity,
    jti: jwtId,
  };
  const refreshToken = jwt.sign(jwtPayload, privateKey, {
    algorithm: 'ES512',
  });
  console.log('refresh-token:', refreshToken);
  await setIdentityWithHSet(identity, Number(tokenExpire), payload);
  return refreshToken;
};
signVerifyToken = async (identity, payload) => {
  const jwtId = generateTokenId();
  const tokenExpire =
    Math.floor(new Date().getTime() / 1000) +
    Number(verifyTokenConfig.expiryTime);
  const jwtPayload = {
    iat: Math.floor(new Date().getTime() / 1000),
    nbf: Math.floor(new Date().getTime() / 1000),
    exp: tokenExpire,
    type: TokenType.Verify,
    identity: identity,
    jti: jwtId,
  };
  const verifyToken = jwt.sign(jwtPayload, verifyTokenConfig.verifyTokenSecret);
  console.log('verify-token', verifyToken);
  await setVerifyTokenIdentity(identity, Number(tokenExpire), payload);
  return verifyToken;
};
signResetPasswordToken = async (identity, payload) => {
  const jwtId = generateTokenId();
  const tokenExpire =
    Math.floor(new Date().getTime() / 1000) +
    Number(resetPasswordTokenConfig.expiryTime);
  const jwtPayload = {
    iat: Math.floor(new Date().getTime() / 1000),
    nbf: Math.floor(new Date().getTime() / 1000),
    exp: tokenExpire,
    type: TokenType.ResetPassword,
    identity: identity,
    jti: jwtId,
  };
  const resetPasswordToken = jwt.sign(
    jwtPayload,
    resetPasswordTokenConfig.secret,
  );
  console.log('reset-password-token', resetPasswordToken);
  await setRestPasswordTokenIdentity(identity, Number(tokenExpire), payload);
  return resetPasswordToken;
};
signChangePasswordToken = async (identity, payload) => {
  const jwtId = generateTokenId();
  const tokenExpire =
    Math.floor(new Date().getTime() / 1000) +
    Number(changePasswordTokenConfig.expiryTime);
  const jwtPayload = {
    iat: Math.floor(new Date().getTime() / 1000),
    nbf: Math.floor(new Date().getTime() / 1000),
    exp: tokenExpire,
    type: TokenType.ChangePassword,
    identity: identity,
    jti: jwtId,
  };
  const changePasswordToken = jwt.sign(
    jwtPayload,
    changePasswordTokenConfig.secret,
  );
  console.log('change-password-token', changePasswordToken);
  await setChangePasswordTokenIdentity(identity, Number(tokenExpire), payload);
  return changePasswordToken;
};
signNewAccessAndRefreshToken = async (
  accessIdentity,
  accessPayload,
  refreshIdentity,
  refreshPayload,
) => {
  const accessToken = await signAccessToken(accessIdentity, accessPayload);
  const refreshToken = await signRefreshToken(refreshIdentity, refreshPayload);
  console.table(accessToken, refreshToken);
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
};
_revokeAccessToken = async (identity) => {};
_revokeRefreshToken = async (identity) => {};

module.exports = {
  signAccessToken,
  signRefreshToken,
  signVerifyToken,
  signResetPasswordToken,
  signChangePasswordToken,
  signNewAccessAndRefreshToken,
  _revokeAccessToken,
  _revokeRefreshToken,
};
