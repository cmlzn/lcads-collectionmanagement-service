const utils = require("./utils");

module.exports = {
  createFavorite: utils.createFavorite,
  getIdListOfFavoriteByField: utils.getIdListOfFavoriteByField,
  getFavoriteById: utils.getFavoriteById,
  getFavoriteAggById: utils.getFavoriteAggById,
  getFavoriteListByQuery: utils.getFavoriteListByQuery,
  getFavoriteStatsByQuery: utils.getFavoriteStatsByQuery,
  getFavoriteByQuery: utils.getFavoriteByQuery,
  updateFavoriteById: utils.updateFavoriteById,
  updateFavoriteByIdList: utils.updateFavoriteByIdList,
  updateFavoriteByQuery: utils.updateFavoriteByQuery,
  deleteFavoriteById: utils.deleteFavoriteById,
  deleteFavoriteByQuery: utils.deleteFavoriteByQuery,
};
