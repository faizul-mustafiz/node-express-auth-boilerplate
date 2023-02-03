const express = require('express');
const authRouter = express.Router();
const { AuthController } = require('../controllers');

authRouter.post('/sign-up', AuthController.signUp);
authRouter.post('/sign-in', AuthController.signIn);
authRouter.post('/sign-out', AuthController.signOut);
authRouter.post('/verify', AuthController.verify);
authRouter.post('/rest-password', AuthController.resetPassword);
authRouter.post('/change-password', AuthController.changePassword);
authRouter.post('/rv-access', AuthController.revokeAccessToken);
authRouter.post('/rv-refresh', AuthController.revokeRefreshToken);

module.exports = authRouter;
