const helper = require('../utils/helper');
const localize = require('../localize.json');
const encryption = require('./encryption');

const uploadBL = require('../businessLayer/uploadBL');
const hostBL = require('../businessLayer/hostBL');
const savedQuizBL = require('../businessLayer/savedQuizBL');

// #region quizzes

exports.getQuizzes = async (req, res) => {
  try {
    const { body, user } = req;
    let hostId = user.data._id;

    let pageSize = body.pageSize ? Number(body.pageSize) : 30;
    let page = body.page ? Number(body.page) : 1;

    const quizzes = await hostBL.getQuizzes(hostId, pageSize, page);

    return res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    return helper.generateError(res, localize.failure);
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const { params } = req;
    let quizId = helper.toCleanValue(params.quizId);
    if (!quizId) {
      return helper.generateError(res, 'quizId is required');
    }
    const quiz = await hostBL.getQuiz(quizId);
    return res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    return helper.generateError(res, localize.failure);
  }
};

exports.getQuizByQuizURL = async (req, res) => {
  try {
    const { params } = req;
    let quizURL = helper.toCleanValue(params.quizURL);
    if (!quizURL) {
      return helper.generateError(res, 'quizURL is required');
    }
    const quiz = await hostBL.getQuizByQuizURL(quizURL);
    return res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    return helper.generateError(res, localize.failure);
  }
};

exports.addQuiz = async (req, res) => {
  try {
    const { body, user } = req;
    const userId = user.data._id;

    const { title, questions } = body.quiz;
    if (!title || !questions || !Array.isArray(questions)) {
      return helper.generateError(res, 'parameters required');
    }

    const createdDate = new Date();
    const hostId = userId;
    const quizURL = helper.generateUniqueId2();
    const channelId1 = helper.generateUniqueId2();
    const channelId2 = helper.generateUniqueId2();

    const quiz = {
      hostId,
      channelId1,
      channelId2,
      quizURL: quizURL,
      createdDate,
      title,
      questions: [],
    };

    // generate enc key per quiz questions
    const count = Array.from(questions).length;
    const encKeys = encryption.generateKeys(count);

    Array.from(questions).forEach((question, index) => {
      const encQuestion = encryption.encrypt(JSON.stringify(question), encKeys[index]);
      quiz.questions.push({ question: encQuestion, encKey: encKeys[index] });
    });

    // save quiz with enc questions and enc key
    await hostBL.addQuiz(quiz);

    return res.status(200).json({
      success: true,
      data: localize.success,
    });
  } catch (error) {
    return helper.generateError(res, localize.failure);
  }
};

// #endregion

// #region uploads

exports.addUpload = async (req, res) => {
  try {
    const { body, user } = req;
    let userId = user.data._id;
    let pageSize = body.pageSize ? Number(body.pageSize) : 30;
    let page = body.page ? Number(body.page) : 1;

    const fileUrl = helper.toCleanValue(body.fileUrl);
    const doc = {
      userId: userId,
      url: fileUrl,
    };
    await uploadBL.add(doc);

    const files = await uploadBL.getItems(userId, pageSize, page);
    return res.status(200).json({
      success: true,
      data: files[0],
    });
  } catch (error) {
    return helper.generateError(res, localize.failure);
  }
};

exports.getUploads = async (req, res) => {
  try {
    const { body, user } = req;
    let userId = user.data._id;

    let pageSize = body.pageSize ? Number(body.pageSize) : 30;
    let page = body.page ? Number(body.page) : 1;

    const files = await uploadBL.getItems(userId, pageSize, page);
    return res.status(200).json({
      success: true,
      data: files[0],
    });
  } catch (error) {
    return helper.generateError(res, localize.failure);
  }
};

// #endregion

// #region savedQuizzes

exports.getSavedQuizzes = async (req, res) => {
  try {
    const { body, user } = req;
    let hostId = user.data._id;

    let pageSize = body.pageSize ? Number(body.pageSize) : 30;
    let page = body.page ? Number(body.page) : 1;

    const quizzes = await savedQuizBL.getSavedQuizzes(hostId, pageSize, page);

    return res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    return helper.generateError(res, localize.failure);
  }
};

exports.getSavedQuiz = async (req, res) => {
  try {
    const { params } = req;
    let savedQuizId = helper.toCleanValue(params.savedQuizId);
    if (!savedQuizId) {
      return helper.generateError(res, 'savedQuizId is required');
    }
    const savedQuiz = await savedQuizBL.getSavedQuizById(savedQuizId);
    return res.status(200).json({
      success: true,
      data: savedQuiz,
    });
  } catch (error) {
    return helper.generateError(res, localize.failure);
  }
};

exports.saveQuiz = async (req, res) => {
  try {
    const { body, user } = req;
    const userId = user.data._id;

    // const quizResult = body.quizResult;
    const quizId = body.quizId;
    if (!quizId) {
      return helper.generateError(res, 'quizResult --> quizId is required');
    }
    const createdDate = new Date();
    const hostId = userId;

    const quizInfo = await hostBL.getQuiz(quizId);
    if (!quizInfo) {
      return helper.generateError(res, `There is no quiz with ID=${quizId}`);
    }

    const quiz = {
      hostId,
      quizId,
      quizTitle: quizInfo.title,
      createdDate,
      result: body.result,
    };

    await savedQuizBL.saveQuiz(quiz);

    return res.status(200).json({
      success: true,
      data: localize.success,
    });
  } catch (error) {
    return helper.generateError(res, localize.failure);
  }
};

// #endregion
