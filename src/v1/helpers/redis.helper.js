const redisClient = require('../plugins/redis.plugin');
const { base64ToJson } = require('../helpers/conversion.helper');

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
    let result = await redisClient.hSet(identity, [
      'user_id',
      payload.user_id,
      'user_email',
      payload.user_email,
      'type',
      payload.type,
    ]);
    result = await redisClient.expireAt(identity, expiry);
    console.log('setTokenIdentity-result', result);
    return result;
  } catch (error) {
    console.log('setTokenIdentity-error', error);
  }
};
setIdentity = async (identity, expiry) => {
  try {
    const result = await redisClient.setEx(identity, expiry, '');
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
    let result = await this.isIdentityExists(`bl:${identity}`);
    console.log('isIdentityBlacklisted-result', result);
    return result;
  } catch (error) {
    console.log('isIdentityBlacklisted-error', error);
  }
};
setIdentityToBlacklist = async (identity, expiry) => {
  try {
    const result = await this.setIdentity(`bl:${identity}`, expiry);
    console.log('setIdentityToBlacklist-result', result);
    return result;
  } catch (error) {
    console.log('setIdentityToBlacklist-error', error);
  }
};
deleteBlacklistedIdentity = async (identity) => {
  try {
    let result = await this.deleteIdentity(`bl:${identity}`);
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
    const result = this.isIdentityExists(`v:${identity}`);
    console.log('isVerifyTokenIdentityExists-result', result);
    return result;
  } catch (error) {
    console.log('isVerifyTokenIdentityExists-error', error);
  }
};
satVerifyTokenIdentity = async (identity, expiry) => {
  try {
    const result = await this.setIdentity(`v:${identity}`, expiry);
    console.log('satVerifyTokenIdentity-result', result);
    return result;
  } catch (error) {
    console.log('satVerifyTokenIdentity-error', error);
  }
};
deleteVerifyTokenIdentity = async (identity) => {
  try {
    const result = await this.deleteIdentity(`v:${identity}`);
    console.log('deleteVerifyTokenIdentity-result', result);
    return result;
  } catch (error) {
    console.log('deleteVerifyTokenIdentity-error', error);
  }
};
/**
 * * resetPassword token related methods
 */
isRestPasswordTokenIdentityExists = async (identity) => {
  try {
    const result = this.isIdentityExists(`rp:${identity}`);
    console.log('isRestPasswordTokenIdentityExists-result', result);
    return result;
  } catch (error) {
    console.log('isRestPasswordTokenIdentityExists-error', error);
  }
};
setRestPasswordTokenIdentity = async (identity, expiry) => {
  try {
    const result = await this.setIdentity(`rp:${identity}`, expiry);
    console.log('setRestPasswordTokenIdentity-result', result);
    return result;
  } catch (error) {
    console.log('setRestPasswordTokenIdentity-error', error);
  }
};
deleteResetPasswordIdentity = async (identity) => {
  try {
    const result = await this.deleteIdentity(`rp:${identity}`);
    console.log('deleteResetPasswordIdentity-result', result);
    return result;
  } catch (error) {
    console.log('deleteResetPasswordIdentity-error', error);
  }
};

/**
 * * changePassword token related methods
 */
isChangePasswordTokenIdentityExists = async (identity) => {
  try {
    const result = this.isIdentityExists(`cp:${identity}`);
    console.log('isChangePasswordTokenIdentityExists-result', result);
    return result;
  } catch (error) {
    console.log('isChangePasswordTokenIdentityExists-error', error);
  }
};
saveChangePasswordTokenIdentity = async (identity, expiry) => {
  try {
    const result = await this.setIdentity(`cp:${identity}`, expiry);
    console.log('saveChangePasswordTokenIdentity-result', result);
    return result;
  } catch (error) {
    console.log('saveChangePasswordTokenIdentity-error', error);
  }
};
deleteChangePasswordTokenIdentity = async (identity) => {
  try {
    const result = await this.deleteIdentity(`cp:${identity}`);
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
  satVerifyTokenIdentity,
  deleteVerifyTokenIdentity,
  isRestPasswordTokenIdentityExists,
  setRestPasswordTokenIdentity,
  deleteResetPasswordIdentity,
  isChangePasswordTokenIdentityExists,
  saveChangePasswordTokenIdentity,
  deleteChangePasswordTokenIdentity,
};
