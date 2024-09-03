class UserDAL {
  constructor() {
    this.db = global.db;
    this.collectionName = 'users';
  }

  async getItems(filter = {}, projection = {}) {
    return this.db.readCollection(this.collectionName, filter, projection).toArray();
  }

  async getItem(filter, projection = {}) {
    return this.db.readDocument(this.collectionName, filter, projection);
  }

  async getItemById(_id, projection = {}) {
    return this.db.readDocumentById(this.collectionName, _id, projection);
  }

  async add(doc) {
    return this.db.createDocument(this.collectionName, doc);
  }

  async update(filter, updateDoc) {
    return this.db.updateDocument(this.collectionName, filter, updateDoc);
  }

  async replace(filter, replaceDoc) {
    return this.db.replaceDocument(this.collectionName, filter, replaceDoc);
  }
}

module.exports = UserDAL;
