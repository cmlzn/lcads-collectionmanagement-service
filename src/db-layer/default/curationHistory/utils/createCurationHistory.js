const { HttpServerError, BadRequestError } = require("common");

const { ElasticIndexer } = require("serviceCommon");

const { CurationHistory } = require("models");
const { hexaLogger, newUUID } = require("common");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer(
    "curationHistory",
    this.session,
    this.requestId,
  );
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const allowedFields = [
    "id",
    "collectionId",
    "collectionDocumentId",
    "actorUserId",
    "actionType",
    "actionTimestamp",
    "reason",
  ];

  Object.keys(data).forEach((key) => {
    if (!allowedFields.includes(key)) {
      throw new BadRequestError(`Unexpected field "${key}" in input data.`);
    }
  });

  const requiredFields = [];

  requiredFields.forEach((field) => {
    if (data[field] === null || data[field] === undefined) {
      throw new BadRequestError(
        `Field "${field}" is required and cannot be null or undefined.`,
      );
    }
  });

  if (!data.id) {
    data.id = newUUID();
  }
};

const createCurationHistory = async (data) => {
  try {
    validateData(data);

    const newcurationHistory = await CurationHistory.create(data);
    const _data = newcurationHistory.getData();
    await indexDataToElastic(_data);
    return _data;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenCreatingCurationHistory", err);
  }
};

module.exports = createCurationHistory;
