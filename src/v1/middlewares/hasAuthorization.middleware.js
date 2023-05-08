const {
  getAuthorizationHeader,
  splitAuthorizationHeader,
} = require('../utility/header.utility');
const ForbiddenError = require('../errors/ForbiddenError');

const hasAuthorization = (req, res, next) => {
  try {
    /**
     * * check if authorization header exists
     * * if there is no authorization header send 403 ForbiddenError
     * @function ForbiddenError(origin,message)
     */
    const authorization = getAuthorizationHeader(req);
    if (!authorization) {
      throw new ForbiddenError(
        'hasAuthorization-no-authorization-header',
        'Authorization header is not present',
      );
    }
    /**
     * * check if Bearer and Token exists
     * * if the token format is not Bearer [token] format send 403 ForbiddenError
     * @function ForbiddenError(origin,message)
     */
    const { bearer, token } = splitAuthorizationHeader(authorization);
    if (!bearer) {
      throw new ForbiddenError(
        'hasAuthorization-no-authorization-header',
        'Format for authorization: Bearer [token]',
      );
    }
    if (!token) {
      throw new ForbiddenError(
        'hasAuthorization-no-authorization-header',
        'Verification token was not provided',
      );
    }
    /**
     * * pass the token, need for verifying the token as res.locals.token
     * * res.locals are persistent throughout the request life cycle or simply to say until the request is resolved
     */
    res.locals.token = token;
    next();
  } catch (error) {
    error.origin = error.origin ? error.origin : 'hasAuthorization-base-error:';
    next(error);
  }
};

module.exports = hasAuthorization;
