const MongoDao = require('../dataAccessLayer/mongoDao');
const config = require('../config');

exports.init = async () => {
  try {
    return await new MongoDao(config.DB_CONNECTION_STRING, config.DB_NAME);
  } catch (ex) {
    throw new Error(ex.message);
  }
};
