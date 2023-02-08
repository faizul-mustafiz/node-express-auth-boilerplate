const jwt = require('jsonwebtoken');
const {
  accessTokenConfig,
  refreshTokenConfig,
  publicKey,
  privateKey,
} = require('../configs/jwt.config');
const { generateTokenId } = require('../utility/jwt.utility');
const { setIdentityWithHSet } = require('../helpers/redis.helper');
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
  const token = jwt.sign(jwtPayload, privateKey, {
    algorithm: 'ES512',
  });
  console.log('access-token:', token);
  await setIdentityWithHSet(identity, Number(tokenExpire), payload);
  return token;
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
  const token = jwt.sign(jwtPayload, privateKey, {
    algorithm: 'ES512',
  });
  console.log('refresh-token:', token);
  await setIdentityWithHSet(identity, Number(tokenExpire), payload);
  return token;
};
signVerifyToken = () => {};
signResetPasswordToken = () => {};
signChangePasswordToken = () => {};
signNewAccessAndRefreshToken = () => {};
_revokeAccessToken = () => {};
_revokeRefreshToken = () => {};

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
