require('dotenv');
const User = require('../models/user.model');

signUp = async (req, res, next) => {
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
    const user = new User({ email: email, password: password });
    user.password = await User.generateHash(password);
    console.log('user', user);
    const result = await user.save();
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
signIn = async (req, res, next) => {};
signOut = async (req, res, next) => {};
verify = async (req, res, next) => {};
resetPassword = async (req, res, next) => {};
changePassword = async (req, res, next) => {};
revokeAccessToken = async (req, res, next) => {};
revokeRefreshToken = async (req, res, next) => {};

module.exports = {
  signUp,
  signIn,
  signOut,
  verify,
  resetPassword,
  changePassword,
  revokeAccessToken,
  revokeRefreshToken,
};
