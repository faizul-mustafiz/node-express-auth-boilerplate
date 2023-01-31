require('dotenv').config();
const { config, options } = require('../configs/mongo.config');
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

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
  process.exit();
};

connectToMongoAgent = async () => {
  try {
    await mongoose
      .connect(config.url, options)
      .then((response) => connectCallback(response));
    mongoose.Promise = global.Promise;
  } catch (error) {
    errorCallback(error);
  }
};
connectToMongoAgent();

module.exports = {
  disconnectFromMongoAgent,
  mongoose,
};
