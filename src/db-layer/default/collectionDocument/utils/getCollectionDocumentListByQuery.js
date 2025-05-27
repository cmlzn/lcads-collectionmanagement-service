const { HttpServerError, BadRequestError } = require("common");

const { CollectionDocument } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCollectionDocumentListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const collectionDocument = await CollectionDocument.findAll({
      where: query,
    });
    if (!collectionDocument) return [];
    return collectionDocument.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCollectionDocumentListByQuery",
      err,
    );
  }
};

module.exports = getCollectionDocumentListByQuery;
