const { HttpServerError, BadRequestError } = require("common");

const { CollectionDocument } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCollectionDocumentByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const collectionDocument = await CollectionDocument.findOne({
      where: query,
    });
    if (!collectionDocument) return null;
    return collectionDocument.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCollectionDocumentByQuery",
      err,
    );
  }
};

module.exports = getCollectionDocumentByQuery;
