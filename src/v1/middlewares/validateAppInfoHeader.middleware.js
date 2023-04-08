const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  isAppIdIdentityExists,
  getAppIdIdentity,
} = require('../helpers/redis.helper');
const {
  compareStoredKeyWithApiKey,
  compareStoredSecretWithApiKey,
  compareStoredAppMinVersionWithAppVersion,
} = require('../helpers/applicationCredential.helper');

const validateAppInfoHeader = async (req, res, next) => {
  try {
    /**
     * * get the passed appInfoHeaders value form the res.locals
     */
    const appInfoHeaders = res.locals.appInfoHeaders;
    try {
      /**
       * * check if header xAppId exists in redis if not send 401 UnauthorizedError
       * @param UnauthorizedError(origin, message)
       */
      const identityExists = await isAppIdIdentityExists(appInfoHeaders.xAppId);
      if (!identityExists) {
        throw new UnauthorizedError(
          'validateAppInfoHeader-application-identity-does-not-exists-in-redis',
          'Invalid application headers',
        );
      }
      /**
       * * get data form redis using xAppId as identity
       */
      const applicationRedisResponse = await getAppIdIdentity(
        appInfoHeaders.xAppId,
      );
      /**
       * * check if redis appMinVersion and xAppVersion are same if not send 401 UnauthorizedError
       * @param UnauthorizedError(origin, message)
       */
      const isAppVersionIdentical = compareStoredAppMinVersionWithAppVersion(
        applicationRedisResponse.appMinVersion,
        appInfoHeaders.xAppVersion,
      );
      if (!isAppVersionIdentical) {
        throw new UnauthorizedError(
          'validateAppInfoHeader-app-version-do-not-match',
          'Invalid application header',
        );
      }
      /**
       * * check if redis apiKey and xApiKey are same if not send 401 UnauthorizedError
       * @param UnauthorizedError(origin, message)
       */
      const isApiKeyIdentical = compareStoredKeyWithApiKey(
        applicationRedisResponse.apiKey,
        appInfoHeaders.xApiKey,
      );
      if (!isApiKeyIdentical) {
        throw new UnauthorizedError(
          'validateAppInfoHeader-api-key-do-not-match',
          'Invalid application header',
        );
      }
      /**
       * * check if xApiKey can validate redis apiSecret if not send 401 UnauthorizedError
       * @param UnauthorizedError(origin, message)
       */
      const isApiKeyAuthorized = compareStoredSecretWithApiKey(
        applicationRedisResponse.apiSecret,
        appInfoHeaders.xApiKey,
      );
      if (!isApiKeyAuthorized) {
        throw new UnauthorizedError(
          'validateAppInfoHeader-api-key-not-authorized',
          'Invalid application header',
        );
      }
      /**
       * * generate validatedAppInfoHeaderResponse using appInfoHeaders data and
       * * applicationRedisResponse data then assign it to res.locals
       */
      const validatedAppInfoHeaderResponse = {
        appId: appInfoHeaders.xAppId,
        ...applicationRedisResponse,
      };
      res.locals.validatedAppInfoHeaderResponse =
        validatedAppInfoHeaderResponse;
      next();
    } catch (error) {
      const origin = error.origin
        ? error.origin
        : 'validateAppInfoHeader-header-verification-error';
      throw new UnauthorizedError(origin, 'Invalid application header');
    }
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : 'validateAppInfoHeader-base-error:';
    next(error);
  }
};
module.exports = validateAppInfoHeader;
