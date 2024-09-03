const { MongoClient, ObjectId } = require('mongodb');
const { dbConnectionError } = require('../localize.json');

function MongoDao(connectionString, dbname) {
  const _this = this;
  const options = {
    maxPoolSize: 100,
    wtimeoutMS: 2500,
    connectTimeoutMS: 10000,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  };

  _this.mongoClient = new MongoClient(connectionString, options);

  return new Promise((resolve, reject) => {
    _this.mongoClient.connect((err, client) => {
      if (err) {
        reject(new Error(dbConnectionError));
      } else {
        _this.dbConnection = _this.mongoClient.db(dbname);
        resolve(_this);
      }
    });
  });
}

MongoDao.prototype.readCollection = function (collectionName, query, projection) {
  const res = this.dbConnection.collection(collectionName).find(query);
  return res.project(projection);
};

MongoDao.prototype.aggregate = function (collectionName, pipeline) {
  return this.dbConnection.collection(collectionName).aggregate(pipeline);
};

MongoDao.prototype.readCollectionSortAndFilter = function (
  collectionName,
  query,
  sort,
  nRecords,
  projection
) {
  const res = this.dbConnection.collection(collectionName).find(query).sort(sort).limit(nRecords);
  return res.project(projection);
};

MongoDao.prototype.readDocument = function (collectionName, filter, projection) {
  return this.dbConnection.collection(collectionName).findOne(filter, { projection });
};

MongoDao.prototype.readDocumentById = function (collectionName, id, projection) {
  // eslint-disable-next-line global-require
  const oId = ObjectId(id);
  return this.dbConnection.collection(collectionName).findOne({ _id: oId }, projection);
};

MongoDao.prototype.findAndModifyDocument = async function (
  collectionName,
  filter,
  update,
  projection
) {
  const options = { returnOriginal: false, projection };
  return this.dbConnection.collection(collectionName).findOneAndUpdate(filter, update, options);
};

MongoDao.prototype.createDocument = async function (collectionName, doc) {
  return this.dbConnection.collection(collectionName).insertOne(doc);
};

MongoDao.prototype.createDocuments = async function (collectionName, array) {
  return await this.dbConnection.collection(collectionName).insertMany(array);
};

MongoDao.prototype.updateDocument = async function (
  collectionName,
  filter,
  updateDocument,
  options
) {
  return this.dbConnection.collection(collectionName).updateMany(filter, updateDocument, options);
};

MongoDao.prototype.replaceDocument = async function (collectionName, doc, replaceDoc) {
  return this.dbConnection.collection(collectionName).replaceOne(doc, replaceDoc);
};

MongoDao.prototype.deleteDocument = async function (collectionName, doc) {
  return this.dbConnection.collection(collectionName).deleteOne(doc);
};

module.exports = MongoDao;
