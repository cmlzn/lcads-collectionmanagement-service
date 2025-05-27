const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class CurationHistoryQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("curationHistory", [], Op.and, Op.eq, input, wClause);
  }
}
class CurationHistoryQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("curationHistory", []);
  }
}

module.exports = {
  CurationHistoryQueryCache,
  CurationHistoryQueryCacheInvalidator,
};
