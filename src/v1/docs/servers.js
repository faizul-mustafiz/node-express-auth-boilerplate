const appConfig = require('../configs/app.config');

module.exports = {
  servers: [
    {
      url: `${appConfig.protocol}://${appConfig.host}:${appConfig.port}/api/v1`,
      // url: 'http://localhost:3030/api/v1',
      description: 'Docs of Development server',
    },
  ],
};
