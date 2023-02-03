const express = require('express');
const userRouter = express.Router();
const { UserController } = require('../controllers');

userRouter.get('/', UserController.getAllUser);
userRouter.post('/:userId', UserController.getOneUser);
userRouter.patch('/:userId', UserController.updateOneUser);
userRouter.delete(':/userId', UserController.deleteOneUser);
module.exports = userRouter;
