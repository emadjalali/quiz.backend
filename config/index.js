require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SIGNKEY: process.env.SIGNKEY,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
  DB_NAME: process.env.DB_NAME,
};
