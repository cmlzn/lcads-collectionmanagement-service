const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { Collection } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getIdListOfCollectionByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const collectionProperties = [
      "id",
      "title",
      "description",
      "type",
      "themeTags",
      "institution",
      "visibility",
      "ownerUserId",
      "curatorUserIds",
      "auditNotes",
    ];

    isValidField = collectionProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof Collection[fieldName];

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

    let collectionIdList = await Collection.findAll(options);

    if (!collectionIdList || collectionIdList.length === 0) {
      throw new NotFoundError(
        `Collection with the specified criteria not found`,
      );
    }

    collectionIdList = collectionIdList.map((item) => item.id);
    return collectionIdList;
  } catch (err) {
    hexaLogger.insertError(
      "DatabaseError",
      { function: "getIdListOfCollectionByField", fieldValue: fieldValue },
      "getIdListOfCollectionByField.js->getIdListOfCollectionByField",
      err,
      null,
    );
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCollectionIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfCollectionByField;
