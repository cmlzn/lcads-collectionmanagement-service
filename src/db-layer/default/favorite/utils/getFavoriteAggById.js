const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  Collection,
  CollectionDocument,
  Favorite,
  CurationHistory,
} = require("models");
const { Op } = require("sequelize");

const getFavoriteAggById = async (favoriteId) => {
  try {
    const forWhereClause = false;
    const includes = [];
    const favorite = Array.isArray(favoriteId)
      ? await Favorite.findAll({
          where: {
            id: { [Op.in]: favoriteId },
          },
          include: includes,
        })
      : await Favorite.findByPk(favoriteId, { include: includes });

    if (!favorite) {
      return null;
    }

    const favoriteData =
      Array.isArray(favoriteId) && favoriteId.length > 0
        ? favorite.map((item) => item.getData())
        : favorite.getData();
    await Favorite.getCqrsJoins(favoriteData);
    return favoriteData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFavoriteAggById",
      err,
    );
  }
};

module.exports = getFavoriteAggById;
