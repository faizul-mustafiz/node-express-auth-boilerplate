const app = require('./src/v1/app');
const server = app.listen(3030, () => {
  console.log('Express is running on →', 'port', 3030);
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
