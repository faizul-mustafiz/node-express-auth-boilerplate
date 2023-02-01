const {
  encryptMessage,
  encryptMessageToSingleBase64,
} = require('../helpers/encrypt.helper');

messageEncryptionTest = async (message) => {
  if (message) {
    const data = await encryptMessage(message);
    console.log('messageEncryptionTest-data:', data);
  } else {
    console.log('Message encryption test was unsuccessful');
  }
};

singleEncryptedPayloadTest = async (message) => {
  if (message) {
    const data = await encryptMessageToSingleBase64(message);
    console.log('singleEncryptedPayloadTest-data:', data);
  } else {
    console.log('Single encrypted payload test was unsuccessful');
  }
};

messageEncryptionTest(JSON.stringify({ username: 'jhon', password: 'dow' }));

singleEncryptedPayloadTest(
  JSON.stringify({ username: 'jhon', password: 'dow' }),
);

module.exports = { messageEncryptionTest, singleEncryptedPayloadTest };
