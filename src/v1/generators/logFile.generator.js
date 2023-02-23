const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, '../logs');
const appLogFilePath = path.join(__dirname, '../logs', 'app.log');
const errorLogFilePath = path.join(__dirname, '../logs', 'error.log');
const checkIfDirectoryExists = (dirName) => {
  return fs.existsSync(dirName);
};
const checkIfFileExists = (fileName) => {
  return fs.existsSync(fileName);
};
const createLogsDirectory = () => {
  if (!checkIfDirectoryExists(dirPath)) {
    fs.mkdirSync(dirPath);
    console.log('Logs directory created');
  }
};
const createAppLogFile = () => {
  try {
    if (!checkIfFileExists(appLogFilePath)) {
      const result = fs.writeFileSync(appLogFilePath, '');
      console.log('App log file created');
    }
  } catch (error) {
    console.log('createAppLogFile-error:', error);
  }
};
const createErrorLogFile = () => {
  try {
    if (!checkIfFileExists(errorLogFilePath)) {
      const result = fs.writeFileSync(errorLogFilePath, '');
      console.log('Error log file created');
    }
  } catch (error) {
    console.log('createErrorLogFile-error:', error);
  }
};
console.log('check-if-logs-dir-exists', checkIfDirectoryExists(dirPath));
createLogsDirectory();
console.log('check-if-app-log-file-exists', checkIfFileExists(appLogFilePath));
console.log(
  'check-if-error-log-file-exists',
  checkIfFileExists(errorLogFilePath),
);
createAppLogFile();
createErrorLogFile();
