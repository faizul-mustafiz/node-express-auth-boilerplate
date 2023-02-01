require('dotenv').config();
const environment = require('../environments/index');

const config = {
  url: environment.MONGO_URL,
  username: environment.MONGO_USERNAME,
  password: environment.MONGO_PASSWORD,
};

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  useNewUrlParser: true,
};

module.exports = { config, options };
