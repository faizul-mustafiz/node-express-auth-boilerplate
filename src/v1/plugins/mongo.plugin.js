require('dotenv').config();
const { config, options } = require('../configs/mongo.config');
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

mongoConnectCallback = () => {
  console.log('mongo-connect-callback:', 'mongoDB is connected');
};
mongoErrorCallback = (error) => {
  console.log('mongo-error-callback-error', error);
  disconnectFromMongoAgent('error-callback');
};
mongoDisconnectCallback = () => {
  console.log('mongo-disconnect-callback:', 'mongoDB is disconnected');
};

disconnectFromMongoAgent = (stack = 'disconnect-call') => {
  mongoose.connection.close();
  console.log('Disconnected form mongo agent;', 'stack:', stack);
  process.exit();
};

mongoose.connect(config.url, options);
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => mongoConnectCallback());
mongoose.connection.on('error', (error) => mongoErrorCallback(error));
mongoose.connection.on('disconnected', () => mongoDisconnectCallback());

module.exports = {
  mongoose,
  disconnectFromMongoAgent,
};
