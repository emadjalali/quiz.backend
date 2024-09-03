const utils = require('../../controller/authHelper/helper');
const helper = require('../../utils/helper');
const localize = require('../../localize.json');

module.exports = async (req, res, next) => {
  try {
    req.user = utils.validateAndGetTokenData(req);
    next();
  } catch (ex) {
    return helper.generateError(res, localize.authenticationError);
  }
};
