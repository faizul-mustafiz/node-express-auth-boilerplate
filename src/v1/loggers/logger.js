const winston = require('winston');
const path = require('path');
const appLogFilePath = path.join(__dirname, '../logs', 'app.log');
const errorLogFilePath = path.join(__dirname, '../logs', 'error.log');
const transporterOptions = {
  app: {
    level: 'info',
    filename: appLogFilePath,
    handleExceptions: true,
    json: true,
    maxsize: 204800, // 100MB
    maxFiles: 5,
    colorize: false,
  },
  error: {
    level: 'info',
    filename: errorLogFilePath,
    handleExceptions: true,
    json: true,
    maxsize: 204800, // 100MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  level: winston.config.npm.levels,
  transports: [
    new winston.transports.File(transporterOptions.app),
    new winston.transports.File(transporterOptions.error),
    new winston.transports.Console(transporterOptions.console),
  ],
  exitOnError: false,
});

module.exports = logger;
