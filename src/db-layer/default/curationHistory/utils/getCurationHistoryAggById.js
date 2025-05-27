const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  Collection,
  CollectionDocument,
  Favorite,
  CurationHistory,
} = require("models");
const { Op } = require("sequelize");

const getCurationHistoryAggById = async (curationHistoryId) => {
  try {
    const forWhereClause = false;
    const includes = [];
    const curationHistory = Array.isArray(curationHistoryId)
      ? await CurationHistory.findAll({
          where: {
            id: { [Op.in]: curationHistoryId },
          },
          include: includes,
        })
      : await CurationHistory.findByPk(curationHistoryId, {
          include: includes,
        });

    if (!curationHistory) {
      return null;
    }

    const curationHistoryData =
      Array.isArray(curationHistoryId) && curationHistoryId.length > 0
        ? curationHistory.map((item) => item.getData())
        : curationHistory.getData();
    await CurationHistory.getCqrsJoins(curationHistoryData);
    return curationHistoryData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCurationHistoryAggById",
      err,
    );
  }
};

module.exports = getCurationHistoryAggById;
