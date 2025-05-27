const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  Collection,
  CollectionDocument,
  Favorite,
  CurationHistory,
} = require("models");
const { Op } = require("sequelize");

const getCollectionAggById = async (collectionId) => {
  try {
    const forWhereClause = false;
    const includes = [];
    const collection = Array.isArray(collectionId)
      ? await Collection.findAll({
          where: {
            id: { [Op.in]: collectionId },
          },
          include: includes,
        })
      : await Collection.findByPk(collectionId, { include: includes });

    if (!collection) {
      return null;
    }

    const collectionData =
      Array.isArray(collectionId) && collectionId.length > 0
        ? collection.map((item) => item.getData())
        : collection.getData();
    await Collection.getCqrsJoins(collectionData);
    return collectionData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCollectionAggById",
      err,
    );
  }
};

module.exports = getCollectionAggById;
