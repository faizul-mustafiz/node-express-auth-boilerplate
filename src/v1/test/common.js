const ApplicationStatus = require('../enums/applicationStatus.enum');
const testUserObj = {
  email: 'test@gmail.com',
  password: '123456',
};
const testNewPassword = '12345678';
const testUserUpdateObj = {
  email: 'johndoe@gmail.com',
  password: '12345678',
  name: 'John Doe',
  avatar: 'https://pixabay.com/images/id-973460/',
  mobile: '+8801700000000',
  dob: '1990-09-09',
  organization: 'Evil Corp',
};

const testApplicationCreateObj = {
  appName: 'test_app',
  origin: 'http://test_app.com',
};
const testApplicationUpdateObj = {
  appName: 'test_app_updated',
  origin: 'http://test_app_updated.com',
  appUser: 'john_doe',
  status: ApplicationStatus.Inactive,
};
const testDeviceInfoObj = {
  deviceId: '67256558250eda49',
};
module.exports = {
  testUserObj,
  testNewPassword,
  testUserUpdateObj,
  testApplicationCreateObj,
  testApplicationUpdateObj,
  testDeviceInfoObj,
};
