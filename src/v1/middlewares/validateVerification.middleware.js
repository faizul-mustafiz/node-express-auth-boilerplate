const jwt = require('jsonwebtoken');
const { verifyTokenConfig } = require('../configs/jwt.config');
const {
  isVerifyTokenIdentityExists,
  getVerifyTokenIdentity,
} = require('../helpers/redis.helper');

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
      console.log('error', err);
      console.log('decoded', decoded);
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Verification failed, invalid token',
          result: err,
        });
      }
      if (decoded && decoded.identity) {
        const identityExists = isVerifyTokenIdentityExists(decoded.identity);
        if (!identityExists) {
          return res.status(401).json({
            success: false,
            message: 'Verification failed, invalid token',
            result: {},
          });
        }
        const verifyTokenRedisResponse = await getVerifyTokenIdentity(
          decoded.identity,
        );
        if (!verifyTokenRedisResponse) {
          return res.status(401).json({
            success: false,
            message: 'Verification failed, invalid token',
            result: {},
          });
        } else {
          res.locals.validateVerificationResponse = verifyTokenRedisResponse;
          next();
        }
      }
    });
  } catch (error) {
    console.log('catch-error', error);
    return res.status(500).json({
      success: false,
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
module.exports = validateVerification;
