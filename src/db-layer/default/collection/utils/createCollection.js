const { HttpServerError, BadRequestError } = require("common");

const { ElasticIndexer } = require("serviceCommon");

const { Collection } = require("models");
const { hexaLogger, newUUID } = require("common");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer(
    "collection",
    this.session,
    this.requestId,
  );
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const allowedFields = [
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

const createCollection = async (data) => {
  try {
    validateData(data);

    const newcollection = await Collection.create(data);
    const _data = newcollection.getData();
    await indexDataToElastic(_data);
    return _data;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenCreatingCollection", err);
  }
};

module.exports = createCollection;
