require('dotenv');
const User = require('../models/user.model');

getAllUser = async (req, res, next) => {
  try {
    const result = await User.find();
    const count = await User.count();
    console.log('getAllUser-result', result);
    console.log('getAllUser-count', count);
    if (count === 0) {
      return res.status(203).json({
        success: false,
        message: 'User collection is Empty',
        result: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Successfully found all user documents',
      result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Oops there is an Error', result: {} });
  }
};
getOneUser = async (req, res, next) => {
  console.log('getOneUser', req.params);
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'BAD REQUEST',
      result: {},
    });
  }
  try {
    const result = await User.findOne({ _id: userId });
    if (!result) {
      res.status(404).json({
        success: false,
        message: 'NOT FOUND',
        result: {},
      });
    }
    res.status(200).json({
      success: true,
      message: 'Successfully found user document',
      result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Oops there is an Error', result: {} });
  }
};
updateOneUser = async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'BAD REQUEST',
      result: {},
    });
  }
  try {
    const { email } = req.body;
    const existingUser = await User.emailExist(email);
    console.log('existingUser', existingUser);
    if (existingUser._id != userId) {
      return res.status(400).json({
        success: false,
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
    console.log('changes', changes);
    const updatedUser = Object.assign(existingUser, changes);
    console.log('updatedUser', updatedUser);
    const result = await existingUser.save();
    console.log('result', result);
    return res.status(200).json({
      success: true,
      message: 'Successfully updated user',
      result: result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Oops there is an Error', result: {} });
  }
};
deleteOneUser = async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'BAD REQUEST',
      result: {},
    });
  }
  try {
    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: 'NOT FOUND',
        result: {},
      });
    }
    const result = await User.findOneAndDelete({ _id: userId });
    res.status(200).json({
      success: true,
      message: 'Successfully deleted user',
      result: result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Oops there is an Error', result: {} });
  }
};

module.exports = {
  getAllUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
};
