const { HttpServerError } = require("common");

const { Collection } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const updateCollectionByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;
    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };
    [rowsCount, rows] = await Collection.update(dataClause, options);
    const collectionIdList = rows.map((item) => item.id);
    return collectionIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingCollectionByIdList",
      err,
    );
  }
};

module.exports = updateCollectionByIdList;
