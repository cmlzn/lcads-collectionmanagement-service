const { HttpServerError } = require("common");

const { CurationHistory } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const updateCurationHistoryByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;
    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };
    [rowsCount, rows] = await CurationHistory.update(dataClause, options);
    const curationHistoryIdList = rows.map((item) => item.id);
    return curationHistoryIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingCurationHistoryByIdList",
      err,
    );
  }
};

module.exports = updateCurationHistoryByIdList;
