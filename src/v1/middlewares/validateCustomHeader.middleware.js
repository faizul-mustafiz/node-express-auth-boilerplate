const logger = require('../loggers/logger');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  isAppIdIdentityExists,
  getAppIdIdentity,
} = require('../helpers/redis.helper');
const {
  compareStoredKeyWithApiKey,
  compareStoredSecretWithApiKey,
} = require('../helpers/applicationCredential.helper');

const validateCustomHeader = async (req, res, next) => {
  try {
    /**
     * * get the passed customHeaders value form the res.locals
     */
    const customHeaders = res.locals.customHeaders;
    try {
      /**
       * * check if header xAppId exists in redis if not send 401 UnauthorizedError
       * @param UnauthorizedError(origin, message)
       */
      const identityExists = await isAppIdIdentityExists(customHeaders.xAppId);
      if (!identityExists) {
        throw new UnauthorizedError(
          'validateCustomHeader-application-identity-does-not-exists-in-redis',
          'Invalid application headers',
        );
      }
      /**
       * * get data form redis using xAppId as identity
       * * check if redis apiKey and xApiKey are same if not send 401 UnauthorizedError
       * @param UnauthorizedError(origin, message)
       */
      const applicationRedisResponse = await getAppIdIdentity(
        customHeaders.xAppId,
      );
      const isApiKeyIdentical = compareStoredKeyWithApiKey(
        applicationRedisResponse.apiKey,
        customHeaders.xApiKey,
      );
      if (!isApiKeyIdentical) {
        throw new UnauthorizedError(
          'validateCustomHeader-api-key-do-not-match',
          'Invalid application header',
        );
      }
      /**
       * * check if xApiKey can validate redis apiSecret if not send 401 UnauthorizedError
       * @param UnauthorizedError(origin, message)
       */
      const isApiKeyAuthorized = compareStoredSecretWithApiKey(
        applicationRedisResponse.apiSecret,
        customHeaders.xApiKey,
      );
      if (!isApiKeyAuthorized) {
        throw new UnauthorizedError(
          'validateCustomHeader-api-key-not-authorized',
          'Invalid application header',
        );
      }
      /**
       * * generate validatedCustomHeaderResponse using customHeaders data and
       * * applicationRedisResponse data then assign it to res.locals
       */
      const validatedCustomHeaderResponse = {
        appId: customHeaders.xAppId,
        ...applicationRedisResponse,
      };
      res.locals.validatedCustomHeaderResponse = validatedCustomHeaderResponse;
      next();
    } catch (error) {
      const origin = error.origin
        ? error.origin
        : 'validateCustomHeader-header-verification-error';
      throw new UnauthorizedError(origin, 'Invalid application header');
    }
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : 'validateCustomHeader-base-error:';
    next(error);
  }
};
module.exports = validateCustomHeader;
