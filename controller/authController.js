const { to } = require('await-to-js');
const path = require('path');
const helper = require('../utils/helper');
const mailMessage = require('../utils/sendMail');
const authHelper = require('./authHelper/helper');
const cookieHelper = require('./authHelper/auth-cookies');
const localize = require('../localize.json');
const otpGen = require('../utils/otp');

const jwt = require('./authHelper/strategies/jwt');
const userBL = require('../businessLayer/userBL');

exports.register = async (req, res) => {
  try {
    const { body } = req;

    let firstName = helper.toCleanValue(body.firstName);
    let lastName = helper.toCleanValue(body.lastName);
    let email = helper.toCleanValue(body.email);
    let password = helper.toCleanValue(body.password);
    let confirmPassword = helper.toCleanValue(body.confirmPassword);
    let creationDate = new Date(new Date().toDateString());

    const user = {
      firstName,
      lastName,
      email,
      password: password,
      confirmPassword,
      creationDate,
    };

    const [validationErrors, validatedUser] = await to(userBL.validatedAddUser(user));
    if (validationErrors) {
      return helper.generateError(res, validationErrors.message);
    }

    const otp = otpGen();
    const data = otp.generateOTP();
    validatedUser.otp = data.secret;

    try {
      let templatePath = path.join(__dirname, '../', 'public/htmlTemplates/activate.html');
      mailMessage.sendMailMessage(
        templatePath,
        {
          user: `${validatedUser.fullName}`,
          code: data.token,
          title: 'quiz - Account activation email',
          message:
            'Use the security code below to complete the membership process on the Danami website.',
        },
        validatedUser.email,
        `quiz - Account activation email`
      );
    } catch (ex) {
      throw new Error('Error sending account activation email');
    }

    let cypherPass = await authHelper.hashPassword(password);
    validatedUser.password = cypherPass;
    const jwtUser = authHelper.signToken(validatedUser);

    cookieHelper.setTokenCookie(res, 'uriToken', jwtUser, 1800000);
    return res.status(200).json({
      success: true,
      data: 'Activation email has been sent',
    });
  } catch (error) {
    return helper.generateError(res, localize.failure);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { body } = req;

    let code = helper.toCleanValue(body.code);
    if (!code) {
      return helper.generateError(res, 'activation code is required');
    }

    const uriTokenCookie = cookieHelper.getTokenCookie(req, 'uriToken');
    const [tokenErr, user] = await to(authHelper.validateAndGetUserRegInfo(uriTokenCookie));
    if (tokenErr || !user) {
      return helper.generateError(res, 'unknown user');
    }

    if (!user.otp) {
      return helper.generateError(res, 'operation error');
    }

    const otp = otpGen();
    const isVerify = otp.verifyOTP(user.otp, code);
    if (!isVerify) {
      return helper.generateError(res, 'OTP token is not valid');
    }

    user.emailVerified = true;
    user.registerStrategy = 'local';
    user.activatedDate = new Date();
    user.isActive = true;
    delete user.otp;

    await userBL.addNewUser(user);
    const addedUser = await userBL.getUserByEmail(user.email);

    const newToken = await jwt.login(req, authHelper.mapUserToTokenUser(addedUser));
    if (!newToken) {
      return helper.generateError(res, 'authentication error');
    }

    cookieHelper.removeTokenCookie(res, 'uriToken');
    cookieHelper.setTokenCookies(res, newToken);
    return res.status(200).json({
      success: true,
      data: localize.success,
    });
  } catch (error) {
    return helper.generateError(res, localize.failure);
  }
};

exports.login = async (req, res) => {
  let loginErrorMessage = localize.usernameOrPasswordIncorrect;
  try {
    const { body } = req;

    let username = helper.toCleanValue(body.email);
    let password = helper.toCleanValue(body.password);
    if (helper.isEmpty(username) || helper.isEmpty(password)) {
      return helper.generateError(res, localize.usernameAndPasswordRequiered);
    }

    const user = await userBL.getUserByEmail(username);
    if (!user) {
      return helper.generateError(res, loginErrorMessage);
    }
    if (!user.isActive) {
      return helper.generateError(res, 'The user account is inactive');
    }
    if (helper.isEmpty(user.password)) {
      throw new Error(`bad authentication method`);
    }
    const equalPass = await authHelper.verifyPassword(password, user.password);
    if (!equalPass) {
      return helper.generateError(res, loginErrorMessage);
    }
    const token = await jwt.login(req, authHelper.mapUserToTokenUser(user));
    if (!token) {
      return helper.generateError(res, 'authentication error');
    }

    cookieHelper.setTokenCookies(res, token);
    return res.status(200).json({
      success: true,
      data: localize.success,
    });
  } catch (error) {
    return helper.generateError(res, loginErrorMessage);
  }
};

exports.logout = async (req, res) => {
  try {
    cookieHelper.removeJwtTokenCookies(res);
    return res.status(200).json({
      success: true,
      data: localize.success,
    });
  } catch (error) {
    return helper.generateError(res, localize.failure);
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const data = authHelper.validateAndGetTokenData(req);
    if (data && data.data && data.data._id) {
      const user = data.data;
      user.isAuthenticated = true;
      return res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }
  } catch (ex) {
    return helper.generateError(res, localize.authenticationError);
  }
};
