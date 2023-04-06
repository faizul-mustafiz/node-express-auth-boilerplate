const express = require('express');
const applicationRouter = express.Router();
const { ApplicationController } = require('../controllers/index');
const {
  validateApplicationCreateRequestBody,
  validateApplicationUpdateRequestBody,
} = require('../middlewares/validateApplicationRequestBody.middleware');

applicationRouter.get('/', ApplicationController.getAllApplications);
applicationRouter.get('/:appId', ApplicationController.getOneApplication);
applicationRouter.post(
  '/',
  [validateApplicationCreateRequestBody],
  ApplicationController.createOneApplication,
);
applicationRouter.post(
  '/:appId',
  [validateApplicationUpdateRequestBody],
  ApplicationController.updateOneApplication,
);
applicationRouter.delete('/:appId', ApplicationController.deleteOneApplication);
module.exports = applicationRouter;
