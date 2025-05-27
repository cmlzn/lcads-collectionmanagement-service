const defaultFunctions = require("./default");

module.exports = {
  // default Database
  // Collection Db Object
  createCollection: defaultFunctions.createCollection,
  getIdListOfCollectionByField: defaultFunctions.getIdListOfCollectionByField,
  getCollectionById: defaultFunctions.getCollectionById,
  getCollectionAggById: defaultFunctions.getCollectionAggById,
  getCollectionListByQuery: defaultFunctions.getCollectionListByQuery,
  getCollectionStatsByQuery: defaultFunctions.getCollectionStatsByQuery,
  getCollectionByQuery: defaultFunctions.getCollectionByQuery,
  updateCollectionById: defaultFunctions.updateCollectionById,
  updateCollectionByIdList: defaultFunctions.updateCollectionByIdList,
  updateCollectionByQuery: defaultFunctions.updateCollectionByQuery,
  deleteCollectionById: defaultFunctions.deleteCollectionById,
  deleteCollectionByQuery: defaultFunctions.deleteCollectionByQuery,
  // CollectionDocument Db Object
  createCollectionDocument: defaultFunctions.createCollectionDocument,
  getIdListOfCollectionDocumentByField:
    defaultFunctions.getIdListOfCollectionDocumentByField,
  getCollectionDocumentById: defaultFunctions.getCollectionDocumentById,
  getCollectionDocumentAggById: defaultFunctions.getCollectionDocumentAggById,
  getCollectionDocumentListByQuery:
    defaultFunctions.getCollectionDocumentListByQuery,
  getCollectionDocumentStatsByQuery:
    defaultFunctions.getCollectionDocumentStatsByQuery,
  getCollectionDocumentByQuery: defaultFunctions.getCollectionDocumentByQuery,
  updateCollectionDocumentById: defaultFunctions.updateCollectionDocumentById,
  updateCollectionDocumentByIdList:
    defaultFunctions.updateCollectionDocumentByIdList,
  updateCollectionDocumentByQuery:
    defaultFunctions.updateCollectionDocumentByQuery,
  deleteCollectionDocumentById: defaultFunctions.deleteCollectionDocumentById,
  deleteCollectionDocumentByQuery:
    defaultFunctions.deleteCollectionDocumentByQuery,
  // Favorite Db Object
  createFavorite: defaultFunctions.createFavorite,
  getIdListOfFavoriteByField: defaultFunctions.getIdListOfFavoriteByField,
  getFavoriteById: defaultFunctions.getFavoriteById,
  getFavoriteAggById: defaultFunctions.getFavoriteAggById,
  getFavoriteListByQuery: defaultFunctions.getFavoriteListByQuery,
  getFavoriteStatsByQuery: defaultFunctions.getFavoriteStatsByQuery,
  getFavoriteByQuery: defaultFunctions.getFavoriteByQuery,
  updateFavoriteById: defaultFunctions.updateFavoriteById,
  updateFavoriteByIdList: defaultFunctions.updateFavoriteByIdList,
  updateFavoriteByQuery: defaultFunctions.updateFavoriteByQuery,
  deleteFavoriteById: defaultFunctions.deleteFavoriteById,
  deleteFavoriteByQuery: defaultFunctions.deleteFavoriteByQuery,
  // CurationHistory Db Object
  createCurationHistory: defaultFunctions.createCurationHistory,
  getIdListOfCurationHistoryByField:
    defaultFunctions.getIdListOfCurationHistoryByField,
  getCurationHistoryById: defaultFunctions.getCurationHistoryById,
  getCurationHistoryAggById: defaultFunctions.getCurationHistoryAggById,
  getCurationHistoryListByQuery: defaultFunctions.getCurationHistoryListByQuery,
  getCurationHistoryStatsByQuery:
    defaultFunctions.getCurationHistoryStatsByQuery,
  getCurationHistoryByQuery: defaultFunctions.getCurationHistoryByQuery,
  updateCurationHistoryById: defaultFunctions.updateCurationHistoryById,
  updateCurationHistoryByIdList: defaultFunctions.updateCurationHistoryByIdList,
  updateCurationHistoryByQuery: defaultFunctions.updateCurationHistoryByQuery,
  deleteCurationHistoryById: defaultFunctions.deleteCurationHistoryById,
  deleteCurationHistoryByQuery: defaultFunctions.deleteCurationHistoryByQuery,
};
