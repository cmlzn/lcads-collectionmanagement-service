const { HttpServerError, BadRequestError } = require("common");

const { Favorite } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getFavoriteByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const favorite = await Favorite.findOne({ where: query });
    if (!favorite) return null;
    return favorite.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFavoriteByQuery",
      err,
    );
  }
};

module.exports = getFavoriteByQuery;
