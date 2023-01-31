const _crypto = require('crypto');
const { hashingAlgorithm } = require('../configs/hashing.config');
const { arrayBufferToBase64 } = require('./conversion.helper');

generateCryptoIv = () => {
  const cryptoIv = _crypto.getRandomValues(new Uint8Array(12));
  return cryptoIv;
};

generateCryptoKey = async () => {
  const cryptoKey = await _crypto.subtle.generateKey(
    {
      name: hashingAlgorithm,
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );
  return cryptoKey;
};

// This function is generating cryptoIv and cryptoKey which will be exposed to the client
exportCryptoKey = async (cryptoKey) => {
  // exporting rawCryptoKey from the generated cryptoKey
  const exportedRawKey = await _crypto.subtle.exportKey('raw', cryptoKey);

  // making a cryptoKey arrayBuffer from the exported cryptoKey
  const exportedKeyBuffer = new Uint8Array(exportedRawKey);

  // finally make a sharable base64 form the cryptoKey arrayBuffer
  const base64 = arrayBufferToBase64(exportedKeyBuffer);
  return base64;
};

encrypt = async (cryptoKey, cryptoIv, data) => {
  const cipherText = await _crypto.subtle.encrypt(
    {
      name: hashingAlgorithm,
      iv: cryptoIv,
    },
    cryptoKey,
    data,
  );
  console.log('encrypt-cipherText:', cipherText);
  const buffer = new Uint8Array(cipherText);
  console.log('encrypt-buffer:', buffer);
  const base64 = arrayBufferToBase64(buffer);
  console.log('encrypt-base64:', base64);
  return base64;
};

encryptMessage = async (message) => {
  // generating cryptoIv see generateCryptoIv() for reference
  const cryptoIv = generateCryptoIv();
  console.log('encryptMessage-cryptoIv:', cryptoIv);

  // generating cryptoKey see generateCryptoKey() for reference
  const cryptoKey = await generateCryptoKey();
  console.log('encryptMessage-cryptoKey:', cryptoKey);

  // encrypting provided message with generated cryptokey and cryptoIv
  const encryptedMessage = await encrypt(cryptoKey, cryptoIv, message);
  console.log('encryptMessage-encryptedMessage:', encryptedMessage);

  // converting cryptoIv to base64 for sharing with client
  const exportedCryptoIv = arrayBufferToBase64(cryptoIv);
  console.log('encryptMessage-exportedCryptoIv:', exportedCryptoIv);

  // converting cryptoKey to base64 for sharing with client
  const exportedCryptoKey = await exportCryptoKey(cryptoKey);
  console.log('encryptMessage-exportedCryptoKey:', exportedCryptoKey);

  // making a payload that will be shared to client
  const payload = {
    key: exportedCryptoKey,
    iv: exportedCryptoIv,
    message: encryptedMessage,
  };
  return payload;
};

test = async () => {};
test();

module.exports = {
  generateCryptoIv,
  generateCryptoKey,
  exportCryptoKey,
  encrypt,
  encryptMessage,
};
