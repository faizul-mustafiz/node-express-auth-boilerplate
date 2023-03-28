require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const swaggerUI = require('swagger-ui-express');
const docs = require('./docs');

const { AuthRoutes, UserRoutes } = require('./routes');
const { baseRoute } = require('./configs/app.config');

const httpLogger = require('./loggers/httpLogger');
const ErrorLogger = require('./middlewares/errorLogger.middleware');
const ErrorHandler = require('./middlewares/errorHandler.middleware');
const invalidPath = require('./middlewares/invalidPath.middleware');
/**
 * * initiate express and express community middleware
 */
const app = express();
app.use(httpLogger);
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
app.use(cors());
/**
 * * Connect to redis client
 */
const redisPlugin = require('./plugins/redis.plugin');
/**
 * * Connect to mongoDB client
 */
const mongoPlugin = require('./plugins/mongo.plugin');
/**
 * * A basic health check route above all the routes for checking if the application is running
 */
app.get(`${baseRoute}/health`, (req, res) => {
  res.status(200).json({
    message: 'Basic Health Check.',
    environment: process.env.NODE_ENV,
  });
});
/**
 * * Route injection to the app module
 */
app.use(`${baseRoute}/auth`, AuthRoutes);
app.use(`${baseRoute}/users`, UserRoutes);
/**
 * * Route injection for swagger documentation
 */
app.use('/v1/docs', swaggerUI.serve, swaggerUI.setup(docs));
/**
 * * Error logger middleware
 * * Error handler middleware
 * * Invalid Path middleware
 */
app.use(ErrorLogger);
app.use(ErrorHandler);
app.use(invalidPath);

module.exports = app;
