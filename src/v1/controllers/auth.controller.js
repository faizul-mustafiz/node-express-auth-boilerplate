require('dotenv');
const User = require('../models/user.model');
const {
  signAccessToken,
  signRefreshToken,
  signVerifyToken,
  signChangePasswordToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyVerificationToken,
  verifyChangePasswordToken,
} = require('../helpers/jwt.helper');
const {
  generateIdentityHash,
  generateVerifyTokenPayloadForRedis,
  generateOtp,
  generateChangePasswordTokenPayloadForRedis,
} = require('../utility/jwt.utility');

const TokenType = require('../enums/token-type.enum');
const {
  setIdentityToBlacklist,
  deleteIdentity,
} = require('../helpers/redis.helper');
signUp = async (req, res, next) => {
  try {
    /**
     * * get {email, password } form request body
     * * if any of these not provided send 400 bad request
     */
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Any of these fields {email, password} not provided',
        result: {},
      });
    }
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
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
        result: {},
      });
    }
    /**
     * * generate OTP for verify sign-up
     */
    const OTP = generateOtp(8);
    /**
     * * generate verify token payload that needs to be stored in redis
     */
    const verifyTokenPayload = generateVerifyTokenPayloadForRedis(
      email,
      password,
      TokenType.Verify,
      OTP,
    );
    /**
     * * generate verify token identity hash for redis key
     */
    const verifyTokenIdentity = generateIdentityHash(
      JSON.stringify(verifyTokenPayload),
    );
    /**
     * * generate verify token
     */
    const verifyToken = await signVerifyToken(
      verifyTokenIdentity,
      verifyTokenPayload,
    );
    /**
     * * generate verify token response
     */
    const result = {
      verify_token: verifyToken,
      code: OTP,
    };
    /**
     * * send 200 success response
     */
    res.status(200).json({
      success: true,
      message: 'Please provided verification code for successful sign-up',
      result,
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
signIn = async (req, res, next) => {
  try {
    /**
     * * get {email, password } form request body
     * * if any of these not provided send 400 bad request
     */
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Any of these fields {email, password} not provided',
        result: {},
      });
    }
    /**
     * * check if user email doesn't exists, send 400 bad request
     */
    const user = await User.emailExist(email);
    console.log('user', user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'This email is not registered, SignUp first',
        result: {},
      });
    }
    /**
     * * compare the request password and db password
     * * if password doesn't match send 400 bad request
     */
    const comparePassword = await user.validPassword(password);
    console.log('comparePassword', comparePassword);
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password',
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
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      result: result,
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
signOut = async (req, res, next) => {
  await revokeRefreshToken(req, res, next);
};
verifySingUp = async (req, res, next) => {
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
     * * decode verification token and check if the token is a valid token
     * * jwt token related error send 401 unauthorized
     * * if the decoded token identity is not present in redis send 401 unauthorized
     * * Token is a valid token then fetch the token data from redis return data.
     * @package verifyVerificationToken(token, res)
     */
    const { email, password, type, otp } = await verifyVerificationToken(
      token,
      res,
    );
    if (email && password && type && otp) {
      /**
       * * if decoded token type is not verify, send 401 unauthorized
       */
      if (type != TokenType.Verify) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
          result: {},
        });
      }
      /**
       * * if provided code is not equal to redis otp, send 400 bad request
       */
      if (otp != code) {
        return res.status(400).json({
          success: false,
          message: 'Invalid code',
          result: {},
        });
      }
      /**
       * * check if email exists, send 400 bad request
       */
      const existingUser = await User.emailExist(email);
      console.log('existingUser', existingUser);
      if (existingUser) {
        return res.status(400).json({
          success: false,
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
      console.log('user', user);
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
      res.status(201).json({
        success: true,
        message: 'Sign-Up successful',
        result,
      });
    }
  } catch (error) {
    console.log('catch-error', error);
    return res.status(500).json({
      success: false,
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
verifySignIn = async (req, res, next) => {};
forgotPassword = async (req, res, next) => {
  try {
    /**
     * * get {email} form request body
     * * if email not provided send 400 bad request
     */
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not provided',
        result: {},
      });
    }
    /**
     * * check if email doesn't exists, send 400 bad request
     */
    const user = await User.emailExist(email);
    console.log('user', user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'This email is not registered, SignUp first',
        result: {},
      });
    }
    /**
     * * generate OTP for change password
     */
    const OTP = generateOtp(8);
    console.log('OTP', OTP);
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
    res.status(200).json({
      success: true,
      message:
        'please provided verification code for successful change-password',
      result,
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
      return res.status(400).json({
        success: false,
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
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
          result: {},
        });
      }
      /**
       * * if provided code is not equal to redis otp, send 400 bad request
       */
      if (otp != code) {
        return res.status(400).json({
          success: false,
          message: 'Invalid code',
          result: {},
        });
      }
      /**
       * * check if user email doesn't exists, send 400 bad request
       */
      const user = await User.emailExist(email);
      console.log('user', user);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'This email is not registered, SignUp first',
          result: {},
        });
      }
      /**
       * * compare the new_password with the existing password
       * * if the new_password and the old_password is same send 409 conflict
       */
      const comparePassword = await user.validPassword(new_password);
      console.log('comparePassword', comparePassword);
      if (comparePassword) {
        return res.status(409).json({
          success: false,
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
      res.status(200).json({
        success: true,
        message: 'Successfully changed password',
        result: {},
      });
    }
  } catch (error) {
    console.log('catch-error', error);
    return res.status(500).json({
      success: false,
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
refresh = async (req, res, next) => {
  try {
    /**
     * * get the passed token value form the res.locals
     */
    const token = res.locals.token;
    /**
     * * decode refresh token and check if the token is a valid token
     * * jwt token related error send 401 unauthorized
     * * if the decoded token identity is not present in redis send 401 unauthorized
     * * Token is a valid token then fetch the token data from redis return data.
     * @package verifyRefreshToken(token, res)
     */
    const { email, type, identity, exp } = await verifyRefreshToken(token, res);
    if (email && type && identity && exp) {
      /**
       * * if decoded token type is not refresh, send 401 unauthorized
       */
      if (type && type != TokenType.Refresh) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
          result: {},
        });
      }
      /**
       * * check if user email doesn't exists, send 400 bad request
       */
      const user = await User.emailExist(email);
      console.log('user', user);
      if (!user) {
        return res.status(400).json({
          success: false,
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
      console.log(
        'backListTokenIdentityResponse',
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
      return res.status(200).json({
        success: true,
        message: 'new access and refresh token generation successful',
        result: result,
      });
    }
  } catch (error) {
    console.log('catch-error', error);
    return res.status(500).json({
      success: false,
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
revokeAccessToken = async (req, res, next) => {
  try {
    /**
     * * get the passed token value form the res.locals
     */
    const token = res.locals.token;
    /**
     * * decode access token and check if the token is a valid token
     * * jwt token related error send 401 unauthorized
     * * if the decoded token identity is not present in redis send 401 unauthorized
     * * Token is a valid token then fetch the token data from redis return data.
     * @package verifyAccessToken(token, res)
     */
    const { email, type, identity, exp } = await verifyAccessToken(token, res);
    if (email && type && identity && exp) {
      /**
       * * if decoded token type is not refresh, send 401 unauthorized
       */
      if (type && type != TokenType.Access) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
          result: {},
        });
      }
      /**
       * * check if user email doesn't exists, send 400 bad request
       */
      const user = await User.emailExist(email);
      console.log('user', user);
      if (!user) {
        return res.status(400).json({
          success: false,
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
      console.log(
        'backListTokenIdentityResponse',
        backListTokenIdentityResponse,
      );
      const deleteTokenIdentityResponse = await deleteIdentity(identity);
      console.log('deleteTokenIdentityResponse', deleteTokenIdentityResponse);
      /**
       * * Send 200 success response
       */
      return res.status(200).json({
        success: true,
        message: 'Token revoked successful',
        result: {},
      });
    }
  } catch (error) {
    console.log('catch-error', error);
    return res.status(500).json({
      success: false,
      message: 'oops! there is an Error',
      result: error,
    });
  }
};
revokeRefreshToken = async (req, res, next) => {
  try {
    /**
     * * get the passed token value form the res.locals
     */
    const token = res.locals.token;
    /**
     * * decode refresh token and check if the token is a valid token
     * * jwt token related error send 401 unauthorized
     * * if the decoded token identity is not present in redis send 401 unauthorized
     * * Token is a valid token then fetch the token data from redis return data.
     * @package verifyRefreshToken(token, res)
     */
    const { email, type, identity, exp } = await verifyRefreshToken(token, res);
    if (email && type && identity && exp) {
      /**
       * * if decoded token type is not refresh, send 401 unauthorized
       */
      if (type && type != TokenType.Refresh) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
          result: {},
        });
      }
      /**
       * * check if user email doesn't exists, send 400 bad request
       */
      const user = await User.emailExist(email);
      console.log('user', user);
      if (!user) {
        return res.status(400).json({
          success: false,
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
      console.log(
        'backListTokenIdentityResponse',
        backListTokenIdentityResponse,
      );
      const deleteTokenIdentityResponse = await deleteIdentity(identity);
      console.log('deleteTokenIdentityResponse', deleteTokenIdentityResponse);
      /**
       * * Send 200 success response
       */
      return res.status(200).json({
        success: true,
        message: 'Token revoked successful',
        result: {},
      });
    }
  } catch (error) {
    console.log('catch-error', error);
    return res.status(500).json({
      success: false,
      message: 'oops! there is an Error',
      result: error,
    });
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
  verifySingUp,
  verifySignIn,
  forgotPassword,
  changePassword,
  refresh,
  revokeAccessToken,
  revokeRefreshToken,
};
