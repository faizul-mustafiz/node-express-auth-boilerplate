const jwt = require('jsonwebtoken');
const {
  accessTokenConfig,
  refreshTokenConfig,
  verifyTokenConfig,
  changePasswordTokenConfig,
  publicKey,
  privateKey,
} = require('../configs/jwt.config');
const { generateTokenId } = require('../utility/jwt.utility');
const {
  setIdentityWithHSet,
  setVerifyTokenIdentity,
  setChangePasswordTokenIdentity,
  isIdentityExists,
  getVerifyTokenIdentity,
  getChangePasswordTokenIdentity,
} = require('../helpers/redis.helper');
const TokenType = require('../enums/token-type.enum');

/**
 * * Different type of token signing methods
 * @param signAccessToken(payload)
 * @param signRefreshToken(payload)
 * * identity creation is handled inside these method and not passed as a parameter
 * @param signVerifyToken(identity, payload)
 * @param signResetPasswordToken(identity, payload)
 * @param signChangePasswordToken(identity, payload)
 * @param signNewAccessAndRefreshToken(identity, payload)
 * * identity parameter is the key that needs to be stored as a key in redis
 * * payload parameter is the payload that needs to be stored in redis.
 * @param setIdentityWithHSet(identity, expiry, payload)
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
  const verifyToken = jwt.sign(jwtPayload, verifyTokenConfig.secret);
  console.log('verify-token', verifyToken);
  await setVerifyTokenIdentity(identity, Number(tokenExpire), payload);
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
/**
 * * Different type of token verifying methods
 * @param verifyAccessToken(token, res)
 * @param verifyRefreshToken(token, res)
 * @param verifyVerificationToken(token, res)
 * @param verifyChangePasswordToken(token, res)
 */
verifyAccessToken = async (token, res) => {
  try {
    return jwt.verify(
      token,
      publicKey,
      { algorithms: ['ES512'] },
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: 'Invalid token',
            result: err,
          });
        }
        if (decoded && decoded.identity) {
          if (!isIdentityExists(decoded.identity)) {
            return res.status(401).json({
              success: false,
              message: 'Invalid token',
              result: err,
            });
          }
          if (isIdentityBlacklisted(decoded.identity)) {
            return res.status(401).json({
              success: false,
              message: 'Invalid token',
              result: err,
            });
          }

          const accessTokenRedisResponse = await getHSetIdentityPayload(
            decoded.identity,
          );
          console.log('accessTokenRedisResponse', accessTokenRedisResponse);
          if (!accessTokenRedisResponse) {
            return res.status(401).json({
              success: false,
              message: 'Invalid token',
              result: err,
            });
          } else {
            return accessTokenRedisResponse;
          }
        }
      },
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Oops there is an Error',
      result: error,
    });
  }
};
verifyRefreshToken = async (token, res) => {};
verifyVerificationToken = async (token, res) => {
  try {
    return jwt.verify(token, verifyTokenConfig.secret, async (err, decoded) => {
      console.log('error', err);
      console.log('decoded', decoded);
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Verification failed, invalid token',
          result: err,
        });
      }
      if (decoded && decoded.identity) {
        if (!isIdentityExists(decoded.identity)) {
          return res.status(401).json({
            success: false,
            message: 'Verification failed, invalid token',
            result: err,
          });
        }
        const verifyTokenRedisResponse = await getVerifyTokenIdentity(
          decoded.identity,
        );
        if (!verifyTokenRedisResponse) {
          return res.status(401).json({
            success: false,
            message: 'Verification failed, invalid token',
            result: err,
          });
        } else {
          return verifyTokenRedisResponse;
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Oops there is an Error',
      result: error,
    });
  }
};
verifyChangePasswordToken = async (token, res) => {
  try {
    return jwt.verify(
      token,
      changePasswordTokenConfig.secret,
      async (err, decoded) => {
        console.log('error', err);
        console.log('decoded', decoded);
        if (err) {
          return res.status(401).json({
            success: false,
            message: 'Invalid token',
            result: err,
          });
        }
        if (decoded && decoded.identity) {
          if (!isIdentityExists(decoded.identity)) {
            return res.status(401).json({
              success: false,
              message: 'Invalid token',
              result: err,
            });
          }
          const changePasswordTokenRedisResponse =
            await getChangePasswordTokenIdentity(decoded.identity);
          if (!changePasswordTokenRedisResponse) {
            return res.status(401).json({
              success: false,
              message: 'Invalid token',
              result: err,
            });
          } else {
            return changePasswordTokenRedisResponse;
          }
        }
      },
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Oops there is an Error',
      result: error,
    });
  }
};

_revokeAccessToken = async (identity) => {};
_revokeRefreshToken = async (identity) => {};

module.exports = {
  signAccessToken,
  signRefreshToken,
  signVerifyToken,
  signChangePasswordToken,
  signNewAccessAndRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyVerificationToken,
  verifyChangePasswordToken,
  _revokeAccessToken,
  _revokeRefreshToken,
};
