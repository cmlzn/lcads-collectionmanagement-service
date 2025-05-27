const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class CollectionDocumentQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("collectionDocument", [], Op.and, Op.eq, input, wClause);
  }
}
class CollectionDocumentQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("collectionDocument", []);
  }
}

module.exports = {
  CollectionDocumentQueryCache,
  CollectionDocumentQueryCacheInvalidator,
};
