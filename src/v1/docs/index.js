const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const users = require('./users');

module.exports = {
  ...basicInfo,
  ...servers,
  ...components,
  ...tags,
  ...users,
};
