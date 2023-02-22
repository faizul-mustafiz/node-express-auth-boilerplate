require('dotenv');
const {
  NonAuthoritative,
  Success,
  InternalServerError,
  NotFound,
} = require('../handlers/responses/http-response');
const User = require('../models/user.model');
const logger = require('../loggers/logger');

getAllUser = async (req, res, next) => {
  try {
    const result = await User.find();
    const count = await User.count();
    logger.debug('getAllUser-result: %s', result);
    logger.info('getAllUser-count: %s', count);
    if (count === 0) {
      return NonAuthoritative(res, {
        message: 'User collection is Empty',
        result: [],
      });
    }
    return Success(res, {
      message: 'Successfully found all user documents',
      result,
    });
  } catch (error) {
    logger.error('get-all-user-error', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: {},
    });
  }
};
getOneUser = async (req, res, next) => {
  logger.debug('getOneUser: %s', req.params);
  const { userId } = req.params;
  if (!userId) {
    return NotFound(res, {
      message: 'Invalid path not found',
      result: {},
    });
  }
  try {
    const result = await User.findOne({ _id: userId });
    if (!result) {
      return NotFound(res, {
        message: 'NOT FOUND',
        result: {},
      });
    }
    return Success(res, {
      message: 'Successfully found user document',
      result,
    });
  } catch (error) {
    logger.error('get-one-user-error', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: {},
    });
  }
};
updateOneUser = async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return NotFound(res, {
      message: 'Invalid path not found',
      result: {},
    });
  }
  try {
    const { email } = req.body;
    const existingUser = await User.emailExist(email);
    logger.debug('existingUser: %s', existingUser);
    if (existingUser._id != userId) {
      return BadRequest(res, {
        message:
          'An account with this email already exists, which you are trying to update',
        result: {},
      });
    }
    let changes = {
      email: req.body.email,
      password: req.body.password,
    };
    changes.password = await User.generateHash(changes.password);
    logger.debug('changes: %s', changes);
    const updatedUser = Object.assign(existingUser, changes);
    logger.debug('updatedUser: %s', updatedUser);
    const result = await existingUser.save();
    logger.debug('result: %s', result);
    return Success(res, {
      message: 'Successfully updated user',
      result: result,
    });
  } catch (error) {
    logger.error('update-one-user-error', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: {},
    });
  }
};
deleteOneUser = async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return NotFound(res, {
      message: 'Invalid path not found',
      result: {},
    });
  }
  try {
    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
      return NotFound(res, {
        message: 'NOT FOUND',
        result: {},
      });
    }
    const result = await User.findOneAndDelete({ _id: userId });
    return Success(res, {
      message: 'Successfully deleted user',
      result: result,
    });
  } catch (error) {
    logger.error('delete-one-user-error', error);
    return InternalServerError(res, {
      message: 'oops! there is an Error',
      result: {},
    });
  }
};

module.exports = {
  getAllUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
};
