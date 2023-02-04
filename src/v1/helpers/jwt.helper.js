const jwt = require('jsonwebtoken');
const {
  accessToken,
  refreshToken,
  publicKey,
  privateKey,
} = require('../configs/jwt.config');
const { generateTokenId } = require('../utility/jwt.utility');
const { setTokenIdentity } = require('../helpers/redis.helper');

signAccessToken = async (identity, payload) => {
  const jwtId = generateTokenId();
  const jwtPayload = {
    iat: Math.floor(new Date().getTime() / 1000),
    nbf: Math.floor(new Date().getTime() / 1000),
    exp:
      Math.floor(new Date().getTime() / 1000) + Number(accessToken.expiryTime),
    type: 'access',
    identity: identity,
    jti: jwtId,
  };
  const token = jwt.sign(jwtPayload, privateKey, {
    algorithm: 'ES512',
  });
  console.log('access-token:', token);
  await setTokenIdentity(identity, Number(accessToken.expiryTime), payload);
  return token;
};
signRefreshToken = async (identity, payload) => {
  const jwtId = generateTokenId();
  const jwtPayload = {
    iat: Math.floor(new Date().getTime() / 1000),
    nbf: Math.floor(new Date().getTime() / 1000),
    exp:
      Math.floor(new Date().getTime() / 1000) + Number(refreshToken.expiryTime),
    type: 'refresh',
    identity: identity,
    jti: jwtId,
  };
  const token = jwt.sign(jwtPayload, privateKey, {
    algorithm: 'ES512',
  });
  console.log('refresh-token:', token);
  await setTokenIdentity(identity, Number(refreshToken.expiryTime), payload);
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
