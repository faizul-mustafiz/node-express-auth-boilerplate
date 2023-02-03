const app = require('./src/v1/app');
const { port, host } = require('./src/v1/configs/app.config');

const server = app.listen(port, host, () => {
  console.log('Express is running on →');
  console.table({
    host: host,
    port: port,
  });
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
    console.log('Process event type: ', event);
    server.close();
    process.exit();
  });
});
