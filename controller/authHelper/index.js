const utils = require('./helper');
const strategies = require('./strategies');

const pipe =
  (...functions) =>
  (args) =>
    functions.reduce((arg, fn) => fn(arg), args);

const initialiseAuthentication = (app) => {
  utils.setup();
  pipe(strategies.GoogleStrategy, strategies.JWTStrategy)(app);
};

module.exports = { utils, initialiseAuthentication, strategies };
