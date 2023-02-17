const redisClient = require('../plugins/redis.plugin');
const { jsonToArray } = require('../helpers/conversion.helper');

/**
 * * generic reusable methods for tokens
 */
isIdentityExists = async (identity) => {
  try {
    let result = await redisClient.exists(identity);
    console.log('isIdentityExists-result', result);
    return result;
  } catch (error) {
    console.log('isIdentityExists-error', error);
  }
};
setIdentityWithHSet = async (identity, expiry, payload) => {
  try {
    const payloadArray = jsonToArray(payload);
    let result = await redisClient.hSet(identity, payloadArray);
    result = await redisClient.expireAt(identity, expiry);
    console.log('setIdentityWithHSet-result', result);
    return result;
  } catch (error) {
    console.log('setIdentityWithHSet-error', error);
  }
};
setIdentity = async (identity, expiry, payload) => {
  try {
    let result = await redisClient.set(identity, payload);
    result = await redisClient.expireAt(identity, expiry);
    console.log('saveTokenIdentity-result', result);
    return result;
  } catch (error) {
    console.log('saveTokenIdentity-error', error);
  }
};
getHSetIdentityPayload = async (identity) => {
  try {
    let result = await redisClient.hGetAll(identity);
    console.log('getTokenPayload-result', result);
    return result;
  } catch (error) {
    console.log('getTokenPayload-error', error);
  }
};
deleteIdentity = async (identity) => {
  try {
    let result = await redisClient.del(identity);
    console.log('deleteTokenPayload-result', result);
    return result;
  } catch (error) {
    console.log('deleteTokenPayload-error', error);
  }
};

/**
 * * access and refresh token identity blacklist related methods
 */
isIdentityBlacklisted = async (identity) => {
  try {
    let result = await redisClient.exists(`bl:${identity}`);
    console.log('isIdentityBlacklisted-result', result);
    return result;
  } catch (error) {
    console.log('isIdentityBlacklisted-error', error);
  }
};
setIdentityToBlacklist = async (identity, expiry) => {
  try {
    const result = await setIdentity(`bl:${identity}`, expiry, '');
    console.log('setIdentityToBlacklist-result', result);
    return result;
  } catch (error) {
    console.log('setIdentityToBlacklist-error', error);
  }
};
deleteBlacklistedIdentity = async (identity) => {
  try {
    let result = await deleteIdentity(`bl:${identity}`);
    console.log('deleteBlacklistedIdentity-result', result);
    return result;
  } catch (error) {
    console.log('deleteBlacklistedIdentity-error', error);
  }
};

/**
 * * verify token related methods
 */
isVerifyTokenIdentityExists = async (identity) => {
  try {
    const result = await isIdentityExists(`v:${identity}`);
    console.log('isVerifyTokenIdentityExists-result', result);
    return result;
  } catch (error) {
    console.log('isVerifyTokenIdentityExists-error', error);
  }
};
setVerifyTokenIdentity = async (identity, expiry, payload) => {
  try {
    const result = await setIdentityWithHSet(`v:${identity}`, expiry, payload);
    console.log('setVerifyTokenIdentity-result', result);
    return result;
  } catch (error) {
    console.log('setVerifyTokenIdentity-error', error);
  }
};
getVerifyTokenIdentity = async (identity) => {
  try {
    let result = await getHSetIdentityPayload(`v:${identity}`);
    console.log('getTokenPayload-result', result);
    return result;
  } catch (error) {
    console.log('getVerifyTokenIdentity-error', error);
  }
};
deleteVerifyTokenIdentity = async (identity) => {
  try {
    const result = await deleteIdentity(`v:${identity}`);
    console.log('deleteVerifyTokenIdentity-result', result);
    return result;
  } catch (error) {
    console.log('deleteVerifyTokenIdentity-error', error);
  }
};

/**
 * * changePassword token related methods
 */
isChangePasswordTokenIdentityExists = async (identity) => {
  try {
    const result = await isIdentityExists(`cp:${identity}`);
    console.log('isChangePasswordTokenIdentityExists-result', result);
    return result;
  } catch (error) {
    console.log('isChangePasswordTokenIdentityExists-error', error);
  }
};
setChangePasswordTokenIdentity = async (identity, expiry, payload) => {
  try {
    const result = await setIdentityWithHSet(`cp:${identity}`, expiry, payload);
    console.log('saveChangePasswordTokenIdentity-result', result);
    return result;
  } catch (error) {
    console.log('saveChangePasswordTokenIdentity-error', error);
  }
};
getChangePasswordTokenIdentity = async (identity) => {
  try {
    let result = await getHSetIdentityPayload(`cp:${identity}`);
    console.log('getChangePasswordTokenIdentity-result', result);
    return result;
  } catch (error) {
    console.log('getChangePasswordTokenIdentity-error', error);
  }
};
deleteChangePasswordTokenIdentity = async (identity) => {
  try {
    const result = await deleteIdentity(`cp:${identity}`);
    console.log('deleteChangePasswordTokenIdentity-result', result);
    return result;
  } catch (error) {
    console.log('deleteChangePasswordTokenIdentity-error', error);
  }
};

module.exports = {
  isIdentityExists,
  setIdentityWithHSet,
  setIdentity,
  getHSetIdentityPayload,
  deleteIdentity,
  isIdentityBlacklisted,
  setIdentityToBlacklist,
  deleteBlacklistedIdentity,
  isVerifyTokenIdentityExists,
  setVerifyTokenIdentity,
  getVerifyTokenIdentity,
  deleteVerifyTokenIdentity,
  isChangePasswordTokenIdentityExists,
  setChangePasswordTokenIdentity,
  getChangePasswordTokenIdentity,
  deleteChangePasswordTokenIdentity,
};
