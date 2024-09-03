class SavedQuizDAL {
  constructor() {
    this.db = global.db;
    this.collectionName = 'savedQuizzes';
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

  async getItemById(_id, projection = {}) {
    return this.db.readDocumentById(this.collectionName, _id, projection);
  }

  async add(doc) {
    return this.db.createDocument(this.collectionName, doc);
  }
}

module.exports = SavedQuizDAL;
