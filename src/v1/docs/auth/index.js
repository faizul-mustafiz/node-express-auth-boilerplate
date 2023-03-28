const signIn = require('./sign-in');
const signUp = require('./sign-up');
const verify = require('./verify');
const forgotPassword = require('./forgot-password');
const changePassword = require('./change-password');
const refresh = require('./refresh');
const revokeAt = require('./revoke-at');
const revokeRt = require('./revoke-rt');
const signOut = require('./sign-out');

module.exports = {
  '/auth/sign-in': {
    ...signIn,
  },
  '/auth/sign-up': {
    ...signUp,
  },
  '/auth/verify': {
    ...verify,
  },
  '/auth/sign-out': {
    ...signOut,
  },
  '/auth/forgot-password': {
    ...forgotPassword,
  },
  '/auth/change-password': {
    ...changePassword,
  },
  '/auth/refresh': {
    ...refresh,
  },
  '/auth/revoke-at': {
    ...revokeAt,
  },
  '/auth/revoke-rt': {
    ...revokeRt,
  },
};
