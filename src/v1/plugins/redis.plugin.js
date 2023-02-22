const { createClient } = require('redis');
const redisConfig = require('../configs/redis.config');
const logger = require('../loggers/logger');

const redisClient = createClient({
  port: redisConfig.port,
  url: redisConfig.url,
});

redisConnectCallback = () => {
  logger.info(
    'redis-connect-callback-response: Connection to redis successful',
  );
};

redisErrorCallback = (error) => {
  logger.error('redis-error-callback-error', error);
  redisClient.disconnect();
  process.exit();
};

redisClient.connect();
redisClient.on('connect', redisConnectCallback);
redisClient.on('error', redisErrorCallback);

module.exports = redisClient;
