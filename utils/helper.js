const sanitizeHtml = require('sanitize-html');

function isEmpty(str) {
  if (str == 'undefined' || str == null) return true;
  return str === '' || 0 === str.length;
}

function toCleanValue(str) {
  if (isEmpty(str)) {
    return '';
  }
  let _str = sanitizeHtml(str);
  return _str == 'undefined' ? '' : _str;
}

function strPadLeft(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
  return regex.test(email);
}

function isValidPhoneNumber(phoneNumber) {
  const regex = /^(\+98|0098|98|0)?9\d{9}$/;
  return regex.test(phoneNumber);
}

const stringToBoolean = (stringValue) => {
  stringValue = stringValue ? stringValue.toLowerCase().trim() : '';
  switch (stringValue) {
    case 'true':
    case 'yes':
    case '1':
      return true;

    case 'undefined':
    case 'false':
    case 'no':
    case '0':
    case null:
    case undefined:
      return false;

    default:
      return JSON.parse(stringValue);
  }
};

function addDaysToDate(date, number) {
  const newDate = new Date(date);
  return new Date(newDate.setDate(newDate.getDate() + number));
}

function generateUniqueId() {
  return Math.floor(Math.random() * Math.floor(Math.random() * Date.now())).toString();
}

function generateUniqueId2() {
  return Math.floor(Math.random() * Math.floor(Math.random() * Date.now())).toString(36);
}

const generateError = (res, msg, redirectUrl) => {
  if (!redirectUrl) {
    return res.status(200).json({ success: false, data: msg });
  } else {
    return res.status(200).redirect(redirectUrl);
  }
};

module.exports = {
  isEmpty,
  strPadLeft,
  generateError,
  isValidEmail,
  isValidPhoneNumber,
  toCleanValue,
  stringToBoolean,
  addDaysToDate,
  generateUniqueId,
  generateUniqueId2,
};
