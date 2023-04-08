const UnauthorizedError = require('../errors/UnauthorizedError');
const JsonEncryptDecryptAes = require('@faizul-mustafiz/json-ed-aes').default;

const validateDeviceInfoHeader = async (req, res, next) => {
  try {
    /**
     * * get the passed deviceInfoHeaders value form the res.locals
     */
    const deviceInfoHeaders = res.locals.deviceInfoHeaders;
    const validatedAppInfoHeaderResponse =
      res.locals.validatedAppInfoHeaderResponse;
    try {
      const aes = new JsonEncryptDecryptAes(
        validatedAppInfoHeaderResponse.apiSecret,
      );
      let decryptedDeviceInfo = {};
      try {
        decryptedDeviceInfo = aes.decrypt(deviceInfoHeaders.xDeviceInfo);
      } catch (error) {
        throw new UnauthorizedError(
          'validateDeviceInfoHeader-device-info-decryption-error',
          'Invalid application header',
        );
      }
      if (!decryptedDeviceInfo) {
        throw new UnauthorizedError(
          'validateDeviceInfoHeader-device-info-pattern-not-supported',
          'Invalid application header',
        );
      }
      /**
       * * generate validatedDeviceInfoHeaderResponse using decrypted
       * * device info data and then assign it to res.locals
       */
      const validatedDeviceInfoHeaderResponse = {
        deviceId: decryptedDeviceInfo.deviceId,
      };
      res.locals.validatedDeviceInfoHeaderResponse =
        validatedDeviceInfoHeaderResponse;
      next();
    } catch (error) {
      const origin = error.origin
        ? error.origin
        : 'validateDeviceInfoHeader-header-verification-error';
      throw new UnauthorizedError(origin, 'Invalid application header');
    }
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : 'validateDeviceInfoHeader-base-error:';
    next(error);
  }
};

module.exports = validateDeviceInfoHeader;
