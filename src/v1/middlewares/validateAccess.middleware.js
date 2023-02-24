const jwt = require('jsonwebtoken');
const { publicKey } = require('../configs/jwt.config');
const {
  isIdentityExists,
  isIdentityBlacklisted,
  getHSetIdentityPayload,
} = require('../helpers/redis.helper');
const logger = require('../loggers/logger');
const UnauthorizedError = require('../errors/UnauthorizedError');

const validateAccess = async (req, res, next) => {
  try {
    /**
     * * get the passed token value form the res.locals
     */
    const token = res.locals.token;
    /**
     * * decode access token and check if the token is a valid token
     * * jwt token related error send 401 unauthorized
     * * if the decoded token identity is not present in redis send 401 unauthorized
     * * Token is a valid token then fetch the token data from redis.
     * * pass redis data as res.locals.validateVerificationResponse
     * * res.locals are persistent throughout the request life cycle or simply to say until the request is resolved
     */
    jwt.verify(
      token,
      publicKey,
      { algorithms: ['ES512'] },
      async (err, decoded) => {
        logger.debug('decoded: %s', decoded);
        /**
         * * if there is an issue on decoding provided access token send 401 UnauthorizedError
         * @param UnauthorizedError(origin, message)
         */
        if (err) {
          throw new UnauthorizedError(
            'validateAccess-token-decode-error',
            'Invalid token',
          );
        }
        if (decoded && decoded.identity) {
          const identityExists = await isIdentityExists(decoded.identity);
          /**
           * * if token identity doesn't exists in redis send 401 UnauthorizedError
           * @param UnauthorizedError(origin, message)
           */
          if (!identityExists) {
            throw new UnauthorizedError(
              'validateAccess-token-identity-does-not-exists-in-redis',
              'Invalid token',
            );
          }
          const identityBlackListed = await isIdentityBlacklisted(
            decoded.identity,
          );
          /**
           * * if token identity is blacklisted send 401 UnauthorizedError
           * @param UnauthorizedError(origin, message)
           */
          if (identityBlackListed) {
            throw new UnauthorizedError(
              'validateAccess-token-identity-is-blacklisted',
              'Invalid token',
            );
          }
          const accessTokenRedisResponse = await getHSetIdentityPayload(
            decoded.identity,
          );
          logger.debug(
            'accessTokenRedisResponse: %s',
            accessTokenRedisResponse,
          );
          /**
           * * if there is no data against the token identity send 401 UnauthorizedError
           * @param UnauthorizedError(origin, message)
           */
          if (!accessTokenRedisResponse) {
            throw new UnauthorizedError(
              'validateAccess-token-identity-data-does-not-exists-in-redis',
              'Invalid token',
            );
          } else {
            const mergedRedisResponseAndDecodedData = {
              ...accessTokenRedisResponse,
              ...decoded,
            };
            res.locals.validateAccessResponse =
              mergedRedisResponseAndDecodedData;
            next();
          }
        }
      },
    );
  } catch (error) {
    error.origin = error.origin ? error.origin : 'validateAccess-base-error:';
    next(error);
  }
};
module.exports = validateAccess;
