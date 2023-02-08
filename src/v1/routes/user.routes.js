const express = require('express');
const userRouter = express.Router();
const { UserController } = require('../controllers/index');

userRouter.get('/', UserController.getAllUser);
userRouter.get('/:userId', UserController.getOneUser);
userRouter.post('/:userId', UserController.updateOneUser);
userRouter.delete('/:userId', UserController.deleteOneUser);
module.exports = userRouter;
