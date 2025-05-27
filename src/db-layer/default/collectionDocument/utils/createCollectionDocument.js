const { HttpServerError, BadRequestError } = require("common");

const { ElasticIndexer } = require("serviceCommon");

const { CollectionDocument } = require("models");
const { hexaLogger, newUUID } = require("common");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer(
    "collectionDocument",
    this.session,
    this.requestId,
  );
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const allowedFields = [
    "id",
    "collectionId",
    "documentMetadataId",
    "assignedByUserId",
    "notes",
    "orderInCollection",
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

const createCollectionDocument = async (data) => {
  try {
    validateData(data);

    const newcollectionDocument = await CollectionDocument.create(data);
    const _data = newcollectionDocument.getData();
    await indexDataToElastic(_data);
    return _data;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenCreatingCollectionDocument",
      err,
    );
  }
};

module.exports = createCollectionDocument;
