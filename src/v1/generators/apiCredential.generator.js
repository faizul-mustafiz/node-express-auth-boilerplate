const uuid = require('uuid');
const { scryptSync, randomBytes } = require('crypto');

const generateAppId = () => {
  return uuid.v4();
};
const generateApiKey = () => {
  const buffer = randomBytes(32);
  return buffer.toString('base64');
};
const generateApiSecret = (key) => {
  const salt = randomBytes(32).toString('hex');
  const buffer = scryptSync(key, salt, 64);
  return `${salt}${buffer.toString('hex')}`;
};
module.exports = { generateAppId, generateApiKey, generateApiSecret };
