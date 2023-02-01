require('dotenv').config();
module.exports = {
  // redis environments variables
  REDIS_URL: process.env.REDIS_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  // mongo environment variables
  MONGO_URL: process.env.MONGO_URL,
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  // hashing algorithm fro encryption
  HASHING_ALGORITHM: process.env.HASHING_ALGORITHM,
};
