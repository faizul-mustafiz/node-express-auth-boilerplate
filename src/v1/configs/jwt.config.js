require('dotenv').config();
const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY_TIME,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY_TIME,
  VERIFY_TOKEN_SECRET,
  VERIFY_TOKEN_EXPIRY_TIME,
  RESET_PASSWORD_TOKEN_SECRET,
  RESET_PASSWORD_TOKEN_EXPIRY_TIME,
  CHANGE_PASSWORD_TOKEN_SECRET,
  CHANGE_PASSWORD_TOKEN_EXPIRY_TIME,
  PUBLIC_KEY,
  PRIVATE_KEY,
} = require('../environments');

const accessToken = {
  secret: ACCESS_TOKEN_SECRET,
  expiryTime: ACCESS_TOKEN_EXPIRY_TIME,
};

const refreshToken = {
  secret: REFRESH_TOKEN_SECRET,
  expiryTime: REFRESH_TOKEN_EXPIRY_TIME,
};

const verifyToken = {
  verifyTokenSecret: VERIFY_TOKEN_SECRET,
  expiryTime: VERIFY_TOKEN_EXPIRY_TIME,
};

const resetPasswordToken = {
  secret: RESET_PASSWORD_TOKEN_SECRET,
  expiryTime: RESET_PASSWORD_TOKEN_EXPIRY_TIME,
};

const changePasswordToken = {
  secret: CHANGE_PASSWORD_TOKEN_SECRET,
  expiryTime: CHANGE_PASSWORD_TOKEN_EXPIRY_TIME,
};

module.exports = {
  accessToken,
  refreshToken,
  verifyToken,
  resetPasswordToken,
  changePasswordToken,
  publicKey: PUBLIC_KEY,
  privateKey: PRIVATE_KEY,
};
