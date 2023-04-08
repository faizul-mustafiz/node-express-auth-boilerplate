const express = require('express');
const userRouter = express.Router();
const { UserController } = require('../controllers/index');
const hasAuthorization = require('../middlewares/hasAuthorization.middleware');
const validateAccess = require('../middlewares/validateAccess.middleware');

const hasAppInfoHeader = require('../middlewares/hasAppInfoHeader.middleware');
const validateAppInfoHeader = require('../middlewares/validateAppInfoHeader.middleware');

userRouter.get(
  '/',
  [hasAuthorization, hasAppInfoHeader, validateAppInfoHeader, validateAccess],
  UserController.getAllUser,
);
userRouter.get(
  '/:userId',
  [hasAuthorization, hasAppInfoHeader, validateAppInfoHeader, validateAccess],
  UserController.getOneUser,
);
userRouter.post(
  '/:userId',
  [hasAuthorization, hasAppInfoHeader, validateAppInfoHeader, validateAccess],
  UserController.updateOneUser,
);
userRouter.delete(
  '/:userId',
  [hasAuthorization, hasAppInfoHeader, validateAppInfoHeader, validateAccess],
  UserController.deleteOneUser,
);
module.exports = userRouter;
