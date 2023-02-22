const { publicKey } = require('../configs/jwt.config');
const {
  Unauthorized,
  InternalServerError,
} = require('../handlers/responses/http-response');
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
        logger.error('refresh-token-decode-error', err);
        logger.debug('decoded: %s', decoded);
        if (err) {
          return Unauthorized(res, {
            message: 'Invalid token',
            result: err,
          });
        }
        if (decoded && decoded.identity) {
          const identityExists = await isIdentityExists(decoded.identity);
          if (!identityExists) {
            return Unauthorized(res, {
              message: 'Invalid token',
              result: {},
            });
          }
          const identityBlackListed = await isIdentityBlacklisted(
            decoded.identity,
          );
          if (identityBlackListed) {
            return Unauthorized(res, {
              message: 'Invalid token',
              result: {},
            });
          }
          const refreshTokenRedisResponse = await getHSetIdentityPayload(
            decoded.identity,
          );
          logger.debug(
            'refreshTokenRedisResponse: %s',
            refreshTokenRedisResponse,
          );
          if (!refreshTokenRedisResponse) {
            return Unauthorized(res, {
              message: 'Invalid token',
              result: {},
            });
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
      },
    );
  } catch (error) {
    logger.error('validate-refresh-error', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
module.exports = validateRefresh;
