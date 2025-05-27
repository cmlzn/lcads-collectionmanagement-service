const { HttpServerError } = require("common");

const { CollectionDocument } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const updateCollectionDocumentByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;
    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };
    [rowsCount, rows] = await CollectionDocument.update(dataClause, options);
    const collectionDocumentIdList = rows.map((item) => item.id);
    return collectionDocumentIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingCollectionDocumentByIdList",
      err,
    );
  }
};

module.exports = updateCollectionDocumentByIdList;
