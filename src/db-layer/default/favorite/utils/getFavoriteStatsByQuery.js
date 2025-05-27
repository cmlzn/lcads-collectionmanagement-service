const { HttpServerError, BadRequestError } = require("common");

const { Favorite } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getFavoriteCountByQuery = async (query, stats) => {
  const promises = [];
  const statLabels = [];
  try {
    for (const stat of stats) {
      statParts = stat.replace("(", "-").replace(")", "").split("-");
      if (stat === "count") {
        promises.push(Favorite.count({ where: query }));
        statLabels.push("count");
      } else if (statParts.length == 2) {
        if (statParts[0] === "sum") {
          promises.push(Favorite.sum(statParts[1], { where: query }));
          statLabels.push("sum-" + statParts[1]);
        } else if (statParts[0] === "avg") {
          promises.push(Favorite.avg(statParts[1], { where: query }));
          statLabels.push("avg-" + statParts[1]);
        } else if (statParts[0] === "min") {
          promises.push(Favorite.min(statParts[1], { where: query }));
          statLabels.push("min-" + statParts[1]);
        } else if (statParts[0] === "max") {
          promises.push(Favorite.max(statParts[1], { where: query }));
          statLabels.push("max-" + statParts[1]);
        }
      }
    }

    if (promises.length == 0) {
      return await Favorite.count({ where: query });
    } else if (promises.length == 1) {
      return await promises[0];
    } else {
      const results = await Promise.all(promises);
      return results.reduce((acc, val, index) => {
        acc[statLabels[index]] = val;
        return acc;
      }, {});
    }
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFavoriteStatsByQuery",
      err,
    );
  }
};

module.exports = getFavoriteCountByQuery;
