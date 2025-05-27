const utils = require("./utils");

module.exports = {
  createCollectionDocument: utils.createCollectionDocument,
  getIdListOfCollectionDocumentByField:
    utils.getIdListOfCollectionDocumentByField,
  getCollectionDocumentById: utils.getCollectionDocumentById,
  getCollectionDocumentAggById: utils.getCollectionDocumentAggById,
  getCollectionDocumentListByQuery: utils.getCollectionDocumentListByQuery,
  getCollectionDocumentStatsByQuery: utils.getCollectionDocumentStatsByQuery,
  getCollectionDocumentByQuery: utils.getCollectionDocumentByQuery,
  updateCollectionDocumentById: utils.updateCollectionDocumentById,
  updateCollectionDocumentByIdList: utils.updateCollectionDocumentByIdList,
  updateCollectionDocumentByQuery: utils.updateCollectionDocumentByQuery,
  deleteCollectionDocumentById: utils.deleteCollectionDocumentById,
  deleteCollectionDocumentByQuery: utils.deleteCollectionDocumentByQuery,
};
