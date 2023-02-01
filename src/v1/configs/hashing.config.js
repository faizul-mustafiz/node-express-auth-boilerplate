require('dotenv').config();
const environment = require('../environments/index');
module.exports = {
  hashingAlgorithm: environment.HASHING_ALGORITHM,
};
