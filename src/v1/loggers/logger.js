const winston = require('winston');
const { combine, timestamp, printf, splat } = winston.format;
const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp}|${level}|message:${message}|stack-trace:${stack}`;
});
const path = require('path');
const appLogFilePath = path.join(__dirname, '../logs', 'app.log');
const errorLogFilePath = path.join(__dirname, '../logs', 'error.log');
const transporterOptions = {
  app: {
    level: 'info',
    filename: appLogFilePath,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  error: {
    level: 'info',
    filename: errorLogFilePath,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
  },
};

const logger = winston.createLogger({
  level: winston.config.npm.levels,
  format: combine(timestamp(), splat(), customFormat),
  transports: [
    new winston.transports.File(transporterOptions.app),
    new winston.transports.File(transporterOptions.error),
    new winston.transports.Console(transporterOptions.console),
  ],
  exitOnError: false,
});

module.exports = logger;
