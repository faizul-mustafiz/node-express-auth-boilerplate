const _crypto = require('crypto');
const { hashingAlgorithm } = require('../configs/hashing.config');
const {
  base64ToString,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  extractKeyIvAndMessage,
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

/* 
  The payload passed into this method is a base64 encoded combination of 
  {sharedKey}{sharedIv}{encryptedMessage}.

  In order to decrypt the message consumer need to decrypt the message from base64 to 
  string and then pass to extractKeyIvAndMessage() function to export the {key, iv, message}. 
  extractKeyIvAndMessage() takes the first 44 characters as sharedKey, following 16 characters 
  as sharedIv and rest is encryptedMessage.
*/
decryptFormSingleEncryptedPayload = (payload) => {
  // decodes the base64 encrypted payload
  const decodedPayload = base64ToString(payload);
  console.log(
    'decryptFormSingleEncryptedPayload-decryptedPayload',
    decodedPayload,
  );

  // extracts {sharedKey, sharedIv, encryptedMessage} from decoded base64 string.
  const extractedJson = extractKeyIvAndMessage(decodedPayload);
  console.log('decryptFormSingleEncryptedPayload-extractedJson', extractedJson);
  return extractedJson;
};

module.exports = {
  decryptMessage,
  decryptFormSingleEncryptedPayload,
};
