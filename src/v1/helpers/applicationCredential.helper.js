const logger = require('../loggers/logger');
const { scryptSync, timingSafeEqual } = require('crypto');
const {
  isAppIdIdentityExists,
  getAppIdIdentity,
  setAppIdIdentity,
  deleteAppIdIdentity,
} = require('./redis.helper');
const {
  generateAppId,
  generateApiKey,
  generateApiSecret,
} = require('../generators/apiCredential.generator');
const {
  generateApplicationIdentity,
  generateApplicationPayloadForRedis,
} = require('../utility/application.utility');
const { version } = require('../configs/app.config');
const ApplicationStatus = require('../enums/applicationStatus.enum');

const generateApplicationCredentialData = () => {
  const appId = generateAppId();
  const apiKey = generateApiKey();
  const apiSecret = generateApiSecret(apiKey);
  return {
    appId,
    apiKey,
    apiSecret,
    appMinVersion: version,
    status: ApplicationStatus.Active,
  };
};

const setApplicationCredentialToRedis = async (payload) => {
  const identity = generateApplicationIdentity(payload);
  const redisPayload = generateApplicationPayloadForRedis(payload);
  await setAppIdIdentity(identity, redisPayload);
};

const deleteApplicationCredentialFromRedis = async (identity) => {
  await deleteAppIdIdentity(identity);
};

const compareStoredKeyWithApiKey = (storedApiKey, apiKey) => {
  return storedApiKey === apiKey;
};
const compareStoredSecretWithApiKey = (storedApiSecret, apiKey) => {
  const salt = storedApiSecret.substr(0, 64);
  const key = storedApiSecret.substr(64);
  const buffer = scryptSync(apiKey, salt, 64);
  return timingSafeEqual(Buffer.from(key, 'hex'), buffer);
};

module.exports = {
  generateApplicationCredentialData,
  setApplicationCredentialToRedis,
  deleteApplicationCredentialFromRedis,
  compareStoredKeyWithApiKey,
  compareStoredSecretWithApiKey,
};
