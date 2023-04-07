getAuthorizationHeader = (req) => {
  return req.headers['authorization'] || req.headers['Authorization'];
};
getXApiKeyHeader = (req) => {
  return req.headers['x-api-key'] || req.headers['X-API-KEY'];
};
getXAppIdHeader = (req) => {
  return req.headers['x-app-id'] || req.headers['X-APP-ID'];
};
getXAppVersionHeader = (req) => {
  return req.headers['x-app-version'] || req.headers['X-APP-VERSION'];
};
splitAuthorizationHeader = (authorization) => {
  const bearer =
    authorization && authorization.startsWith('Bearer ') ? authorization : null;
  const token = bearer ? bearer.split('Bearer ')[1] : null;
  return {
    bearer,
    token,
  };
};
module.exports = {
  getAuthorizationHeader,
  getXApiKeyHeader,
  getXAppIdHeader,
  getXAppVersionHeader,
  splitAuthorizationHeader,
};
