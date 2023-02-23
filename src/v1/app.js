require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { AuthRoutes, UserRoutes } = require('./routes');
const { baseRoute } = require('./configs/app.config');
const httpLogger = require('../v1/loggers/httpLogger');

const app = express();

app.use(httpLogger);

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(cors());
app.get(`${baseRoute}/health`, (req, res) => {
  res.status(200).json({ message: 'Basic Health Check.' });
});
app.use(`${baseRoute}/auth`, AuthRoutes);
app.use(`${baseRoute}/users`, UserRoutes);

//redis connection
const redisPlugin = require('./plugins/redis.plugin');
//mongo-db connection
const mongoPlugin = require('./plugins/mongo.plugin');

module.exports = app;
