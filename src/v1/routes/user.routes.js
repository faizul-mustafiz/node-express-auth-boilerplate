const express = require('express');
const userRouter = express.Router();
const { UserController } = require('../controllers/index');
const hasAuthorization = require('../middlewares/hasAuthorization.middleware');
const hasCustomHeader = require('../middlewares/hasCustomHeader.middleware');
const validateAccess = require('../middlewares/validateAccess.middleware');
const validateCustomHeader = require('../middlewares/validateCustomHeader.middleware');

userRouter.get(
  '/',
  [hasAuthorization, hasCustomHeader, validateCustomHeader, validateAccess],
  UserController.getAllUser,
);
userRouter.get(
  '/:userId',
  [hasAuthorization, hasCustomHeader, validateCustomHeader, validateAccess],
  UserController.getOneUser,
);
userRouter.post(
  '/:userId',
  [hasAuthorization, hasCustomHeader, validateCustomHeader, validateAccess],
  UserController.updateOneUser,
);
userRouter.delete(
  '/:userId',
  [hasAuthorization, hasCustomHeader, validateCustomHeader, validateAccess],
  UserController.deleteOneUser,
);
module.exports = userRouter;
