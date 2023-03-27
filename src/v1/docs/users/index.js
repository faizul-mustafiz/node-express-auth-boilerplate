const getAllUsers = require('./get-all-users');
const getUser = require('./get-user');
const updateUser = require('./update-user');
const deleteUser = require('./delete-user');
module.exports = {
  paths: {
    '/users': {
      ...getAllUsers,
    },
    '/users/{id}': {
      ...getUser,
      ...updateUser,
      ...deleteUser,
    },
  },
};
