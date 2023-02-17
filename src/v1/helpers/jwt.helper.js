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
} = require('../helpers/redis.helper');
const TokenType = require('../enums/token-type.enum');

/**
 * * Different type of token signing methods
 * @param signAccessToken(identity, payload)
 * @param signRefreshToken(identity, payload)
 * @param signVerifyToken(identity, payload)
 * @param signResetPasswordToken(identity, payload)
 * @param signChangePasswordToken(identity, payload)
 * @param signNewAccessAndRefreshToken(identity, payload)
 * * identity parameter is the key that needs to be stored as a key in redis
 * * payload parameter is the payload that needs to be stored in redis.
 * @param setIdentityWithHSet(identity, expiry, payload)
 */
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
verifyRefreshToken = async (token) => {};
verifyVerificationToken = async (token, res) => {
  try {
    return jwt.verify(
      token,
      verifyTokenConfig.verifyTokenSecret,
      async (err, decoded) => {
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
verifyChangePasswordToken = async (token) => {};

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
