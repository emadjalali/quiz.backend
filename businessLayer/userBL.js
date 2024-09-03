const { to } = require('await-to-js');
const localize = require('../localize.json');

const UserModel = require('../domain/userModel');
const UserDAL = require('../dataAccessLayer/userDAL');

const getUserById = async (userId) => {
  return new UserDAL().getItemById(userId);
};

const getUserByEmail = async (email) => {
  return new UserDAL().getItem({ email });
};

const getUserByProviderId = async (providerId) => {
  return new UserDAL().getItem({ providerId });
};

const validatedAddUser = async (user) => {
  const validationErrors = new UserModel(user).createValidator({
    confirmPassword: user.confirmPassword,
  });
  if (validationErrors.length > 0) {
    throw new Error(validationErrors);
  }

  const [findUserError, findUser] = await to(getUserByEmail(user.email));
  if (findUserError) {
    throw new Error(localize.retriveDataError.replace('$param', 'user data'));
  }
  if (findUser) {
    throw new Error(localize.emailDuplicate);
  }

  return new UserModel(user);
};

const addNewUser = async (user) => {
  const [findUserError, findUser] = await to(getUserByEmail(user.email));
  if (findUserError) {
    throw new Error(localize.retriveDataError.replace('$param', 'user data'));
  }
  if (findUser) {
    throw new Error(localize.emailDuplicate);
  }
  return new UserDAL().add(user);
};

const updateUser = async (filter, doc) => {
  return new UserDAL().update(filter, doc);
};

module.exports = {
  validatedAddUser,
  getUserById,
  getUserByEmail,
  getUserByProviderId,
  addNewUser,
  updateUser,
};
