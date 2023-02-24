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
     * * decode verification token and check if the token is a valid token
     * * jwt token related error send 401 unauthorized
     * * if the decoded token identity is not present in redis send 401 unauthorized
     * * Token is a valid token then fetch the token data from redis.
     * * pass redis data as res.locals.validateVerificationResponse
     * * res.locals are persistent throughout the request life cycle or simply to say until the request is resolved
     */
    jwt.verify(token, verifyTokenConfig.secret, async (err, decoded) => {
      logger.debug('decoded: %s', decoded);
      if (err) {
        /**
         * * if there is an issue on decoding provided verify token send 401 UnauthorizedError
         * @param UnauthorizedError(origin, message)
         */
        throw new UnauthorizedError(
          'validateVerification-token-decode-error',
          'Invalid token',
        );
      }
      if (decoded && decoded.identity) {
        const identityExists = isVerifyTokenIdentityExists(decoded.identity);
        /**
         * * if token identity doesn't exists in redis send 401 UnauthorizedError
         * @param UnauthorizedError(origin, message)
         */
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
        /**
         * * if there is no data against the token identity send 401 UnauthorizedError
         * @param UnauthorizedError(origin, message)
         */
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
    });
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : 'validateVerification-base-error:';
    next(error);
  }
};
module.exports = validateVerification;
