/* eslint-disable no-use-before-define */
const PasswordValidator = require('password-validator');
const schema = new PasswordValidator();

// Add properties to it
schema
  .is()
  .min(6) // Minimum length 8
  .is()
  .max(25) // Maximum length 100
  // .has()
  // .uppercase() // Must have uppercase letters
  // .has()
  // .lowercase() // Must have lowercase letters
  .has()
  .letters()
  .has()
  .digits() // Must have digits
  // .has().not().spaces()         // Should not have spaces
  .is()
  .not()
  .oneOf(['P@ssw0rd', 'P@ssword123', '[P@ssw0rd]']); // Blacklist these values

function validatePassword(password) {
  let err = [];
  const errors = schema.validate(password, { list: true });
  if (errors) {
    err = mapToErrors(errors);
  }
  return err;
}

function mapToErrors(errors) {
  const err = [];
  if (errors.includes('min')) {
    err.push('The minimum length of the password must be 6 characters');
  }

  if (errors.includes('max')) {
    err.push('The maximum password length should be 25 characters');
  }

  // if (errors.includes('lowercase')) {
  //   err.push('Password must contain at least one lowercase letter');
  // }

  // if (errors.includes('uppercase')) {
  //   err.push('Password must contain at least one capital letter');
  // }

  if (errors.includes('letters')) {
    err.push('Password must contain at least one letter');
  }

  if (errors.includes('digits')) {
    err.push('Password must contain at least one number');
  }

  if (errors.includes('oneOf')) {
    err.push('This password is not allowed');
  }

  return err;
}

module.exports = validatePassword;
