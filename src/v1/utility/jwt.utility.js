const _crypto = require('crypto');
const uuid = require('uuid').v4();

// The data must be of type string or an instance of Buffer, TypedArray, or DataView.
// If you want to pass json first stringify and then pass the data.
generateIdentityHash = (data) => {
  return _crypto.createHash('md5').update(data).digest('hex');
};
generateTokenId = () => {
  return uuid;
};

generateAccessTokenData = (user) => {
  return {
    user_id: user._id,
    user_email: user.email,
    type: 'access',
  };
};
generateRefreshTokenData = (user) => {
  return {
    user_id: user._id,
    user_email: user.email,
    type: 'refresh',
  };
};

module.exports = {
  generateIdentityHash,
  generateTokenId,
  generateAccessTokenData,
  generateRefreshTokenData,
};
