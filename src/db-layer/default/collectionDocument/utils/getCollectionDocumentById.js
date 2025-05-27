const { HttpServerError } = require("common");

let { CollectionDocument } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getCollectionDocumentById = async (collectionDocumentId) => {
  try {
    const collectionDocument = Array.isArray(collectionDocumentId)
      ? await CollectionDocument.findAll({
          where: {
            id: { [Op.in]: collectionDocumentId },
          },
        })
      : await CollectionDocument.findByPk(collectionDocumentId);
    if (!collectionDocument) {
      return null;
    }
    return Array.isArray(collectionDocumentId)
      ? collectionDocument.map((item) => item.getData())
      : collectionDocument.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCollectionDocumentById",
      err,
    );
  }
};

module.exports = getCollectionDocumentById;
