const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { CurationHistory } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getIdListOfCurationHistoryByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const curationHistoryProperties = [
      "id",
      "collectionId",
      "collectionDocumentId",
      "actorUserId",
      "actionType",
      "actionTimestamp",
      "reason",
    ];

    isValidField = curationHistoryProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof CurationHistory[fieldName];

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

    let curationHistoryIdList = await CurationHistory.findAll(options);

    if (!curationHistoryIdList || curationHistoryIdList.length === 0) {
      throw new NotFoundError(
        `CurationHistory with the specified criteria not found`,
      );
    }

    curationHistoryIdList = curationHistoryIdList.map((item) => item.id);
    return curationHistoryIdList;
  } catch (err) {
    hexaLogger.insertError(
      "DatabaseError",
      { function: "getIdListOfCurationHistoryByField", fieldValue: fieldValue },
      "getIdListOfCurationHistoryByField.js->getIdListOfCurationHistoryByField",
      err,
      null,
    );
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCurationHistoryIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfCurationHistoryByField;
