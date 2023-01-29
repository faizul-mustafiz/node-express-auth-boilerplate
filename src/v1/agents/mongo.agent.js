require('dotenv').config();
const mongoConfig = require('../configs/mongo.config');
const mongoose = require('mongoose');

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

connectCallback = (response) => {
  console.log(
    'mongo-connect-callback-response:',
    response.options,
    '\nmongoDB is running successfully',
  );
};
errorCallback = (error) => {
  console.log('mongo-error-callback-error', error);
  disconnectFromMongoAgent('error-callback');
};

disconnectFromMongoAgent = (stack = 'disconnect-call') => {
  mongoose.connection.close();
  console.log('Disconnected form mongo agent;', 'stack:', stack);
};

connectToMongoAgent = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoConfig.url, options).then(
    (response) => connectCallback(response),
    (error) => errorCallback(error),
  );
  mongoose.Promise = global.Promise;
};
connectToMongoAgent();

module.exports = {
  disconnectFromMongoAgent,
  mongoose,
};
