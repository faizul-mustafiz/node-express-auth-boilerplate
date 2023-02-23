require('dotenv').config();
const { config, options } = require('../configs/mongo.config');
const mongoose = require('mongoose');
const logger = require('../loggers/logger');

mongoose.set('strictQuery', true);

mongoConnectCallback = () => {
  logger.debug('mongo-connect-callback: %s', 'mongoDB is connected');
};
mongoErrorCallback = (error) => {
  logger.error('mongo-error:-callback-error', error);
  disconnectFromMongoAgent('error-callback');
};
mongoDisconnectCallback = () => {
  logger.debug('mongo-disconnect-callback: %s', 'mongoDB is disconnected');
};

disconnectFromMongoAgent = (stack = 'disconnect-call') => {
  mongoose.connection.close();
  logger.debug('Disconnected form mongo agent-stack: %s', stack);
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
