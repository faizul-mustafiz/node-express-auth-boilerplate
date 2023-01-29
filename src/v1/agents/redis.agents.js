const { createClient } = require('redis');
const redisConfig = require('../configs/redis.config');

const redisClient = createClient({
  port: redisConfig.port,
  url: redisConfig.url,
});

connectCallback = () => {
  console.log(
    'redis-connect-callback-response',
    'Connection to redis successful',
  );
};

errorCallback = (error) => {
  console.log('redis-error-callback-error', error);
  if (error.code == 'ECONNREFUSED') {
    redisClient.disconnect();
    return;
  }
};

redisClient.connect();
redisClient.on('connect', connectCallback);
redisClient.on('error', errorCallback);

module.exports = redisClient;
