const { decryptMessage } = require('../helpers/decrypt.helper');

messageDecryptionTest = async (sharedKey, sharedIv, encryptedMessage) => {
  if (sharedKey && sharedIv && encryptedMessage) {
    const decryptedMessage = await decryptMessage(
      sharedKey,
      sharedIv,
      encryptedMessage,
    );
    console.log('messageDecryptionTest-decryptedMessage:', decryptedMessage);
  } else {
    console.log('Message decryption test was unsuccessful');
  }
};

messageDecryptionTest(
  'b/Ydg6z04ZBzNtk9e3Oy+PV0BGK4pgAgWr/i9pt5tuE=',
  'P0nDi0/bX/BJhm20',
  'gK93tB17b115pN+t77hMAQG4qwlqCeMY15/piVxDf/G8+Fj4YAG+2CSs',
);

module.exports = { messageDecryptionTest };
