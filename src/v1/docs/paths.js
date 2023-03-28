const auth = require('./auth');
const users = require('./users');

module.exports = {
  paths: {
    ...auth,
    ...users,
  },
};
