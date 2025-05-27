const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { CollectionDocument } = require("models");
const { ElasticIndexer } = require("serviceCommon");

const deleteCollectionDocumentById = async (id) => {
  try {
    if (typeof id === "object") {
      id = id.id;
    }
    if (!id)
      throw new BadRequestError("ID is required in utility update function");
    const existingDoc = await CollectionDocument.findOne({
      where: { id, isActive: true },
    });
    if (!existingDoc) {
      throw new NotFoundError(`Record with ID ${id} not found.`);
    }
    dataClause = { isActive: false };
    await existingDoc.update(dataClause);

    const elasticIndexer = new ElasticIndexer("collectionDocument");
    await elasticIndexer.deleteData(existingDoc.id);

    return existingDoc.getData();
  } catch (err) {
    throw new HttpServerError(
      "An unexpected error occurred during the update operation.",
      err,
    );
  }
};

module.exports = deleteCollectionDocumentById;
