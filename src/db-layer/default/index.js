const collectionFunctions = require("./collection");
const collectionDocumentFunctions = require("./collectionDocument");
const favoriteFunctions = require("./favorite");
const curationHistoryFunctions = require("./curationHistory");

module.exports = {
  // default Database
  // Collection Db Object
  createCollection: collectionFunctions.createCollection,
  getIdListOfCollectionByField:
    collectionFunctions.getIdListOfCollectionByField,
  getCollectionById: collectionFunctions.getCollectionById,
  getCollectionAggById: collectionFunctions.getCollectionAggById,
  getCollectionListByQuery: collectionFunctions.getCollectionListByQuery,
  getCollectionStatsByQuery: collectionFunctions.getCollectionStatsByQuery,
  getCollectionByQuery: collectionFunctions.getCollectionByQuery,
  updateCollectionById: collectionFunctions.updateCollectionById,
  updateCollectionByIdList: collectionFunctions.updateCollectionByIdList,
  updateCollectionByQuery: collectionFunctions.updateCollectionByQuery,
  deleteCollectionById: collectionFunctions.deleteCollectionById,
  deleteCollectionByQuery: collectionFunctions.deleteCollectionByQuery,
  // CollectionDocument Db Object
  createCollectionDocument:
    collectionDocumentFunctions.createCollectionDocument,
  getIdListOfCollectionDocumentByField:
    collectionDocumentFunctions.getIdListOfCollectionDocumentByField,
  getCollectionDocumentById:
    collectionDocumentFunctions.getCollectionDocumentById,
  getCollectionDocumentAggById:
    collectionDocumentFunctions.getCollectionDocumentAggById,
  getCollectionDocumentListByQuery:
    collectionDocumentFunctions.getCollectionDocumentListByQuery,
  getCollectionDocumentStatsByQuery:
    collectionDocumentFunctions.getCollectionDocumentStatsByQuery,
  getCollectionDocumentByQuery:
    collectionDocumentFunctions.getCollectionDocumentByQuery,
  updateCollectionDocumentById:
    collectionDocumentFunctions.updateCollectionDocumentById,
  updateCollectionDocumentByIdList:
    collectionDocumentFunctions.updateCollectionDocumentByIdList,
  updateCollectionDocumentByQuery:
    collectionDocumentFunctions.updateCollectionDocumentByQuery,
  deleteCollectionDocumentById:
    collectionDocumentFunctions.deleteCollectionDocumentById,
  deleteCollectionDocumentByQuery:
    collectionDocumentFunctions.deleteCollectionDocumentByQuery,
  // Favorite Db Object
  createFavorite: favoriteFunctions.createFavorite,
  getIdListOfFavoriteByField: favoriteFunctions.getIdListOfFavoriteByField,
  getFavoriteById: favoriteFunctions.getFavoriteById,
  getFavoriteAggById: favoriteFunctions.getFavoriteAggById,
  getFavoriteListByQuery: favoriteFunctions.getFavoriteListByQuery,
  getFavoriteStatsByQuery: favoriteFunctions.getFavoriteStatsByQuery,
  getFavoriteByQuery: favoriteFunctions.getFavoriteByQuery,
  updateFavoriteById: favoriteFunctions.updateFavoriteById,
  updateFavoriteByIdList: favoriteFunctions.updateFavoriteByIdList,
  updateFavoriteByQuery: favoriteFunctions.updateFavoriteByQuery,
  deleteFavoriteById: favoriteFunctions.deleteFavoriteById,
  deleteFavoriteByQuery: favoriteFunctions.deleteFavoriteByQuery,
  // CurationHistory Db Object
  createCurationHistory: curationHistoryFunctions.createCurationHistory,
  getIdListOfCurationHistoryByField:
    curationHistoryFunctions.getIdListOfCurationHistoryByField,
  getCurationHistoryById: curationHistoryFunctions.getCurationHistoryById,
  getCurationHistoryAggById: curationHistoryFunctions.getCurationHistoryAggById,
  getCurationHistoryListByQuery:
    curationHistoryFunctions.getCurationHistoryListByQuery,
  getCurationHistoryStatsByQuery:
    curationHistoryFunctions.getCurationHistoryStatsByQuery,
  getCurationHistoryByQuery: curationHistoryFunctions.getCurationHistoryByQuery,
  updateCurationHistoryById: curationHistoryFunctions.updateCurationHistoryById,
  updateCurationHistoryByIdList:
    curationHistoryFunctions.updateCurationHistoryByIdList,
  updateCurationHistoryByQuery:
    curationHistoryFunctions.updateCurationHistoryByQuery,
  deleteCurationHistoryById: curationHistoryFunctions.deleteCurationHistoryById,
  deleteCurationHistoryByQuery:
    curationHistoryFunctions.deleteCurationHistoryByQuery,
};
