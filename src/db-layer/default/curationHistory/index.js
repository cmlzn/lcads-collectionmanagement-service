const utils = require("./utils");

module.exports = {
  createCurationHistory: utils.createCurationHistory,
  getIdListOfCurationHistoryByField: utils.getIdListOfCurationHistoryByField,
  getCurationHistoryById: utils.getCurationHistoryById,
  getCurationHistoryAggById: utils.getCurationHistoryAggById,
  getCurationHistoryListByQuery: utils.getCurationHistoryListByQuery,
  getCurationHistoryStatsByQuery: utils.getCurationHistoryStatsByQuery,
  getCurationHistoryByQuery: utils.getCurationHistoryByQuery,
  updateCurationHistoryById: utils.updateCurationHistoryById,
  updateCurationHistoryByIdList: utils.updateCurationHistoryByIdList,
  updateCurationHistoryByQuery: utils.updateCurationHistoryByQuery,
  deleteCurationHistoryById: utils.deleteCurationHistoryById,
  deleteCurationHistoryByQuery: utils.deleteCurationHistoryByQuery,
};
