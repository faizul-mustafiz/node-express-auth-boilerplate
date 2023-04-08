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

const hasAppInfoHeader = require('../middlewares/hasAppInfoHeader.middleware');
const validateAppInfoHeader = require('../middlewares/validateAppInfoHeader.middleware');

const hasDeviceInfoHeader = require('../middlewares/hasDeviceInfoHeader.middleware');
const validateDeviceInfoHeader = require('../middlewares/validateDeviceInfoHeader.middleware');

authRouter.post(
  '/sign-up',
  [
    hasAppInfoHeader,
    hasDeviceInfoHeader,
    validateAppInfoHeader,
    validateDeviceInfoHeader,
    validateAuthRequestBody,
  ],
  AuthController.signUp,
);
authRouter.post(
  '/sign-in',
  [
    hasAppInfoHeader,
    hasDeviceInfoHeader,
    validateAppInfoHeader,
    validateDeviceInfoHeader,
    validateAuthRequestBody,
  ],
  AuthController.signIn,
);
authRouter.post(
  '/sign-out',
  [hasAppInfoHeader, validateAppInfoHeader, hasAuthorization, validateRefresh],
  AuthController.signOut,
);
authRouter.post(
  '/verify',
  [
    hasAppInfoHeader,
    validateAppInfoHeader,
    hasAuthorization,
    validateVerifyRequestBody,
    validateVerification,
  ],
  AuthController.verifyAuth,
);
authRouter.post(
  '/forgot-password',
  [
    hasAppInfoHeader,
    hasDeviceInfoHeader,
    validateAppInfoHeader,
    validateDeviceInfoHeader,
    validateForgotPasswordRequestBody,
  ],
  AuthController.forgotPassword,
);
authRouter.post(
  '/change-password',
  [
    hasAppInfoHeader,
    validateAppInfoHeader,
    hasAuthorization,
    validateChangePasswordRequestBody,
    validateChangePassword,
  ],
  AuthController.changePassword,
);
authRouter.post(
  '/refresh',
  [hasAppInfoHeader, validateAppInfoHeader, hasAuthorization, validateRefresh],
  AuthController.refresh,
);
authRouter.post(
  '/revoke-at',
  [hasAppInfoHeader, validateAppInfoHeader, hasAuthorization, validateAccess],
  AuthController.revokeAccessToken,
);
authRouter.post(
  '/revoke-rt',
  [hasAppInfoHeader, validateAppInfoHeader, hasAuthorization, validateRefresh],
  AuthController.revokeRefreshToken,
);

module.exports = authRouter;
