const express = require('express');
const authRouter = express.Router();
const { AuthController } = require('../controllers/index');
const authorized = require('../middlewares/authorized.middlleware');

authRouter.post('/sign-up', AuthController.signUp);
authRouter.post('/sign-in', AuthController.signIn);
authRouter.post('/sign-out', authorized, AuthController.signOut);
authRouter.post('/verify', authorized, AuthController.verifySingUp);
authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.post('/change-password', authorized, AuthController.changePassword);
authRouter.post('/refresh', authorized, AuthController.refresh);
authRouter.post('/revoke-at', authorized, AuthController.revokeAccessToken);
authRouter.post('/revoke-rt', authorized, AuthController.revokeRefreshToken);

module.exports = authRouter;
