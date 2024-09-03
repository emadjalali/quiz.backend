const { to } = require('await-to-js');
const { signToken, mapUserToTokenUser } = require('../helper');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const authHelper = require('../helper');
const User = require('../../../businessLayer/userBL');

const JWTStrategy = passportJWT.Strategy;

const strategy = () => {
  const strategyOptions = {
    jwtFromRequest: (req) => {
      return authHelper.cookiesToToken(req);
    },
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true,
  };

  const verifyCallback = async (req, jwtPayload, cb) => {
    const id = jwtPayload.data.id;
    const [err, user] = await to(User.getUserById(id));

    if (err) {
      return cb(err);
    }
    if (!user) {
      return cb('user not found');
    }
    if (!user.isActive) {
      return cb('The account is not active');
    }

    req.user = user;
    return cb(null, mapUserToTokenUser(user));
  };

  passport.use(new JWTStrategy(strategyOptions, verifyCallback));
};

const login = (req, user) => {
  if (!user) {
    throw new Error('user data required');
  }
  return new Promise((resolve, reject) => {
    req.login(user, { session: false }, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(signToken(user));
    });
  });
};

module.exports = { strategy, login };
