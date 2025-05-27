const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class FavoriteQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("favorite", [], Op.and, Op.eq, input, wClause);
  }
}
class FavoriteQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("favorite", []);
  }
}

module.exports = {
  FavoriteQueryCache,
  FavoriteQueryCacheInvalidator,
};
