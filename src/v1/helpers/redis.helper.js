const redisClient = require('../plugins/redis.plugin');
const { base64ToJson } = require('../helpers/conversion.helper');

saveTokenIdentityWithPayload = async (identity, expiry, payload) => {
  console.log('identity', identity);
  console.log('expiry', expiry);
  console.log('payload', payload);
  try {
    let result = await redisClient.hSet(identity, [
      'user_id',
      payload.user_id,
      'user_email',
      payload.user_email,
    ]);
    result = await redisClient.expireAt(identity, expiry);
    console.log('setTokenIdentity-result', result);
  } catch (error) {
    console.log('setTokenIdentity-error', error);
  }
};

addTokenToBlacklist = async (identity, expiry) => {
  try {
    const result = await redisClient.setEx(`bl_${identity}`, expiry, '');
    console.log('setTokenId-result', result);
  } catch (error) {
    console.log('setTokenId-error', error);
  }
};

getTokenPayload = async (identity) => {
  try {
    let result = await redisClient.hGetAll(identity);
    console.log('getTokenPayload-result', result);
    return result;
  } catch (error) {
    console.log('getTokenPayload-error', error);
  }
};

isTokenIdentityExists = async (identity) => {
  try {
    let result = await redisClient.exists(identity);
    console.log('isTokenIdentityExists-result', result);
    return result;
  } catch (error) {
    console.log('isTokenIdentityExists-error', error);
  }
};

isTokenBlacklisted = async (identity) => {
  try {
    let result = await redisClient.exists(`bl_${identity}`);
    console.log('isTokenBlacklisted-result', result);
    return result;
  } catch (error) {
    console.log('isTokenBlacklisted-error', error);
  }
};

deleteTokenPayload = async (identity) => {
  try {
    let result = await redisClient.del(identity);
    console.log('deleteTokenPayload-result', result);
  } catch (error) {
    console.log('deleteTokenPayload-error', error);
  }
};

deleteBlacklistedToken = async (identity) => {
  try {
    let result = await redisClient.del(`bl_${identity}`);
    console.log('deleteBlacklistedToken-result', result);
  } catch (error) {
    console.log('deleteBlacklistedToken-error', error);
  }
};

module.exports = {
  saveTokenIdentityWithPayload,
  addTokenToBlacklist,
  getTokenPayload,
  isTokenIdentityExists,
  isTokenBlacklisted,
  deleteTokenPayload,
  deleteBlacklistedToken,
};
