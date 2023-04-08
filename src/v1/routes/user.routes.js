const express = require('express');
const userRouter = express.Router();
const { UserController } = require('../controllers/index');
const hasAuthorization = require('../middlewares/hasAuthorization.middleware');
const validateAccess = require('../middlewares/validateAccess.middleware');

const hasAppInfoHeader = require('../middlewares/hasAppInfoHeader.middleware');
const validateAppInfoHeader = require('../middlewares/validateAppInfoHeader.middleware');

userRouter.get(
  '/',
  [hasAppInfoHeader, validateAppInfoHeader, hasAuthorization, validateAccess],
  UserController.getAllUser,
);
userRouter.get(
  '/:userId',
  [hasAppInfoHeader, validateAppInfoHeader, hasAuthorization, validateAccess],
  UserController.getOneUser,
);
userRouter.post(
  '/:userId',
  [hasAppInfoHeader, validateAppInfoHeader, hasAuthorization, validateAccess],
  UserController.updateOneUser,
);
userRouter.delete(
  '/:userId',
  [hasAppInfoHeader, validateAppInfoHeader, hasAuthorization, validateAccess],
  UserController.deleteOneUser,
);
module.exports = userRouter;
