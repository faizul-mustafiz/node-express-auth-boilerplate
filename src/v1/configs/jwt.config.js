require('dotenv').config();
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  VERIFY_TOKEN_SECRET,
  RESET_PASSWORD_TOKEN_SECRET,
  CHANGE_PASSWORD_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY_TIME,
  REFRESH_TOKEN_EXPIRY_TIME,
  PUBLIC_KEY,
  PRIVATE_KEY,
} = require('../environments');

module.exports = {
  accessTokenSecret: ACCESS_TOKEN_SECRET,
  refreshTokenSecret: REFRESH_TOKEN_SECRET,
  verifyTokenSecret: VERIFY_TOKEN_SECRET,
  resetPasswordTokenSecret: RESET_PASSWORD_TOKEN_SECRET,
  changePasswordTokenSecret: CHANGE_PASSWORD_TOKEN_SECRET,
  accessTokenExpiryTime: ACCESS_TOKEN_EXPIRY_TIME,
  refreshTokenExpiryTime: REFRESH_TOKEN_EXPIRY_TIME,
  publicKey: PUBLIC_KEY,
  privateKey: PRIVATE_KEY,
};
