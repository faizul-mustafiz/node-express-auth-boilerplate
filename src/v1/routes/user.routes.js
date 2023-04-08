const express = require('express');
const userRouter = express.Router();
const { UserController } = require('../controllers/index');
/**
 * * application info header check and validation relate imports
 */
const hasAppInfoHeader = require('../middlewares/hasAppInfoHeader.middleware');
const validateAppInfoHeader = require('../middlewares/validateAppInfoHeader.middleware');
/**
 * * Jwt header check and validation relate imports
 */
const hasAuthorization = require('../middlewares/hasAuthorization.middleware');
const validateAccess = require('../middlewares/validateAccess.middleware');

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
