const _crypto = require('crypto');
const uuid = require('uuid').v4();

/**
 * * The data must be of type string or an instance of Buffer, TypedArray, or DataView.
 * *If you want to pass json first stringify and then pass the data.
 */
generateIdentityHash = (data) => {
  return _crypto.createHash('sha1').update(data).digest('hex');
};
generateTokenId = () => {
  return uuid;
};
generateTokenPayloadForRedis = (user, type) => {
  return {
    user_id: user.id,
    user_email: user.email,
    type: type,
  };
};
module.exports = {
  generateIdentityHash,
  generateTokenId,
  generateTokenPayloadForRedis,
};
