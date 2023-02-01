require('dotenv').config();
const environment = require('../environments/index');
module.exports = {
  url: environment.REDIS_URL,
  host: environment.REDIS_HOST,
  port: environment.REDIS_PORT,
  username: environment.REDIS_USERNAME,
  password: environment.REDIS_PASSWORD,
};
