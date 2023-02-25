require('dotenv').config();
const { config, options } = require('../configs/mongo.config');
const mongoose = require('mongoose');
const logger = require('../loggers/logger');
mongoose.set('strictQuery', true);

/**
 * * mongoClient onConnected callback function
 */
mongoConnectCallback = () => {
  logger.debug('mongo-connect-callback: %s', 'mongoDB is connected');
};
/**
 * * mongoClient onError callback function
 * * onError event close the connection and exit the process in exitCode = 0
 */
mongoErrorCallback = (error) => {
  logger.error('mongo-error:-callback-error', error);
  mongoose.connection.close();
  logger.debug('Disconnected form mongo agent-stack: %s', error);
  process.exit(0);
};
/**
 * * mongoClient onDisconnected callback function
 */
mongoDisconnectCallback = () => {
  logger.debug('mongo-disconnect-callback: %s', 'mongoDB is disconnected');
};
/**
 * * this method is for closing mongoClient connection for graceful server shutdown
 */
closeMongoPluginConnection = () => {
  mongoose.connection.close(false);
  logger.debug('Closing mongo plugin connection...');
};
/**
 * * connect to mongoClient
 */
mongoose.connect(config.url, options);
mongoose.Promise = global.Promise;
/**
 * * mongoClient onConnected and onError event handler
 */
mongoose.connection.on('connected', () => mongoConnectCallback());
mongoose.connection.on('error', (error) => mongoErrorCallback(error));
mongoose.connection.on('disconnected', () => mongoDisconnectCallback());

module.exports = {
  mongoose,
  closeMongoPluginConnection,
};
