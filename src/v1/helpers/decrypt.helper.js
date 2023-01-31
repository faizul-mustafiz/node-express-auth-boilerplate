const _crypto = require('crypto');
const { hashingAlgorithm } = require('../configs/hashing.config');
const {
  base64ToString,
  arrayBufferToBase64,
  base64ToArrayBuffer,
} = require('./conversion.helper');

importCryptoKey = async (sharedKey) => {
  // generating arrayBuffer from the shared cryptoKey
  const convertedRawKey = base64ToArrayBuffer(sharedKey);

  // getting the crypto key form generated rawCryptoKey and returning key.
  const key = await _crypto.subtle.importKey(
    'raw',
    convertedRawKey,
    hashingAlgorithm,
    true,
    ['encrypt', 'decrypt'],
  );
  return key;
};

decrypt = async (cipherText, cryptoKey, cryptoIv) => {
  // decrypting the cipherText using the newly decoded cryptoKey and cryptoIv
  const decrypted = await _crypto.subtle.decrypt(
    {
      name: hashingAlgorithm,
      iv: cryptoIv,
    },
    cryptoKey,
    cipherText,
  );

  // converting the decrypted arrayBuffer to base64
  const base64 = arrayBufferToBase64(decrypted);

  // converting the base64 to string and returning string
  const string = base64ToString(base64);
  return string;
};

decryptMessage = async (sharedKey, sharedIv, sharedMessage) => {
  // making cryptoIv arrayBuffer from the shared base64 cryptoIv
  const cryptoIv = base64ToArrayBuffer(sharedIv);
  console.log('decryptMessage-cryptoIv', cryptoIv);

  // importing cryptoKey from the shared cryptoKey. See importCryptoKey() implementation
  const cryptoKey = await importCryptoKey(sharedKey);
  console.log('decryptMessage-cryptoKey', cryptoKey);

  // converting sharedMessage to arrayBuffer from base64;
  let cipherText = base64ToArrayBuffer(sharedMessage);
  console.log('decryptMessage-cipherText-ArrayBuffer', cipherText);

  // converting arrayBuffer to Uint8Array
  cipherText = new Uint8Array(cipherText);
  console.log('decryptMessage-cipherText-Uint8Array', cipherText);

  // finally decrypting the message. see decrypt() implementation
  let decryptedMessage = await decrypt(cipherText, cryptoKey, cryptoIv);
  console.log('decryptMessage-decryptedMessage', decryptedMessage);

  return { payload: decryptedMessage };
};

module.exports = {
  decryptMessage,
};
