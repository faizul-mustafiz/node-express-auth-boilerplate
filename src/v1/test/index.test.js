/**
 * * During the test we are going to use test environment config
 * * as mongo will use auth_test db and redis will use db index 15
 * @example redis://redis:6379/15
 * * these dbs are assigned for our test environment
 */
process.env.NODE_ENV = 'test';
const authTest = require('./auth.test');
const userTest = require('./user.test');
module.exports = {
  authTest,
  userTest,
};
