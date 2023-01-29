require('dotenv').config();
const config = {
  url: process.env.MONGO_URL,
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
};

module.exports = config;
