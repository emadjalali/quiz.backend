const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { to } = require('await-to-js');
const { signToken, mapUserToTokenUser } = require('../helper');
const { setTokenCookies } = require('../auth-cookies');

const User = require('../../../businessLayer/userBL');

const strategy = (app) => {
  const strategyOptions = {
    clientID: '85100200478-0v0n08kp4h9sd6o9825a37vulu9chn9i.apps.googleusercontent.com', // process.env.GOOGLE_CLIENT_ID,
    clientSecret: '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', // process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://danestito.com/api/google/callback`,
    passReqToCallback: true,
  };

  const verifyCallback = async (request, accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.getUserByProviderId(profile.id);
      if (user) {
        return done(null, mapUserToTokenUser(user));
      }

      const verifiedEmail = (
        profile.emails.find((email) => email.verified) || profile.emails[0]
      ).value.toLowerCase();

      user = await User.getUserByEmail(verifiedEmail);
      if (user) {
        await User.updateUser(
          { _id: user._id },
          { provider: profile.provider, providerId: profile.id }
        );

        user.provider = profile.provider;
        user.providerId = profile.id;
        return done(null, mapUserToTokenUser(user));
      }

      if (!user) {
        const currDate = new Date();
        await User.addNewUser({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: verifiedEmail,
          emailVerified: true,
          password: null,
          isActive: true,
          activatedDate: currDate,
          registerDate: currDate,
          registerStrategy: 'google',
          provider: profile.provider,
          providerId: profile.id,
        });

        user = await User.getUserByEmail(verifiedEmail);
        return done(null, mapUserToTokenUser(user));
      }
    } catch (error) {
      return done(error, null);
    }
  };

  passport.use(new GoogleStrategy(strategyOptions, verifyCallback));

  return app;
};

const google = (req, res, next) => {
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
};

const authenticate = (req, res, next) => {
  passport.authenticate('google', function (err, user, info) {
    let returnUrl = process.env.CLIENT_WEBSITE_URL;
    if (err || !user) {
      return res.status(500).redirect(returnUrl);
    }
    const token = signToken(user);
    setTokenCookies(res, token);
    return res.status(200).redirect(returnUrl);
  })(req, res, next);
};

module.exports = { strategy, google, authenticate };
