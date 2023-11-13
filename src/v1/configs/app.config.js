const {
  API_PORT,
  API_HOST,
  API_PROTOCOL,
  API_VERSION,
  ROUTE_PREFIX,
} = require('../environments');

module.exports = {
  version: API_VERSION,
  baseRoute: `${ROUTE_PREFIX}/${API_VERSION}`,
  port: API_PORT,
  host: API_HOST,
  protocol: API_PROTOCOL,
};
