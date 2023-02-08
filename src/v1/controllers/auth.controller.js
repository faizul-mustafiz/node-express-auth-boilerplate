require('dotenv');
const User = require('../models/schema/user.model');
const {
  signAccessToken,
  signRefreshToken,
  signVerifyToken,
} = require('../helpers/jwt.helper');
const {
  generateIdentityHash,
  generateTokenPayloadForRedis,
  generateVerifyTokenPayloadForRedis,
  generateOtp,
} = require('../utility/jwt.utility');

const TokenType = require('../models/static/token-type.model');
signUp = async (req, res, next) => {
  try {
    let { email, password } = req.body;
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
      otp: OTP,
    };

    res.status(200).json({
      success: true,
      message: 'Please verify OTP for successful sign-up',
      result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Oops there is an Error', result: {} });
  }
};
signIn = async (req, res, next) => {};
signOut = async (req, res, next) => {};
verify = async (req, res, next) => {
  try {
    const { email, password } = req.body;
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
    const user = new User({ email: email, password: password });
    user.password = await User.generateHash(password);
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
    res.status(201).json({
      success: true,
      message: 'Successfully use created',
      result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Oops there is an Error', result: {} });
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
  verify,
  resetPassword,
  changePassword,
  refresh,
  revokeAccessToken,
  revokeRefreshToken,
};
