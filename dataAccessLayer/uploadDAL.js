const { to } = require('await-to-js');

class UploadDAL {
  constructor() {
    this.db = global.db;
    this.collectionName = 'uploads';
  }

  async getItems(filter = {}, projection = null, pageSize, page) {
    page = page == 0 ? 1 : page - 1;
    const pipeline = [
      {
        $match: filter,
      },
      { $sort: { _id: -1 } },
    ];
    if (projection) {
      pipeline.push({
        $project: projection,
      });
    }
    pipeline.push({
      $facet: {
        metadata: [{ $count: 'total' }, { $addFields: { page: Number(page + 1) } }],
        data: [{ $skip: Number(page) }, { $limit: Number(pageSize) }],
      },
    });
    return this.db.aggregate(this.collectionName, pipeline).toArray();
  }

  async getItem(filter, projection = {}) {
    return this.db.readDocument(this.collectionName, filter, projection);
  }

  async add(doc) {
    const [err, item] = await to(this.getItem({ userId: doc.userId, url: doc.url }));
    if (err) {
      throw new Error(err.message);
    }
    if (!item) {
      return this.db.createDocument(this.collectionName, doc);
    }
  }

  async update(filter, updateDoc) {
    return this.db.updateDocument(this.collectionName, filter, updateDoc);
  }

  async delete(doc) {
    return this.db.deleteDocument(this.collectionName, doc);
  }
}

module.exports = UploadDAL;
