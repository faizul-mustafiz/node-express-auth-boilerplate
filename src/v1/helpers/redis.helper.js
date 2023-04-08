const { redisClient } = require('../plugins/redis.plugin');
const { jsonToArray } = require('../helpers/conversion.helper');
const logger = require('../loggers/logger');

/**
 * * generic reusable methods for tokens
 */
isIdentityExists = async (identity) => {
  try {
    let result = await redisClient.exists(identity);
    logger.debug('isIdentityExists-result: %s', result);
    return result;
  } catch (error) {
    logger.error('isIdentityExists-error:', error);
  }
};
setIdentityWithHSet = async (identity, expiry, payload) => {
  try {
    const payloadArray = jsonToArray(payload);
    let result = await redisClient.hSet(identity, payloadArray);
    result = await redisClient.expireAt(identity, expiry);
    logger.debug('setIdentityWithHSet-result: %s', result);
    return result;
  } catch (error) {
    logger.error('setIdentityWithHSet-error:', error);
  }
};
setIdentityWithHSetNoExpiry = async (identity, payload) => {
  try {
    const payloadArray = jsonToArray(payload);
    const result = await redisClient.hSet(identity, payloadArray);
    logger.debug('setIdentityWithHSetNoExpiry-result: %s', result);
    return result;
  } catch (error) {
    logger.error('setIdentityWithHSetNoExpiry-error:', error);
  }
};
setIdentity = async (identity, expiry, payload) => {
  try {
    let result = await redisClient.set(identity, payload);
    result = await redisClient.expireAt(identity, expiry);
    logger.debug('saveTokenIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('saveTokenIdentity-error:', error);
  }
};
getHSetIdentityPayload = async (identity) => {
  try {
    let result = await redisClient.hGetAll(identity);
    logger.debug('getTokenPayload-result: %s', result);
    return result;
  } catch (error) {
    logger.error('getTokenPayload-error:', error);
  }
};
deleteIdentity = async (identity) => {
  try {
    let result = await redisClient.del(identity);
    logger.debug('deleteTokenPayload-result: %s', result);
    return result;
  } catch (error) {
    logger.error('deleteTokenPayload-error:', error);
  }
};

/**
 * * access and refresh token identity blacklist related methods
 */
isIdentityBlacklisted = async (identity) => {
  try {
    let result = await redisClient.exists(`bl:${identity}`);
    logger.debug('isIdentityBlacklisted-result: %s', result);
    return result;
  } catch (error) {
    logger.error('isIdentityBlacklisted-error:', error);
  }
};
setIdentityToBlacklist = async (identity, expiry) => {
  try {
    const result = await setIdentity(`bl:${identity}`, expiry, '');
    logger.debug('setIdentityToBlacklist-result: %s', result);
    return result;
  } catch (error) {
    logger.error('setIdentityToBlacklist-error:', error);
  }
};
deleteBlacklistedIdentity = async (identity) => {
  try {
    let result = await deleteIdentity(`bl:${identity}`);
    logger.debug('deleteBlacklistedIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('deleteBlacklistedIdentity-error:', error);
  }
};

/**
 * * verify token related methods
 */
isVerifyTokenIdentityExists = async (identity) => {
  try {
    const result = await isIdentityExists(`v:${identity}`);
    logger.debug('isVerifyTokenIdentityExists-result: %s', result);
    return result;
  } catch (error) {
    logger.error('isVerifyTokenIdentityExists-error:', error);
  }
};
setVerifyTokenIdentity = async (identity, expiry, payload) => {
  try {
    const result = await setIdentityWithHSet(`v:${identity}`, expiry, payload);
    logger.debug('setVerifyTokenIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('setVerifyTokenIdentity-error:', error);
  }
};
getVerifyTokenIdentity = async (identity) => {
  try {
    let result = await getHSetIdentityPayload(`v:${identity}`);
    logger.debug('getTokenPayload-result: %s', result);
    return result;
  } catch (error) {
    logger.error('getVerifyTokenIdentity-error:', error);
  }
};
deleteVerifyTokenIdentity = async (identity) => {
  try {
    const result = await deleteIdentity(`v:${identity}`);
    logger.debug('deleteVerifyTokenIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('deleteVerifyTokenIdentity-error:', error);
  }
};

/**
 * * changePassword token related methods
 */
isChangePasswordTokenIdentityExists = async (identity) => {
  try {
    const result = await isIdentityExists(`cp:${identity}`);
    logger.debug('isChangePasswordTokenIdentityExists-result: %s', result);
    return result;
  } catch (error) {
    logger.error('isChangePasswordTokenIdentityExists-error:', error);
  }
};
setChangePasswordTokenIdentity = async (identity, expiry, payload) => {
  try {
    const result = await setIdentityWithHSet(`cp:${identity}`, expiry, payload);
    logger.debug('saveChangePasswordTokenIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('saveChangePasswordTokenIdentity-error:', error);
  }
};
getChangePasswordTokenIdentity = async (identity) => {
  try {
    let result = await getHSetIdentityPayload(`cp:${identity}`);
    logger.debug('getChangePasswordTokenIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('getChangePasswordTokenIdentity-error:', error);
  }
};
deleteChangePasswordTokenIdentity = async (identity) => {
  try {
    const result = await deleteIdentity(`cp:${identity}`);
    logger.debug('deleteChangePasswordTokenIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('deleteChangePasswordTokenIdentity-error:', error);
  }
};

/**
 * * application related methods
 */
isAppIdIdentityExists = async (identity) => {
  try {
    const result = await isIdentityExists(`app:${identity}`);
    logger.debug('isAppIdIdentityExists-result: %s', result);
    return result;
  } catch (error) {
    logger.error('isAppIdIdentityExists-error:', error);
  }
};
setAppIdIdentity = async (identity, payload) => {
  try {
    const result = await setIdentityWithHSetNoExpiry(
      `app:${identity}`,
      payload,
    );
    logger.debug('setAppIdIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('setAppIdIdentity-error:', error);
  }
};
getAppIdIdentity = async (identity) => {
  try {
    let result = await getHSetIdentityPayload(`app:${identity}`);
    logger.debug('getAppIdIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('getAppIdIdentity-error:', error);
  }
};
deleteAppIdIdentity = async (identity) => {
  try {
    const result = await deleteIdentity(`app:${identity}`);
    logger.debug('deleteAppIdIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('deleteAppIdIdentity-error:', error);
  }
};

/**
 * * clean up redis test db after test complete
 */
deleteTestDataFromRedis = async () => {
  try {
    const result = await redisClient.flushDb('ASYNC');
    logger.debug('deleteTestDataFromRedis-result: %s', result);
  } catch (error) {
    logger.error('deleteTestDataFromRedis-error', error);
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
  isAppIdIdentityExists,
  setAppIdIdentity,
  getAppIdIdentity,
  deleteAppIdIdentity,
  deleteTestDataFromRedis,
};
