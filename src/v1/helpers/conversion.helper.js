base64ToString = (base64) => {
  const string = Buffer.from(base64, 'base64').toString('utf8');
  return string;
};
stringToBase64 = (string) => {
  const base64 = Buffer.from(string, 'utf8').toString('base64');
  return base64;
};
jsonToBase64 = (json) => {
  const string = JSON.stringify(json);
  return stringToBase64(string);
};
base64ToJson = (base64) => {
  const string = base64ToString(base64);
  return JSON.parse(string);
};
base64ToArrayBuffer = (base64) => {
  const buffer = Buffer.from(base64, 'base64');
  return buffer;
};
arrayBufferToBase64 = (arrayBuffer) => {
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  return base64;
};
extractKeyIvAndMessage = (payload) => {
  // the first 44 characters of that given payload is sharedKey
  const key = payload.substr(0, 44);
  // the first 16 characters of that given payload is sharedIv
  const iv = payload.substr(44, 16);
  // rest of the string is encryptedMessage
  const message = payload.substr(60);
  return { key, iv, message };
};

module.exports = {
  base64ToString,
  stringToBase64,
  jsonToBase64,
  base64ToJson,
  base64ToArrayBuffer,
  arrayBufferToBase64,
  extractKeyIvAndMessage,
};
