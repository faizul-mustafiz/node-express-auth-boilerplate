const generateApplicationIdentity = (payload) => {
  return payload && payload.appId;
};
const generateApplicationPayloadForRedis = (payload) => {
  return {
    appName: payload && payload.appName,
    apiKey: payload && payload.apiKey,
    apiSecret: payload && payload.apiSecret,
    appMinVersion: payload && payload.appMinVersion,
    status: payload && payload.status,
  };
};
module.exports = {
  generateApplicationIdentity,
  generateApplicationPayloadForRedis,
};
