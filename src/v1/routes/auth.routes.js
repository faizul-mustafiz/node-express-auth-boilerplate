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

const hasCustomHeader = require('../middlewares/hasCustomHeader.middleware');
const validateCustomHeader = require('../middlewares/validateCustomHeader.middleware');

authRouter.post(
  '/sign-up',
  [hasCustomHeader, validateCustomHeader, validateAuthRequestBody],
  AuthController.signUp,
);
authRouter.post(
  '/sign-in',
  [hasCustomHeader, validateCustomHeader, validateAuthRequestBody],
  AuthController.signIn,
);
authRouter.post(
  '/sign-out',
  [hasAuthorization, hasCustomHeader, validateCustomHeader, validateRefresh],
  AuthController.signOut,
);
authRouter.post(
  '/verify',
  [
    hasAuthorization,
    hasCustomHeader,
    validateCustomHeader,
    validateVerifyRequestBody,
    validateVerification,
  ],
  AuthController.verifyAuth,
);
authRouter.post(
  '/forgot-password',
  [hasCustomHeader, validateCustomHeader, validateForgotPasswordRequestBody],
  AuthController.forgotPassword,
);
authRouter.post(
  '/change-password',
  [
    hasAuthorization,
    hasCustomHeader,
    validateCustomHeader,
    validateChangePasswordRequestBody,
    validateChangePassword,
  ],
  AuthController.changePassword,
);
authRouter.post(
  '/refresh',
  [hasAuthorization, hasCustomHeader, validateCustomHeader, validateRefresh],
  AuthController.refresh,
);
authRouter.post(
  '/revoke-at',
  [hasAuthorization, hasCustomHeader, validateCustomHeader, validateAccess],
  AuthController.revokeAccessToken,
);
authRouter.post(
  '/revoke-rt',
  [hasAuthorization, hasCustomHeader, validateCustomHeader, validateRefresh],
  AuthController.revokeRefreshToken,
);

module.exports = authRouter;
