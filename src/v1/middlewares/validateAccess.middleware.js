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
     * * jwt token related error send 401 UnauthorizedError
     * @param UnauthorizedError(origin, message)
     * * if the decoded token identity is not present in redis send 401 UnauthorizedError
     * @param UnauthorizedError(origin, message)
     * * if the decoded token identity is blacklisted in redis send 401 UnauthorizedError
     * @param UnauthorizedError(origin, message)
     * * Token is a valid token then fetch the token data from redis.
     * * if there is no data against the token identity send 401 UnauthorizedError
     * @param UnauthorizedError(origin, message)
     * * pass redis data as res.locals.validateAccessResponse
     * * res.locals are persistent throughout the request life cycle or simply to say until the request is resolved
     */
    try {
      const decoded = jwt.verify(token, publicKey, { algorithms: ['ES512'] });
      logger.debug('decoded: %s', decoded);
      if (decoded && decoded.identity) {
        const identityExists = await isIdentityExists(decoded.identity);
        if (!identityExists) {
          throw new UnauthorizedError(
            'validateAccess-token-identity-does-not-exists-in-redis',
            'Invalid token',
          );
        }
        const identityBlackListed = await isIdentityBlacklisted(
          decoded.identity,
        );
        if (identityBlackListed) {
          throw new UnauthorizedError(
            'validateAccess-token-identity-is-blacklisted',
            'Invalid token',
          );
        }
        const accessTokenRedisResponse = await getHSetIdentityPayload(
          decoded.identity,
        );
        logger.debug('accessTokenRedisResponse: %s', accessTokenRedisResponse);
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
          res.locals.validateAccessResponse = mergedRedisResponseAndDecodedData;
          next();
        }
      }
    } catch (error) {
      const origin = error.origin
        ? error.origin
        : 'validateAccess-token-decode-error';
      throw new UnauthorizedError(origin, 'Invalid token');
    }
  } catch (error) {
    error.origin = error.origin ? error.origin : 'validateAccess-base-error:';
    next(error);
  }
};
module.exports = validateAccess;
