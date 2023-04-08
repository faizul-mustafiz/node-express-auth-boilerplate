const { getXDeviceInfoHeader } = require('../utility/header.utility');
const ForbiddenError = require('../errors/ForbiddenError');

const hasDeviceInfoHeader = (req, res, next) => {
  try {
    /**
     * * check if x-app-version header exists
     * * if there is no x-app-version header send 403 ForbiddenError
     * @param ForbiddenError(origin, message)
     */
    const xDeviceInfo = getXDeviceInfoHeader(req);
    if (!xDeviceInfo) {
      throw new ForbiddenError(
        'hasDeviceInfoHeader-no-x-device-info-header',
        'x-device-info header is not present',
      );
    }
    res.locals.deviceInfoHeaders = { xDeviceInfo };
    next();
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : 'hasDeviceInfoHeader-base-error:';
    next(error);
  }
};

module.exports = hasDeviceInfoHeader;
