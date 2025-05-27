const { HttpServerError } = require("common");

const { Favorite } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const updateFavoriteByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;
    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };
    [rowsCount, rows] = await Favorite.update(dataClause, options);
    const favoriteIdList = rows.map((item) => item.id);
    return favoriteIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingFavoriteByIdList",
      err,
    );
  }
};

module.exports = updateFavoriteByIdList;
