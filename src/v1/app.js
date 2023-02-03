require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { AuthRoutes, UserRoutes } = require('./routes');
const app = express();
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(cors());
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ message: 'Basic Health Check.' });
});
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/users', UserRoutes);

//redis connection
const redisPlugin = require('./plugins/redis.plugin');
//mongo-db connection
const mongoPlugin = require('./plugins/mongo.plugin');

module.exports = app;
