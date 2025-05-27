const utils = require("./utils");

module.exports = {
  createCollection: utils.createCollection,
  getIdListOfCollectionByField: utils.getIdListOfCollectionByField,
  getCollectionById: utils.getCollectionById,
  getCollectionAggById: utils.getCollectionAggById,
  getCollectionListByQuery: utils.getCollectionListByQuery,
  getCollectionStatsByQuery: utils.getCollectionStatsByQuery,
  getCollectionByQuery: utils.getCollectionByQuery,
  updateCollectionById: utils.updateCollectionById,
  updateCollectionByIdList: utils.updateCollectionByIdList,
  updateCollectionByQuery: utils.updateCollectionByQuery,
  deleteCollectionById: utils.deleteCollectionById,
  deleteCollectionByQuery: utils.deleteCollectionByQuery,
};
