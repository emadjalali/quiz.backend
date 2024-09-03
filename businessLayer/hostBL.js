const QuizDAL = require('../dataAccessLayer/quizDAL');
const ChannelUsersLastIdDAL = require('../dataAccessLayer/channelUsersLastIdDAL');

const getQuizzes = async (hostId, pageSize, page) => {
  return new QuizDAL().getItems(
    { hostId },
    { _id: 1, createdDate: 1, title: 1, quizURL: 1 },
    pageSize,
    page
  );
};

const getQuiz = async (quizId) => {
  return new QuizDAL().getItemById(quizId);
};

const getQuizByQuizURL = async (quizURL) => {
  const quiz = await new QuizDAL().getItem({ quizURL });
  if (!quiz) {
    return null;
  }

  const channelUserLastId = await new ChannelUsersLastIdDAL().getLastId();
  if (!channelUserLastId) {
    return null;
  }

  const questions = [];
  if (Array.isArray(quiz.questions)) {
    Array.from(quiz.questions).forEach((item) => {
      questions.push(item.question);
    });

    quiz.questions = [...questions];
  }
  quiz.lastUserId = Number(channelUserLastId.lastId);

  return quiz;
};

const addQuiz = async (doc) => {
  return new QuizDAL().add(doc);
};

module.exports = {
  getQuizzes,
  getQuiz,
  getQuizByQuizURL,
  addQuiz,
};
