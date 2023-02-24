const express = require('express');
const authRouter = express.Router();
const { AuthController } = require('../controllers/index');
const hasAuthorization = require('../middlewares/hasAuthorization.middleware');
const validateAccess = require('../middlewares/validateAccess.middleware');
const validateChangePassword = require('../middlewares/validateChangePassword.middleware');
const validateRefresh = require('../middlewares/validateRefresh.middleware');
const validateVerification = require('../middlewares/validateVerification.middleware');
const validateVerifyRequestBody = require('../middlewares/validateVerifyRequestBody.middleware');
const validateAuthRequestBody = require('../middlewares/validateAuthRequestBody.middleware');
const validateForgotPasswordRequestBody = require('../middlewares/validateForgotPasswordRequestBody.middleware');
const validateChangePasswordRequestBody = require('../middlewares/validateChangePasswordRequestBody.middleware');

authRouter.post('/sign-up', validateAuthRequestBody, AuthController.signUp);
authRouter.post('/sign-in', validateAuthRequestBody, AuthController.signIn);
authRouter.post(
  '/sign-out',
  [hasAuthorization, validateRefresh],
  AuthController.signOut,
);
authRouter.post(
  '/verify',
  [hasAuthorization, validateVerifyRequestBody, validateVerification],
  AuthController.verifyAuth,
);
authRouter.post(
  '/forgot-password',
  validateForgotPasswordRequestBody,
  AuthController.forgotPassword,
);
authRouter.post(
  '/change-password',
  [hasAuthorization, validateChangePasswordRequestBody, validateChangePassword],
  AuthController.changePassword,
);
authRouter.post(
  '/refresh',
  [hasAuthorization, validateRefresh],
  AuthController.refresh,
);
authRouter.post(
  '/revoke-at',
  [hasAuthorization, validateAccess],
  AuthController.revokeAccessToken,
);
authRouter.post(
  '/revoke-rt',
  [hasAuthorization, validateRefresh],
  AuthController.revokeRefreshToken,
);

module.exports = authRouter;
