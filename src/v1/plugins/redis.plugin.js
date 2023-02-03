const { createClient } = require('redis');
const redisConfig = require('../configs/redis.config');

const redisClient = createClient({
  port: redisConfig.port,
  url: redisConfig.url,
});

redisConnectCallback = () => {
  console.log(
    'redis-connect-callback-response',
    'Connection to redis successful',
  );
};

redisErrorCallback = (error) => {
  console.log('redis-error-callback-error', error);
  redisClient.disconnect();
  process.exit();
};

redisClient.connect();
redisClient.on('connect', redisConnectCallback);
redisClient.on('error', redisErrorCallback);

module.exports = redisClient;
