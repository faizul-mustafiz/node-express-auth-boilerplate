const redisClient = require('../plugins/redis.plugin');
const { base64ToJson } = require('../helpers/conversion.helper');

setTokenIdentity = async (identity, expiry, payload) => {
  try {
    const result = await redisClient.setEx(identity, expiry, payload);
    console.log('setTokenIdentity-result', result);
  } catch (error) {
    console.log('setTokenIdentity-error', error);
  }
};

setTokenId = async (tokenId, expiry) => {
  try {
    const result = await redisClient.setEx(tokenId, expiry, '');
    console.log('setTokenId-result', result);
  } catch (error) {
    console.log('setTokenId-error', error);
  }
};

getTokenByIdentity = async (identity) => {
  try {
    let result = await redisClient.get(identity);
    console.log('getTokenByIdentity-result', result);
    return base64ToJson(result);
  } catch (error) {
    console.log('getTokenByIdentity-error', error);
  }
};

isTokenBlacklisted = async (tokenId) => {
  try {
    let result = await redisClient.get(identity);
    console.log('isTokenBlacklisted-result', result);
    return result;
  } catch (error) {
    console.log('isTokenBlacklisted-error', error);
  }
};

deleteKey = async (key) => {
  try {
    let result = await redisClient.del(key);
    console.log('deleteKey-result', result);
  } catch (error) {
    console.log('deleteKey-error', error);
  }
};

module.exports = {
  setTokenIdentity,
  setTokenId,
  getTokenByIdentity,
  isTokenBlacklisted,
  deleteKey,
};
