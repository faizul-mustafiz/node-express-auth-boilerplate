const express = require('express');
const authRouter = express.Router();
const { AuthController } = require('../controllers/index');
const hasAuthorization = require('../middlewares/hasAuthorization.middleware');
const hasOTP = require('../middlewares/hasOTP.middleware');
const validateAccess = require('../middlewares/validateAccess.middleware');
const validateRefresh = require('../middlewares/validateRefresh.middleware');
const validateVerification = require('../middlewares/validateVerification.middleware');
const authValidator = require('../validators/auth.validator');

authRouter.post('/sign-up', authValidator, AuthController.signUp);
authRouter.post('/sign-in', authValidator, AuthController.signIn);
authRouter.post(
  '/sign-out',
  [hasAuthorization, validateRefresh],
  AuthController.signOut,
);
authRouter.post(
  '/verify',
  [hasAuthorization, hasOTP, validateVerification],
  AuthController.verifySingUp,
);
authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.post(
  '/change-password',
  [hasAuthorization, hasOTP],
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
