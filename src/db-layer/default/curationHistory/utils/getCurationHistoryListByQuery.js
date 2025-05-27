const { HttpServerError, BadRequestError } = require("common");

const { CurationHistory } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCurationHistoryListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const curationHistory = await CurationHistory.findAll({ where: query });
    if (!curationHistory) return [];
    return curationHistory.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCurationHistoryListByQuery",
      err,
    );
  }
};

module.exports = getCurationHistoryListByQuery;
