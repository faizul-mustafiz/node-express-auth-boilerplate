require('dotenv');
const User = require('../models/user.model');
const {
  signAccessToken,
  signRefreshToken,
  signVerifyToken,
  verifyVerificationToken,
  verifyAccessToken,
} = require('../helpers/jwt.helper');
const {
  generateIdentityHash,
  generateTokenPayloadForRedis,
  generateVerifyTokenPayloadForRedis,
  generateOtp,
  getAuthorizationHeader,
  splitAuthorizationHeader,
} = require('../utility/jwt.utility');

const TokenType = require('../enums/token-type.enum');
signUp = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Any of these fields {email, password} not provided',
        result: {},
      });
    }

    password = await User.generateHash(password);
    const existingUser = await User.emailExist(email);
    console.log('existingUser', existingUser);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
        result: {},
      });
    }

    const OTP = generateOtp(8);
    console.log('OTP', OTP);

    /**
     * * generate verify token payload data that needs to be stored in redis
     */
    const verifyTokenPayload = generateVerifyTokenPayloadForRedis(
      email,
      password,
      TokenType.Verify,
      OTP,
    );
    console.log('verifyTokenPayload', verifyTokenPayload);
    /**
     * * generate verify token identity hash for redis key
     */
    const verifyTokenIdentity = generateIdentityHash(
      JSON.stringify(verifyTokenPayload),
    );
    /**
     * * generate verify token.
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

    res.status(200).json({
      success: true,
      message: 'Please provided verification code for successful sign-up',
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Oops there is an Error',
      result: error,
    });
  }
};
signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Any of these fields {email, password} not provided',
        result: {},
      });
    }
    /**
     * * Check if the user email exists, send 400 bad request
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
     * * generate access token payload data that needs to be stored in redis
     */
    const accessTokenPayload = generateTokenPayloadForRedis(
      user,
      TokenType.Access,
    );
    /**
     * * generate access token identity hash for redis key
     */
    const accessTokenIdentity = generateIdentityHash(
      JSON.stringify(accessTokenPayload),
    );
    /**
     * * generate access token.
     */
    const accessToken = await signAccessToken(
      accessTokenIdentity,
      accessTokenPayload,
    );
    /**
     * * generate refresh token payload data that needs to be stored in redis
     */
    const refreshTokenPayload = generateTokenPayloadForRedis(
      user,
      TokenType.Refresh,
    );
    /**
     * * generate refresh token identity hash for redis key
     */
    const refreshTokenIdentity = generateIdentityHash(
      JSON.stringify(refreshTokenPayload),
    );
    /**
     * * generate refresh token.
     */
    const refreshToken = await signRefreshToken(
      refreshTokenIdentity,
      refreshTokenPayload,
    );
    const result = {
      accessToken,
      refreshToken,
    };
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      result: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Oops there is an Error',
      result: error,
    });
  }
};
signOut = async (req, res, next) => {};
verifySingUp = async (req, res, next) => {
  try {
    /**
     * * Check if verification code is given in the body
     * * If there is no verification code send 400 bad request
     */
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Verification code was not provided',
        result: {},
      });
    }
    /**
     * * Check if authorization header exists
     * * If there is no authorization header send 403 forbidden
     */
    const authorization = getAuthorizationHeader(req);
    if (!authorization) {
      return res.status(403).json({
        success: false,
        message: 'Authorization header is not present',
        result: {},
      });
    }
    /**
     * * Check if Bearer and Token header exists
     * * If the token format is not Bearer [token] format send 403 forbidden
     */
    const { bearer, token } = splitAuthorizationHeader(authorization);
    if (!bearer) {
      return res.status(403).json({
        success: false,
        message: 'Format for authorization: Bearer [token]',
        result: {},
      });
    }
    if (!token) {
      return res.status(403).json({
        success: false,
        message: 'Verification token was not provided',
        result: {},
      });
    }
    /**
     * * Decode verification token and check if the token is a valid token
     * * jwt token related error send 401 unauthorized
     * * if the decoded token identity is not present in redis send 401 unauthorized
     * * Token is a valid token then fetch the token data from redis return data.
     * @package verifyVerificationToken(token, res)
     *
     */
    const { email, password, otp, type } = await verifyVerificationToken(
      token,
      res,
    );
    /**
     * * If decoded token type is not verify, send 401 unauthorized
     */
    if (type != TokenType.Verify) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        result: {},
      });
    }
    /**
     * * If provided code is not equal to redis otp, send 400 bad request
     */
    if (otp != code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid code',
        result: {},
      });
    }
    /**
     * * Check if the user email exists, send 400 bad request
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
     * * generate access token payload data that needs to be stored in redis
     */
    const accessTokenPayload = generateTokenPayloadForRedis(
      user,
      TokenType.Access,
    );
    /**
     * * generate access token identity hash for redis key
     */
    const accessTokenIdentity = generateIdentityHash(
      JSON.stringify(accessTokenPayload),
    );
    /**
     * * generate access token.
     */
    const accessToken = await signAccessToken(
      accessTokenIdentity,
      accessTokenPayload,
    );
    /**
     * * generate refresh token payload data that needs to be stored in redis
     */
    const refreshTokenPayload = generateTokenPayloadForRedis(
      user,
      TokenType.Refresh,
    );
    /**
     * * generate refresh token identity hash for redis key
     */
    const refreshTokenIdentity = generateIdentityHash(
      JSON.stringify(refreshTokenPayload),
    );
    /**
     * * generate refresh token.
     */
    const refreshToken = await signRefreshToken(
      refreshTokenIdentity,
      refreshTokenPayload,
    );
    /**
     * * save user to mongoDB
     */
    const result = await user.save();
    /**
     * * appending  access_token & refresh_token with user save response
     */
    result._doc = {
      ...result._doc,
      accessToken,
      refreshToken,
    };
    /**
     * * Send 201 created request
     */
    res.status(201).json({
      success: true,
      message: 'Successfully use created',
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Oops there is an Error',
      result: error,
    });
  }
};
resetPassword = async (req, res, next) => {};
changePassword = async (req, res, next) => {};
refresh = async (req, res, next) => {};
revokeAccessToken = async (req, res, next) => {};
revokeRefreshToken = async (req, res, next) => {};

module.exports = {
  signUp,
  signIn,
  signOut,
  verifySingUp,
  resetPassword,
  changePassword,
  refresh,
  revokeAccessToken,
  revokeRefreshToken,
};
