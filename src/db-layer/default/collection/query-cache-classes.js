const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class CollectionQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("collection", [], Op.and, Op.eq, input, wClause);
  }
}
class CollectionQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("collection", []);
  }
}

module.exports = {
  CollectionQueryCache,
  CollectionQueryCacheInvalidator,
};
