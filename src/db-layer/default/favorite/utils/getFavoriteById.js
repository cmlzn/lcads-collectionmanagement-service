const { HttpServerError } = require("common");

let { Favorite } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getFavoriteById = async (favoriteId) => {
  try {
    const favorite = Array.isArray(favoriteId)
      ? await Favorite.findAll({
          where: {
            id: { [Op.in]: favoriteId },
          },
        })
      : await Favorite.findByPk(favoriteId);
    if (!favorite) {
      return null;
    }
    return Array.isArray(favoriteId)
      ? favorite.map((item) => item.getData())
      : favorite.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingFavoriteById", err);
  }
};

module.exports = getFavoriteById;
