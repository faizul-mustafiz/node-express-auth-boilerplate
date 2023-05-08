const jwt = require('jsonwebtoken');
const {
  accessTokenConfig,
  refreshTokenConfig,
  verifyTokenConfig,
  changePasswordTokenConfig,
  privateKey,
} = require('../configs/jwt.config');
const {
  generateIdentityHash,
  generateTokenId,
  generateTokenPayloadForRedis,
  generateVerifyTokenPayloadForRedis,
} = require('../utility/jwt.utility');
const {
  setIdentityWithHSet,
  setVerifyTokenIdentity,
  setChangePasswordTokenIdentity,
  getChangePasswordTokenIdentity,
  isChangePasswordTokenIdentityExists,
} = require('../helpers/redis.helper');
const TokenType = require('../enums/tokenType.enum');
const logger = require('../loggers/logger');

/**
 * * Different type of token signing methods
 * @function signAccessToken(payload)
 * @function signRefreshToken(payload)
 * * identity creation is handled inside these method and not passed as a parameter
 * @function signVerifyToken(identity,payload)
 * @function signResetPasswordToken(identity,payload)
 * @function signChangePasswordToken(identity,payload)
 * * identity parameter is the key that needs to be stored as a key in redis
 * * payload parameter is the payload that needs to be stored in redis.
 * @function setIdentityWithHSet(identity,expiry,payload)
 */
signAccessToken = async (payload) => {
  /**
   * * generate access token id
   */
  const accessTokenId = generateTokenId();
  /**
   * * generate access token payload data that needs to be stored in redis
   */
  const accessTokenPayload = generateTokenPayloadForRedis(
    payload,
    TokenType.Access,
    accessTokenId,
  );
  /**
   * * generate access token identity hash for redis key
   */
  const accessTokenIdentity = generateIdentityHash(
    JSON.stringify(accessTokenPayload),
  );
  /**
   * * generate access token expiry
   */
  const tokenExpire =
    Math.floor(new Date().getTime() / 1000) +
    Number(accessTokenConfig.expiryTime);
  /**
   * * generate access token payload
   */
  const jwtPayload = {
    iat: Math.floor(new Date().getTime() / 1000),
    nbf: Math.floor(new Date().getTime() / 1000),
    exp: tokenExpire,
    type: TokenType.Access,
    identity: accessTokenIdentity,
    jti: accessTokenId,
  };
  /**
   * * sign access token with private key
   */
  const accessToken = jwt.sign(jwtPayload, privateKey, {
    algorithm: 'ES512',
  });
  /**
   * * store access token data to redis
   */
  await setIdentityWithHSet(
    accessTokenIdentity,
    Number(tokenExpire),
    accessTokenPayload,
  );
  return accessToken;
};
signRefreshToken = async (payload) => {
  /**
   * * generate refresh token id
   */
  const refreshTokenId = generateTokenId();
  /**
   * * generate refresh token payload data that needs to be stored in redis
   */
  const refreshTokenPayload = generateTokenPayloadForRedis(
    payload,
    TokenType.Refresh,
    refreshTokenId,
  );
  /**
   * * generate refresh token identity hash for redis key
   */
  const refreshTokenIdentity = generateIdentityHash(
    JSON.stringify(refreshTokenPayload),
  );
  const tokenExpire =
    Math.floor(new Date().getTime() / 1000) +
    Number(refreshTokenConfig.expiryTime);
  const jwtPayload = {
    iat: Math.floor(new Date().getTime() / 1000),
    nbf: Math.floor(new Date().getTime() / 1000),
    exp: tokenExpire,
    type: TokenType.Refresh,
    identity: refreshTokenIdentity,
    jti: refreshTokenId,
  };
  const refreshToken = jwt.sign(jwtPayload, privateKey, {
    algorithm: 'ES512',
  });
  await setIdentityWithHSet(
    refreshTokenIdentity,
    Number(tokenExpire),
    refreshTokenPayload,
  );
  return refreshToken;
};
signVerifyToken = async (payload, actionType, otp) => {
  /**
   * * generate verify token id
   */
  const verifyTokenId = generateTokenId();
  /**
   * * generate verify token payload that needs to be stored in redis
   */
  const verifyTokenPayload = generateVerifyTokenPayloadForRedis(
    payload,
    actionType,
    otp,
  );
  logger.debug('verifyTokenPayload: %s', verifyTokenPayload);
  /**
   * * generate verify token identity hash for redis key
   */
  const verifyTokenIdentity = generateIdentityHash(
    JSON.stringify(verifyTokenPayload),
  );
  logger.debug('verifyTokenIdentity: %s', verifyTokenIdentity);
  /**
   * * generate verify token expiry
   */
  const tokenExpire =
    Math.floor(new Date().getTime() / 1000) +
    Number(verifyTokenConfig.expiryTime);
  /**
   * * generate verify token payload
   */
  const jwtPayload = {
    iat: Math.floor(new Date().getTime() / 1000),
    nbf: Math.floor(new Date().getTime() / 1000),
    exp: tokenExpire,
    type: TokenType.Verify,
    identity: verifyTokenIdentity,
    jti: verifyTokenId,
  };
  const verifyToken = jwt.sign(jwtPayload, verifyTokenConfig.secret);
  logger.debug('verify-token: %s', verifyToken);
  await setVerifyTokenIdentity(
    verifyTokenIdentity,
    Number(tokenExpire),
    verifyTokenPayload,
  );
  return verifyToken;
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
  logger.debug('change-password-token: %s', changePasswordToken);
  await setChangePasswordTokenIdentity(identity, Number(tokenExpire), payload);
  return changePasswordToken;
};
/**
 * * Different type of token verifying methods
 * @function verifyChangePasswordToken(token,res)
 */
verifyChangePasswordToken = async (token, res) => {
  try {
    return jwt.verify(
      token,
      changePasswordTokenConfig.secret,
      async (err, decoded) => {
        logger.error('change-password-token-decode-error:', err);
        logger.debug('decoded: %s', decoded);
        if (err) {
          return res.status(401).json({
            success: false,
            message: 'Invalid token',
            result: err,
          });
        }
        if (decoded && decoded.identity) {
          const identityExists = isChangePasswordTokenIdentityExists(
            decoded.identity,
          );
          if (!identityExists) {
            return res.status(401).json({
              success: false,
              message: 'Invalid token',
              result: {},
            });
          }
          const changePasswordTokenRedisResponse =
            await getChangePasswordTokenIdentity(decoded.identity);
          if (!changePasswordTokenRedisResponse) {
            return res.status(401).json({
              success: false,
              message: 'Invalid token',
              result: {},
            });
          } else {
            return changePasswordTokenRedisResponse;
          }
        }
      },
    );
  } catch (error) {
    logger.error('verify-change-password-token-error:', error);
    return res.status(500).json({
      success: false,
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
module.exports = {
  signAccessToken,
  signRefreshToken,
  signVerifyToken,
  signChangePasswordToken,
  verifyChangePasswordToken,
};
