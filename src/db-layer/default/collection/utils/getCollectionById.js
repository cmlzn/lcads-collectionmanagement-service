const { HttpServerError } = require("common");

let { Collection } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getCollectionById = async (collectionId) => {
  try {
    const collection = Array.isArray(collectionId)
      ? await Collection.findAll({
          where: {
            id: { [Op.in]: collectionId },
          },
        })
      : await Collection.findByPk(collectionId);
    if (!collection) {
      return null;
    }
    return Array.isArray(collectionId)
      ? collection.map((item) => item.getData())
      : collection.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCollectionById",
      err,
    );
  }
};

module.exports = getCollectionById;
