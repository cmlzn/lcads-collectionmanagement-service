const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { CollectionDocument } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getIdListOfCollectionDocumentByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const collectionDocumentProperties = [
      "id",
      "collectionId",
      "documentMetadataId",
      "assignedByUserId",
      "notes",
      "orderInCollection",
    ];

    isValidField = collectionDocumentProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof CollectionDocument[fieldName];

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

    let collectionDocumentIdList = await CollectionDocument.findAll(options);

    if (!collectionDocumentIdList || collectionDocumentIdList.length === 0) {
      throw new NotFoundError(
        `CollectionDocument with the specified criteria not found`,
      );
    }

    collectionDocumentIdList = collectionDocumentIdList.map((item) => item.id);
    return collectionDocumentIdList;
  } catch (err) {
    hexaLogger.insertError(
      "DatabaseError",
      {
        function: "getIdListOfCollectionDocumentByField",
        fieldValue: fieldValue,
      },
      "getIdListOfCollectionDocumentByField.js->getIdListOfCollectionDocumentByField",
      err,
      null,
    );
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCollectionDocumentIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfCollectionDocumentByField;
