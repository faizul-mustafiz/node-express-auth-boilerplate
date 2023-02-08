const express = require('express');
const authRouter = express.Router();
const { AuthController } = require('../controllers/index');

authRouter.post('/sign-up', AuthController.signUp);
authRouter.post('/sign-in', AuthController.signIn);
authRouter.post('/sign-out', AuthController.signOut);
authRouter.post('/verify', AuthController.verify);
authRouter.post('/rest-password', AuthController.resetPassword);
authRouter.post('/change-password', AuthController.changePassword);
authRouter.post('/refresh', AuthController.refresh);
authRouter.post('/revoke-at', AuthController.revokeAccessToken);
authRouter.post('/revoke-rt', AuthController.revokeRefreshToken);

module.exports = authRouter;
