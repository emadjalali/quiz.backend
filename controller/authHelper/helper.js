const passport = require('passport');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const cookieHelper = require('../authHelper/auth-cookies');

const User = require('../../businessLayer/userBL');

const setup = () => {
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (_id, done) => {
    try {
      const user = await User.getUserById(_id);
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  });
};

const validateAndGetTokenData = (req) => {
  try {
    const utdp1 = cookieHelper.getTokenCookie(req, 'utdp1');
    const utdp2 = cookieHelper.getTokenCookie(req, 'utdp2');
    const utdp3 = cookieHelper.getTokenCookie(req, 'utdp3');

    const token = `${utdp1}.${utdp2}.${utdp3}`;
    const data = jwt.verify(token, process.env.JWT_SECRET);

    if (!data || !data.data || !data.data.isActive) {
      throw new Error('Not Authenticated');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const validateAndGetUserRegInfo = (token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('There is no user information'));
    } else {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedToken) {
        reject(new Error('operation error'));
      } else {
        if (decodedToken.data != null) {
          resolve(decodedToken.data);
        } else {
          reject(new Error('operation error'));
        }
      }
    }
  });
};

const mapUserToTokenUser = (doc) => {
  if (doc == null) {
    return null;
  }

  const obj = doc;
  delete obj.password;

  return obj;
};

const signToken = (user) => {
  return jwt.sign({ data: user }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION_SEC,
  });
};

const hashPassword = async (password) => {
  if (!password) {
    throw new Error('password is required');
  }
  return argon2.hash(password);
};

const verifyPassword = async (candidate, actual) => {
  return argon2.verify(actual, candidate);
};

module.exports = {
  setup,
  signToken,
  hashPassword,
  verifyPassword,
  validateAndGetTokenData,
  validateAndGetUserRegInfo,
  mapUserToTokenUser,
};
