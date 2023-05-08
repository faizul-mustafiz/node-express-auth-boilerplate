const jwt = require('jsonwebtoken');
const { publicKey } = require('../configs/jwt.config');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  isIdentityExists,
  isIdentityBlacklisted,
  getHSetIdentityPayload,
} = require('../helpers/redis.helper');
const logger = require('../loggers/logger');

const validateRefresh = async (req, res, next) => {
  try {
    /**
     * * get the passed token value form the res.locals
     */
    const token = res.locals.token;
    /**
     * * decode refresh token and check if the token is a valid token
     * * jwt token related error send 401 UnauthorizedError
     * @function UnauthorizedError(origin,message)
     * * if the decoded token identity is not present in redis send 401 UnauthorizedError
     * @function UnauthorizedError(origin,message)
     * * if the decoded token identity is blacklisted in redis send 401 UnauthorizedError
     * @function UnauthorizedError(origin,message)
     * * Token is a valid token then fetch the token data from redis.
     * * if there is no data against the token identity send 401 UnauthorizedError
     * @function UnauthorizedError(origin,message)
     * * pass redis data as res.locals.validateRefreshResponse
     * * res.locals are persistent throughout the request life cycle or simply to say until the request is resolved
     */
    try {
      const decoded = jwt.verify(token, publicKey, { algorithms: ['ES512'] });
      logger.debug('decoded: %s', decoded);
      if (decoded && decoded.identity) {
        const identityExists = await isIdentityExists(decoded.identity);
        if (!identityExists) {
          throw new UnauthorizedError(
            'validateRefresh-token-identity-does-not-exists-in-redis',
            'Invalid token',
          );
        }
        const identityBlackListed = await isIdentityBlacklisted(
          decoded.identity,
        );
        if (identityBlackListed) {
          throw new UnauthorizedError(
            'validateRefresh-token-identity-is-blacklisted',
            'Invalid token',
          );
        }
        const refreshTokenRedisResponse = await getHSetIdentityPayload(
          decoded.identity,
        );
        logger.debug(
          'refreshTokenRedisResponse: %s',
          refreshTokenRedisResponse,
        );
        if (!refreshTokenRedisResponse) {
          throw new UnauthorizedError(
            'validateRefresh-token-identity-data-does-not-exists-in-redis',
            'Invalid token',
          );
        } else {
          const mergedRedisResponseAndDecodedData = {
            ...refreshTokenRedisResponse,
            ...decoded,
          };
          res.locals.validateRefreshResponse =
            mergedRedisResponseAndDecodedData;
          next();
        }
      }
    } catch (error) {
      const origin = error.origin
        ? error.origin
        : 'validateRefresh-token-decode-error';
      throw new UnauthorizedError(origin, 'Invalid token');
    }
  } catch (error) {
    error.origin = error.origin ? error.origin : 'validateRefresh-base-error:';
    next(error);
  }
};
module.exports = validateRefresh;
