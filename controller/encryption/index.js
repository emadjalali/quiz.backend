const CryptoJS = require('crypto-js');

const encrypt = (text, passphrase) => {
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};

const decrypt = (ciphertext, passphrase) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

const generateKeys = (count) => {
  const keys = [];

  for (let i = 0; i < count; i++) {
    const key = generate(20);
    keys.push(key);
  }

  return keys;
};

const generate = (len) => {
  const chars = 'QWyR!T1YUzIO2PAd3D@FGJK4LZXCVB5N%Mqwe6#rtu7iHop$aEs8fgh&9jSkl^x0cvb*nm';
  let password = '';
  for (var i = 0; i <= len; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  return password;
};

module.exports = {
  encrypt,
  decrypt,
  generateKeys,
};
