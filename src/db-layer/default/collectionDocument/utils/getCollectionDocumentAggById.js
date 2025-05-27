const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  Collection,
  CollectionDocument,
  Favorite,
  CurationHistory,
} = require("models");
const { Op } = require("sequelize");

const getCollectionDocumentAggById = async (collectionDocumentId) => {
  try {
    const forWhereClause = false;
    const includes = [];
    const collectionDocument = Array.isArray(collectionDocumentId)
      ? await CollectionDocument.findAll({
          where: {
            id: { [Op.in]: collectionDocumentId },
          },
          include: includes,
        })
      : await CollectionDocument.findByPk(collectionDocumentId, {
          include: includes,
        });

    if (!collectionDocument) {
      return null;
    }

    const collectionDocumentData =
      Array.isArray(collectionDocumentId) && collectionDocumentId.length > 0
        ? collectionDocument.map((item) => item.getData())
        : collectionDocument.getData();
    await CollectionDocument.getCqrsJoins(collectionDocumentData);
    return collectionDocumentData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCollectionDocumentAggById",
      err,
    );
  }
};

module.exports = getCollectionDocumentAggById;
