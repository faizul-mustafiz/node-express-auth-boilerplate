const { encryptMessage } = require('../helpers/encrypt.helper');

messageEncryptionTest = async (message) => {
  if (message) {
    const data = await encryptMessage(message);
    console.log('messageEncryptionTest-data:', data);
  } else {
    console.log('Message encryption test was unsuccessful');
  }
};

messageEncryptionTest('encryption-test-successful');

module.exports = { messageEncryptionTest };
