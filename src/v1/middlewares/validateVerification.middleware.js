const jwt = require('jsonwebtoken');
const { verifyTokenConfig } = require('../configs/jwt.config');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  isVerifyTokenIdentityExists,
  getVerifyTokenIdentity,
} = require('../helpers/redis.helper');
const logger = require('../loggers/logger');

const validateVerification = async (req, res, next) => {
  try {
    /**
     * * get the passed token value form the res.locals
     */
    const token = res.locals.token;
    /**
     * * decode verify token and check if the token is a valid token
     * * jwt token related error send 401 UnauthorizedError
     * @function UnauthorizedError(origin,message)
     * * if the decoded token identity is not present in redis send 401 UnauthorizedError
     * @function UnauthorizedError(origin,message)
     * * Token is a valid token then fetch the token data from redis.
     * * if there is no data against the token identity send 401 UnauthorizedError
     * @function UnauthorizedError(origin,message)
     * * pass redis data as res.locals.validateVerificationResponse
     * * res.locals are persistent throughout the request life cycle or simply to say until the request is resolved
     */
    try {
      const decoded = jwt.verify(token, verifyTokenConfig.secret);
      logger.debug('decoded: %s', decoded);
      if (decoded && decoded.identity) {
        const identityExists = await isVerifyTokenIdentityExists(
          decoded.identity,
        );
        if (!identityExists) {
          throw new UnauthorizedError(
            'validateVerification-token-identity-does-not-exists-in-redis',
            'Invalid token',
          );
        }
        const verifyTokenRedisResponse = await getVerifyTokenIdentity(
          decoded.identity,
        );
        logger.debug('verifyTokenRedisResponse: %s', verifyTokenRedisResponse);
        if (!verifyTokenRedisResponse) {
          throw new UnauthorizedError(
            'validateVerification-token-identity-data-does-not-exists-in-redis',
            'Invalid token',
          );
        } else {
          res.locals.validateVerificationResponse = verifyTokenRedisResponse;
          next();
        }
      }
    } catch (error) {
      const origin = error.origin
        ? error.origin
        : 'validateVerification-token-decode-error';
      throw new UnauthorizedError(origin, 'Invalid token');
    }
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : 'validateVerification-base-error:';
    next(error);
  }
};
module.exports = validateVerification;
