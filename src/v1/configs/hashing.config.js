require('dotenv').config();
const { HASHING_ALGORITHM } = require('../environments');

module.exports = {
  hashingAlgorithm: HASHING_ALGORITHM,
};
