require('dotenv').config();
const {
  MONGO_URL,
  MONGO_USERNAME,
  MONGO_PASSWORD,
} = require('../environments');

const config = {
  url: MONGO_URL,
  username: MONGO_USERNAME,
  password: MONGO_PASSWORD,
};

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  useNewUrlParser: true,
};

module.exports = { config, options };
