require('dotenv');
const User = require('../models/user.model');
const {
  signAccessToken,
  signRefreshToken,
  signVerifyToken,
  signChangePasswordToken,
  verifyChangePasswordToken,
} = require('../helpers/jwt.helper');
const {
  generateIdentityHash,
  generateOtp,
  generateChangePasswordTokenPayloadForRedis,
} = require('../utility/jwt.utility');

const TokenType = require('../enums/tokenType.enum');
const {
  setIdentityToBlacklist,
  deleteIdentity,
} = require('../helpers/redis.helper');
const AuthActionType = require('../enums/authActionType.enum');
const apiRouteGeneratorLocal = require('../utility/app.utility');
const {
  Success,
  Created,
  BadRequest,
  Unauthorized,
  Conflict,
  InternalServerError,
} = require('../handlers/responses/httpResponse');
const logger = require('../loggers/logger');
signUp = async (req, res, next) => {
  try {
    /**
     * * get {email, password } form request body
     */
    let { email, password } = req.body;
    /**
     * * generate password hash form the provided password
     * @param User.generateHash(password)
     */
    password = await User.generateHash(password);
    /**
     * * check if email exists, send 400 bad request
     */
    const existingUser = await User.emailExist(email);
    if (existingUser) {
      return BadRequest(res, {
        message: 'An account with this email already exists',
        result: {},
      });
    }
    /**
     * * generate OTP for verify sign-up
     */
    const OTP = generateOtp(8);
    /**
     * * generate verify token
     */
    const verifyToken = await signVerifyToken(
      { email, password },
      AuthActionType.signUp,
      OTP,
    );
    /**
     * * generate verify token response
     */
    const result = {
      url: apiRouteGeneratorLocal('/auth/verify'),
      token: verifyToken,
      code: OTP,
    };
    /**
     * * send 200 success response
     * @param Success(res, { message, result})
     * @returns res.status(200).json({success, message, result})
     */
    return Success(res, {
      message:
        'Please continue to provided url with token and code for successful sign-up',
      result,
    });
  } catch (error) {
    logger.error('sign-up-error:', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
signIn = async (req, res, next) => {
  try {
    /**
     * * get {email, password } form request body
     */
    const { email, password } = req.body;
    /**
     * * check if user email doesn't exists, send 400 bad request
     */
    const user = await User.emailExist(email);
    logger.debug('user: %s', user);
    if (!user) {
      return BadRequest(res, {
        message: 'This email is not registered, SignUp first',
        result: {},
      });
    }
    /**
     * * compare the request password and db password
     * * if password doesn't match send 400 bad request
     */
    const comparePassword = await user.validPassword(password);
    logger.debug('comparePassword: %s', comparePassword);
    if (!comparePassword) {
      return BadRequest(res, {
        message: 'Incorrect password',
        result: {},
      });
    }
    /**
     * * generate OTP for verify sign-up
     */
    const OTP = generateOtp(8);
    /**
     * * generate verify token
     */
    const verifyToken = await signVerifyToken(
      { email, password },
      AuthActionType.signIn,
      OTP,
    );
    /**
     * * generate verify token response
     */
    const result = {
      url: apiRouteGeneratorLocal('/auth/verify'),
      token: verifyToken,
      code: OTP,
    };
    /**
     * * send 200 success response
     */
    return Success(res, {
      message:
        'Please continue to provided url with token and code for successful sign-in',
      result,
    });
  } catch (error) {
    logger.error('sign-in-error:', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
signOut = async (req, res, next) => {
  try {
    /**
     * * get validateRefreshResponse value form res.locals
     */
    const { email, type, identity, exp } = res.locals.validateRefreshResponse;
    if (email && type && identity && exp) {
      /**
       * * if decoded token type is not refresh, send 401 unauthorized
       */
      if (type && type != TokenType.Refresh) {
        return Unauthorized(res, {
          message: 'Invalid token',
          result: {},
        });
      }
      /**
       * * check if user email doesn't exists, send 400 bad request
       */
      const user = await User.emailExist(email);
      logger.debug('user: %s', user);
      if (!user) {
        return BadRequest(res, {
          message: 'This email is not registered, SignUp first',
          result: {},
        });
      }

      /**
       * * blacklist existing token identity and then delete the refresh token identity
       */
      const backListTokenIdentityResponse = await setIdentityToBlacklist(
        identity,
        exp,
      );
      logger.debug(
        'backListTokenIdentityResponse: %s',
        backListTokenIdentityResponse,
      );
      const deleteTokenIdentityResponse = await deleteIdentity(identity);
      logger.debug(
        'deleteTokenIdentityResponse: %s',
        deleteTokenIdentityResponse,
      );
      /**
       * * Send 200 success response
       */
      return Success(res, {
        message: 'Sign-Out successful',
        result: {},
      });
    }
  } catch (error) {
    logger.error('sign-out-error:', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
continueSingUp = async (req, res, next) => {
  try {
    /**
     * * get validateVerificationResponse value form res.locals
     */
    const { email, password } = res.locals.validateVerificationResponse;
    /**
     * * check if email exists, send 400 bad request
     */
    const existingUser = await User.emailExist(email);
    logger.debug('existingUser: %s', existingUser);
    if (existingUser) {
      return BadRequest(res, {
        message: 'An account with this email already exists',
        result: {},
      });
    }
    /**
     * * creating new User model object and generating password salt.
     */
    const user = new User({
      email: email,
      password: password,
      isVerified: true,
    });
    logger.debug('user: %s', user);
    /**
     * * generate access token.
     */
    const accessToken = await signAccessToken(user);
    /**
     * * generate refresh token.
     */
    const refreshToken = await signRefreshToken(user);
    /**
     * * save user to mongoDB
     */
    const result = await user.save();
    /**
     * * generate verify-sign-up response body
     */
    result._doc = {
      ...result._doc,
      accessToken,
      refreshToken,
    };
    /**
     * * send 201 created response
     */
    return Created(res, {
      message: 'Sign-Up successful',
      result,
    });
  } catch (error) {
    logger.error('continue-sign-up-error:', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
continueSignIn = async (req, res, next) => {
  try {
    /**
     * * get validateVerificationResponse value form res.locals
     */
    const { email } = res.locals.validateVerificationResponse;
    /**
     * * check if user email doesn't exists, send 400 bad request
     */
    const user = await User.emailExist(email);
    logger.debug('user: %s', user);
    if (!user) {
      return BadRequest(res, {
        message: 'This email is not registered, SignUp first',
        result: {},
      });
    }
    /**
     * * generate access token.
     */
    const accessToken = await signAccessToken(user);
    /**
     * * generate refresh token.
     */
    const refreshToken = await signRefreshToken(user);
    /**
     * * generate sing-in response body
     */
    const result = {
      accessToken,
      refreshToken,
    };
    /**
     * * Send 200 success response
     */
    return Success(res, {
      message: 'Sign-In successful',
      result: result,
    });
  } catch (error) {
    logger.error('continue-sign-in-error:', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
verifyAuth = async (req, res, next) => {
  try {
    /**
     * * get passed OTP code value form the res.locals
     */
    const code = res.locals.code;
    /**
     * * get validateVerificationResponse value form res.locals
     */
    const { actionType, otp, tokenType } =
      res.locals.validateVerificationResponse;
    /**
     * * if decoded token type is not verify, send 401 unauthorized
     */
    if (tokenType && tokenType != TokenType.Verify) {
      return Unauthorized(res, {
        message: 'Invalid token',
        result: {},
      });
    }
    /**
     * * if provided code is not equal to redis otp, send 400 bad request
     */
    if (otp && otp != code) {
      return BadRequest(res, {
        message: 'Invalid code',
        result: {},
      });
    }
    /**
     * * now check  AuthActionType of the verification token redis response
     * * if sign-up then continueSingUp(req, res, next)
     * * if sign-in then continueSignIn(req, res, next)
     */
    if (actionType && actionType == AuthActionType.signUp) {
      await continueSingUp(req, res, next);
    } else if (actionType && actionType == AuthActionType.signIn) {
      await continueSignIn(req, res, next);
    }
  } catch (error) {
    logger.error('verify-auth-error:', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
forgotPassword = async (req, res, next) => {
  try {
    /**
     * * get {email} form request body
     * * if email not provided send 400 bad request
     */
    const { email } = req.body;
    if (!email) {
      return BadRequest(res, {
        message: 'Email not provided',
        result: {},
      });
    }
    /**
     * * check if email doesn't exists, send 400 bad request
     */
    const user = await User.emailExist(email);
    logger.debug('user: %s', user);
    if (!user) {
      return BadRequest(res, {
        message: 'This email is not registered, SignUp first',
        result: {},
      });
    }
    /**
     * * generate OTP for change password
     */
    const OTP = generateOtp(8);
    logger.debug('OTP: %s', OTP);
    /**
     * * generate change password token payload that needs to be stored in redis
     */
    const changePasswordTokenPayload =
      generateChangePasswordTokenPayloadForRedis(
        email,
        TokenType.ChangePassword,
        OTP,
      );
    /**
     * * generate change password token identity hash for redis key
     */
    const changePasswordTokenIdentity = generateIdentityHash(
      JSON.stringify(changePasswordTokenPayload),
    );
    /**
     * * generate change password token.
     */
    const changePasswordToken = await signChangePasswordToken(
      changePasswordTokenIdentity,
      changePasswordTokenPayload,
    );
    /**
     * * generate forgot password response body
     */
    const result = {
      token: changePasswordToken,
      code: OTP,
    };
    /**
     * * send 200 success response
     */
    return Success(res, {
      message:
        'please provided verification code for successful change-password',
      result,
    });
  } catch (error) {
    logger.error('forgot-password-error:', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
changePassword = async (req, res, next) => {
  try {
    /**
     * * get the passed token value form the res.locals
     */
    const token = res.locals.token;
    /**
     * * get the passed OTP code value form the res.locals
     */
    const code = res.locals.code;
    /**
     * * check if password is given in the body
     * * if there is no verification code or password send 400 bad request
     */
    const { new_password } = req.body;
    if (!new_password) {
      return BadRequest(res, {
        message: 'Password was not provided',
        result: {},
      });
    }
    /**
     * * decode change password token and check if the token is a valid token
     * * jwt token related error send 401 unauthorized
     * * if the decoded token identity is not present in redis send 401 unauthorized
     * * Token is a valid token then fetch the token data from redis return data.
     * @package verifyChangePasswordToken(token, res)
     */
    const { email, type, otp } = await verifyChangePasswordToken(token, res);
    if (email && type && otp) {
      /**
       * * if decoded token type is not change password, send 401 unauthorized
       */
      if (type != TokenType.ChangePassword) {
        return Unauthorized(res, {
          message: 'Invalid token',
          result: {},
        });
      }
      /**
       * * if provided code is not equal to redis otp, send 400 bad request
       */
      if (otp != code) {
        return BadRequest(res, {
          message: 'Invalid code',
          result: {},
        });
      }
      /**
       * * check if user email doesn't exists, send 400 bad request
       */
      const user = await User.emailExist(email);
      logger.debug('user: %s', user);
      if (!user) {
        return BadRequest(res, {
          message: 'This email is not registered, SignUp first',
          result: {},
        });
      }
      /**
       * * compare the new_password with the existing password
       * * if the new_password and the old_password is same send 409 conflict
       */
      const comparePassword = await user.validPassword(new_password);
      logger.debug('comparePassword: %s', comparePassword);
      if (comparePassword) {
        return Conflict(res, {
          message:
            'Provided password is among the old passwords, please try with a different password',
          result: {},
        });
      }
      /**
       * * generate hash form the new_password
       * * sand assign the newPasswordHash as the current password
       * * then save the user with new password
       */
      const newPasswordHash = await User.generateHash(new_password);
      user.password = newPasswordHash;
      await user.save();
      /**
       * * send 200 success response
       */
      return Success(res, {
        message: 'Successfully changed password',
        result: {},
      });
    }
  } catch (error) {
    logger.error('change-password-error:', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
refresh = async (req, res, next) => {
  try {
    /**
     * * get validateRefreshResponse value form res.locals
     */
    const { email, type, identity, exp } = res.locals.validateRefreshResponse;
    if (email && type && identity && exp) {
      /**
       * * if decoded token type is not refresh, send 401 unauthorized
       */
      if (type && type != TokenType.Refresh) {
        return Unauthorized(res, {
          message: 'Invalid token',
          result: {},
        });
      }
      /**
       * * check if user email doesn't exists, send 400 bad request
       */
      const user = await User.emailExist(email);
      logger.debug('user: %s', user);
      if (!user) {
        return BadRequest(res, {
          message: 'This email is not registered, SignUp first',
          result: {},
        });
      }

      /**
       * * blacklist existing token identity and then generate new access and refresh token pair
       */
      const backListTokenIdentityResponse = await setIdentityToBlacklist(
        identity,
        exp,
      );
      logger.debug(
        'backListTokenIdentityResponse: %s',
        backListTokenIdentityResponse,
      );
      /**
       * * generate access token.
       */
      const accessToken = await signAccessToken(user);

      /**
       * * generate refresh token.
       */
      const refreshToken = await signRefreshToken(user);
      /**
       * * generate sing-in response body
       */
      const result = {
        accessToken,
        refreshToken,
      };
      /**
       * * Send 200 success response
       */
      return Success(res, {
        message: 'new access and refresh token generation successful',
        result: result,
      });
    }
  } catch (error) {
    logger.error('refresh-error:', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
revokeAccessToken = async (req, res, next) => {
  try {
    /**
     * * get validateAccessResponse value form res.locals
     */
    const { email, type, identity, exp } = res.locals.validateAccessResponse;
    if (email && type && identity && exp) {
      /**
       * * if decoded token type is not refresh, send 401 unauthorized
       */
      if (type && type != TokenType.Access) {
        return Unauthorized(res, {
          message: 'Invalid token',
          result: {},
        });
      }
      /**
       * * check if user email doesn't exists, send 400 bad request
       */
      const user = await User.emailExist(email);
      logger.debug('user: %s', user);
      if (!user) {
        return BadRequest(res, {
          message: 'This email is not registered, SignUp first',
          result: {},
        });
      }
      /**
       * * blacklist access token identity and then delete the access token identity
       */
      const backListTokenIdentityResponse = await setIdentityToBlacklist(
        identity,
        exp,
      );
      logger.debug(
        'backListTokenIdentityResponse: %s',
        backListTokenIdentityResponse,
      );
      const deleteTokenIdentityResponse = await deleteIdentity(identity);
      logger.debug(
        'deleteTokenIdentityResponse: %s',
        deleteTokenIdentityResponse,
      );
      /**
       * * Send 200 success response
       */
      return Success(res, {
        message: 'Token revoked successful',
        result: {},
      });
    }
  } catch (error) {
    logger.error('revoke-access-token-error:', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
revokeRefreshToken = async (req, res, next) => {
  try {
    /**
     * * get validateRefreshResponse value form res.locals
     */
    const { email, type, identity, exp } = res.locals.validateRefreshResponse;
    if (email && type && identity && exp) {
      /**
       * * if decoded token type is not refresh, send 401 unauthorized
       */
      if (type && type != TokenType.Refresh) {
        return Unauthorized(res, {
          message: 'Invalid token',
          result: {},
        });
      }
      /**
       * * check if user email doesn't exists, send 400 bad request
       */
      const user = await User.emailExist(email);
      logger.debug('user: %s', user);
      if (!user) {
        return BadRequest(res, {
          message: 'This email is not registered, SignUp first',
          result: {},
        });
      }

      /**
       * * blacklist existing token identity and then delete the refresh token identity
       */
      const backListTokenIdentityResponse = await setIdentityToBlacklist(
        identity,
        exp,
      );
      logger.debug(
        'backListTokenIdentityResponse: %s',
        backListTokenIdentityResponse,
      );
      const deleteTokenIdentityResponse = await deleteIdentity(identity);
      logger.debug(
        'deleteTokenIdentityResponse: %s',
        deleteTokenIdentityResponse,
      );
      /**
       * * Send 200 success response
       */
      return Success(res, {
        message: 'Token revoked successful',
        result: {},
      });
    }
  } catch (error) {
    logger.error('revoke-refresh-token-error:', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: error,
    });
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
  verifyAuth,
  forgotPassword,
  changePassword,
  refresh,
  revokeAccessToken,
  revokeRefreshToken,
};
