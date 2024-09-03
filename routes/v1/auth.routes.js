const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({ extended: false });

const googleAuth = require('../../controller/authHelper/strategies/google');
const authController = require('../../controller/authController');

function Router(app) {
  app.get(`/api/google`, googleAuth.google);
  app.get(`/api/google/callback`, googleAuth.authenticate);

  app.post('/api/v1/auth/register', parseForm, authController.register);
  app.post('/api/v1/auth/verifyEmail', parseForm, authController.verifyEmail);

  app.post('/api/v1/auth/login', parseForm, authController.login);
  app.get('/api/v1/auth/logout', parseForm, authController.logout);

  app.get('/api/v1/auth/getUserInfo', parseForm, authController.getUserInfo);
}

module.exports = Router;
