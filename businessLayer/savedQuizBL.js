const SavedQuizDAL = require('../dataAccessLayer/savedQuizDAL');

const getSavedQuizzes = async (hostId, pageSize, page) => {
  return new SavedQuizDAL().getItems(
    { hostId },
    { _id: 1, quizId: 1, quizTitle: 1, createdDate: 1 },
    pageSize,
    page
  );
};

const getSavedQuizById = async (quizId) => {
  return new SavedQuizDAL().getItemById(quizId);
};

const saveQuiz = async (doc) => {
  return new SavedQuizDAL().add(doc);
};

module.exports = {
  getSavedQuizzes,
  getSavedQuizById,
  saveQuiz,
};
