const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({ extended: false });

const hostController = require('../../controller/hostController');
const authenticate = require('../middlewares/authenticate');

function Router(app) {
  app.get('/api/v1/host/getQuizzes', parseForm, authenticate, hostController.getQuizzes);
  app.get('/api/v1/host/getQuiz/:quizId', parseForm, authenticate, hostController.getQuiz);
  app.get('/api/v1/host/getQuizByQuizURL/:quizURL', parseForm, hostController.getQuizByQuizURL);
  app.post('/api/v1/host/addQuiz', parseForm, authenticate, hostController.addQuiz);

  app.post('/api/v1/host/addUpload', parseForm, authenticate, hostController.addUpload);
  app.get('/api/v1/host/getUploads', parseForm, authenticate, hostController.getUploads);

  app.post('/api/v1/host/saveQuiz', parseForm, authenticate, hostController.saveQuiz);
  app.get(
    '/api/v1/host/getSavedQuiz/:savedQuizId',
    parseForm,
    authenticate,
    hostController.getSavedQuiz
  );
  app.get('/api/v1/host/getSavedQuizzes', parseForm, authenticate, hostController.getSavedQuizzes);
}

module.exports = Router;
