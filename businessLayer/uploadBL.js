const UploadDAL = require('../dataAccessLayer/uploadDAL');

const getItems = async (userId, pageSize, page) => {
  return new UploadDAL().getItems({ userId }, null, pageSize, page);
};

const add = async (doc) => {
  // TODO : add business rules
  // limmit file Types
  // limmit file path len (url field len)

  return new UploadDAL().add(doc);
};

const update = async (filter, updateDoc) => {
  return new UploadDAL().update(filter, updateDoc);
};

const deleteItem = async (doc) => {
  return new UploadDAL().delete(doc);
};

module.exports = {
  getItems,
  add,
  update,
  deleteItem,
};
