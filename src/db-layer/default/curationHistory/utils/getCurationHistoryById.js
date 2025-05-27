const { HttpServerError } = require("common");

let { CurationHistory } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getCurationHistoryById = async (curationHistoryId) => {
  try {
    const curationHistory = Array.isArray(curationHistoryId)
      ? await CurationHistory.findAll({
          where: {
            id: { [Op.in]: curationHistoryId },
          },
        })
      : await CurationHistory.findByPk(curationHistoryId);
    if (!curationHistory) {
      return null;
    }
    return Array.isArray(curationHistoryId)
      ? curationHistory.map((item) => item.getData())
      : curationHistory.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCurationHistoryById",
      err,
    );
  }
};

module.exports = getCurationHistoryById;
