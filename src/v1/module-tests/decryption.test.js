const {
  decryptMessage,
  decryptFormSingleEncryptedPayload,
} = require('../helpers/decrypt.helper');

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

messageDecryptionFromSingleEncryptedPayload = (payload) => {
  const { key, iv, message } = decryptFormSingleEncryptedPayload(payload);
  console.log('key:', key, 'iv:', iv, 'message:', message);
  messageDecryptionTest(key, iv, message);
};

const payload =
  'SmZka0pIUmdpN2VSVmRDblh2ZnQ3VytjbzRYb25ZOExjNGpGbGlXbi9ZQT1yRHA5M2c5NkphajVPZWVSSE52SXBmV0I1VmFTQmQ5anVUUG5LUGU0S2hyUnN4Zk8zaE43NmJ1UGQxK004M01uK1BUMHN0ZWhBemR2OVllblhpOUUrZz09';
messageDecryptionFromSingleEncryptedPayload(payload);

module.exports = {
  messageDecryptionTest,
  messageDecryptionFromSingleEncryptedPayload,
};
