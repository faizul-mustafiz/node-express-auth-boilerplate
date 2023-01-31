base64ToString = (base64) => {
  const string = Buffer.from(base64, 'base64').toString('utf8');
  return string;
};
stringToBase64 = (string) => {
  const base64 = Buffer.from(string, 'utf8').toString('base64');
  return base64;
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
module.exports = {
  base64ToString,
  stringToBase64,
  base64ToArrayBuffer,
  arrayBufferToBase64,
};
