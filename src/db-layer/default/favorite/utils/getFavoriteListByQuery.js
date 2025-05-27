const { HttpServerError, BadRequestError } = require("common");

const { Favorite } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getFavoriteListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const favorite = await Favorite.findAll({ where: query });
    if (!favorite) return [];
    return favorite.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFavoriteListByQuery",
      err,
    );
  }
};

module.exports = getFavoriteListByQuery;
