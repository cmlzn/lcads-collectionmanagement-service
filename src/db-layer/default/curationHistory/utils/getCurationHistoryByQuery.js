const { HttpServerError, BadRequestError } = require("common");

const { CurationHistory } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCurationHistoryByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const curationHistory = await CurationHistory.findOne({ where: query });
    if (!curationHistory) return null;
    return curationHistory.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCurationHistoryByQuery",
      err,
    );
  }
};

module.exports = getCurationHistoryByQuery;
