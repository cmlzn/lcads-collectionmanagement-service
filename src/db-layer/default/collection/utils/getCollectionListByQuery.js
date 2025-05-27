const { HttpServerError, BadRequestError } = require("common");

const { Collection } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCollectionListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const collection = await Collection.findAll({ where: query });
    if (!collection) return [];
    return collection.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCollectionListByQuery",
      err,
    );
  }
};

module.exports = getCollectionListByQuery;
