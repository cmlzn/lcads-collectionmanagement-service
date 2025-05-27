const { HttpServerError, BadRequestError } = require("common");

const { Collection } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCollectionByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const collection = await Collection.findOne({ where: query });
    if (!collection) return null;
    return collection.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCollectionByQuery",
      err,
    );
  }
};

module.exports = getCollectionByQuery;
