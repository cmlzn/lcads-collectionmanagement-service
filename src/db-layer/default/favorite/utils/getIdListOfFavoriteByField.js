const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { Favorite } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getIdListOfFavoriteByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const favoriteProperties = ["id", "userId", "documentMetadataId"];

    isValidField = favoriteProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof Favorite[fieldName];

    if (typeof fieldValue !== expectedType) {
      throw new BadRequestError(
        `Invalid field value type for ${fieldName}. Expected ${expectedType}.`,
      );
    }

    const options = {
      where: isArray
        ? { [fieldName]: { [Op.contains]: [fieldValue] }, isActive: true }
        : { [fieldName]: fieldValue, isActive: true },
      attributes: ["id"],
    };

    let favoriteIdList = await Favorite.findAll(options);

    if (!favoriteIdList || favoriteIdList.length === 0) {
      throw new NotFoundError(`Favorite with the specified criteria not found`);
    }

    favoriteIdList = favoriteIdList.map((item) => item.id);
    return favoriteIdList;
  } catch (err) {
    hexaLogger.insertError(
      "DatabaseError",
      { function: "getIdListOfFavoriteByField", fieldValue: fieldValue },
      "getIdListOfFavoriteByField.js->getIdListOfFavoriteByField",
      err,
      null,
    );
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFavoriteIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfFavoriteByField;
