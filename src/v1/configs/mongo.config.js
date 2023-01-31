require('dotenv').config();

const config = {
  url: process.env.MONGO_URL,
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
};

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  useNewUrlParser: true,
};

module.exports = { config, options };
