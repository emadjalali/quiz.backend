const helper = require('../utils/helper');
const localize = require('../localize.json');
const passwordValidator = require('../utils/passwordValidator');

module.exports = class User {
  constructor({ _id, firstName, lastName, email, password }) {
    this._id = _id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email ? email.toLowerCase() : '';
    this.password = password;

    this.fullName = `${firstName} ${lastName}`;
  }

  createValidator({ confirmPassword }) {
    const errors = [];

    if (!this.firstName) {
      errors.push(localize.requiredParam.replace('$param', 'firstName'));
    } else {
      if (this.firstName.length > 50) {
        errors.push('The maximum length of the firstName must be 50 characters');
      }
    }

    if (!this.lastName) {
      errors.push(localize.requiredParam.replace('$param', 'lastName'));
    } else {
      if (this.lastName.length > 50) {
        errors.push('The maximum length of the lastName must be 50 characters');
      }
    }

    if (!this.email) {
      errors.push(localize.requiredParam.replace('$param', 'email'));
    } else {
      if (this.email.length > 50) {
        errors.push('The maximum length of the email must be 50 characters');
      } else {
        if (!helper.isValidEmail(this.email)) {
          errors.push(localize.emailValidationError);
        }
      }
    }

    if (!this.password) {
      errors.push(localize.requiredParam.replace('$param', 'password'));
    } else {
      const passErrs = passwordValidator(this.password);
      errors.concat(passErrs);
    }

    if (!confirmPassword) {
      errors.push(localize.requiredParam.replace('$param', 'confirmPassword'));
    }

    if (this.password && confirmPassword && this.password !== confirmPassword) {
      errors.push('Password & Confirm Password do not match');
    }

    return errors;
  }
};
