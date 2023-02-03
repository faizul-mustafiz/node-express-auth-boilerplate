const _crypto = require('crypto');
const accessToken = _crypto.randomBytes(64).toString('hex');
const refreshToken = _crypto.randomBytes(64).toString('hex');
const verifyToken = _crypto.randomBytes(32).toString('hex');
const changePasswordToken = _crypto.randomBytes(32).toString('hex');
const resetPasswordToken = _crypto.randomBytes(32).toString('hex');
console.table({
  accessToken,
  refreshToken,
  verifyToken,
  changePasswordToken,
  resetPasswordToken,
});
