const auth = require('./auth');
const users = require('./users');
const applications = require('./applications');

module.exports = {
  paths: {
    ...auth,
    ...users,
    ...applications,
  },
};
