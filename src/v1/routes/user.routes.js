const express = require('express');
const userRouter = express.Router();
const { UserController } = require('../controllers/index');
const hasAuthorization = require('../middlewares/hasAuthorization.middleware');
const validateAccess = require('../middlewares/validateAccess.middleware');

userRouter.get(
  '/',
  [hasAuthorization, validateAccess],
  UserController.getAllUser,
);
userRouter.get(
  '/:userId',
  [hasAuthorization, validateAccess],
  UserController.getOneUser,
);
userRouter.post(
  '/:userId',
  [hasAuthorization, validateAccess],
  UserController.updateOneUser,
);
userRouter.delete(
  '/:userId',
  [hasAuthorization, validateAccess],
  UserController.deleteOneUser,
);
module.exports = userRouter;
