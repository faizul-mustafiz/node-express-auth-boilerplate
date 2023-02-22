const app = require('./src/v1/app');
const { port, host } = require('./src/v1/configs/app.config');
const logger = require('./src/v1/loggers/logger');

const server = app.listen(port, host, () => {
  logger.debug('Express is running on →');
  console.table({
    host: host,
    port: port,
  });
});

process.on('uncaughtException', function (err) {
  logger.error('uncaughtException-error', err);
});
[
  `exit`,
  `SIGINT`,
  `SIGUSR1`,
  `SIGUSR2`,
  `uncaughtException`,
  `SIGTERM`,
].forEach((event) => {
  process.on(event, () => {
    logger.info('Process event type: %s', event);
    server.close();
    process.exit();
  });
});
