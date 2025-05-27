const { HttpServerError, BadRequestError } = require("common");

const { ElasticIndexer } = require("serviceCommon");

const { Favorite } = require("models");
const { hexaLogger, newUUID } = require("common");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer(
    "favorite",
    this.session,
    this.requestId,
  );
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const allowedFields = ["id", "userId", "documentMetadataId"];

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

const createFavorite = async (data) => {
  try {
    validateData(data);

    const newfavorite = await Favorite.create(data);
    const _data = newfavorite.getData();
    await indexDataToElastic(_data);
    return _data;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenCreatingFavorite", err);
  }
};

module.exports = createFavorite;
