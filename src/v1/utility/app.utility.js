const {
  API_PROTOCOL,
  API_HOST,
  API_PORT,
  BASE_API_ROUTE,
} = require('../environments/environment.development');

const apiRouteGeneratorLocal = (route) => {
  return `${API_PROTOCOL}://${API_HOST}:${API_PORT}${BASE_API_ROUTE}${route}`;
};
module.exports = apiRouteGeneratorLocal;
