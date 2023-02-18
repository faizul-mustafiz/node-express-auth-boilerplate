const express = require('express');
const authRouter = express.Router();
const { AuthController } = require('../controllers/index');
const hasAuthorization = require('../middlewares/hasAuthorization.middleware');
const hasOTP = require('../middlewares/hasOTP.middleware');

authRouter.post('/sign-up', AuthController.signUp);
authRouter.post('/sign-in', AuthController.signIn);
authRouter.post('/sign-out', hasAuthorization, AuthController.signOut);
authRouter.post(
  '/verify',
  [hasAuthorization, hasOTP],
  AuthController.verifySingUp,
);
authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.post(
  '/change-password',
  [hasAuthorization, hasOTP],
  AuthController.changePassword,
);
authRouter.post('/refresh', hasAuthorization, AuthController.refresh);
authRouter.post(
  '/revoke-at',
  hasAuthorization,
  AuthController.revokeAccessToken,
);
authRouter.post(
  '/revoke-rt',
  hasAuthorization,
  AuthController.revokeRefreshToken,
);

module.exports = authRouter;
