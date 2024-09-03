class QuizDAL {
  constructor() {
    this.db = global.db;
    this.collectionName = 'channelUsersLastId';
  }

  async #getItem() {
    return this.db.readDocument(this.collectionName);
  }

  async #add(doc) {
    return this.db.createDocument(this.collectionName, doc);
  }

  async #update(updateDoc) {
    return this.db.updateDocument(this.collectionName, {}, updateDoc);
  }

  async #delete() {
    return this.db.deleteDocument(this.collectionName, {});
  }

  async getLastId() {
    try {
      let rec = await this.#getItem();
      if (!rec || !rec.lastId) {
        await this.#delete();
        await this.#add({ lastId: 0 });
      }
      await this.#update({ $inc: { lastId: 1 } });
      return await this.#getItem();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = QuizDAL;
