const { scryptSync, timingSafeEqual } = require('crypto');

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
  compareStoredKeyWithApiKey,
  compareStoredSecretWithApiKey,
};
