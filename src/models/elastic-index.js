const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const collectionMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  title: { type: "keyword", index: true },
  description: { type: "text", index: true },
  type: { type: "keyword", index: true },
  type_: { type: "keyword" },
  themeTags: { type: "keyword", index: true },
  institution: { type: "keyword", index: true },
  visibility: { type: "keyword", index: true },
  visibility_: { type: "keyword" },
  ownerUserId: { type: "keyword", index: false },
  curatorUserIds: { type: "keyword", index: false },
  auditNotes: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const collectionDocumentMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  collectionId: { type: "keyword", index: true },
  documentMetadataId: { type: "keyword", index: true },
  assignedByUserId: { type: "keyword", index: false },
  notes: { type: "text", index: false },
  orderInCollection: { type: "integer", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const favoriteMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  userId: { type: "keyword", index: false },
  documentMetadataId: { type: "keyword", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const curationHistoryMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  collectionId: { type: "keyword", index: true },
  collectionDocumentId: { type: "keyword", index: false },
  actorUserId: { type: "keyword", index: false },
  actionType: { type: "keyword", index: true },
  actionType_: { type: "keyword" },
  actionTimestamp: { type: "date", index: true },
  reason: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("collection", collectionMapping);
    await new ElasticIndexer("collection").updateMapping(collectionMapping);
    ElasticIndexer.addMapping("collectionDocument", collectionDocumentMapping);
    await new ElasticIndexer("collectionDocument").updateMapping(
      collectionDocumentMapping,
    );
    ElasticIndexer.addMapping("favorite", favoriteMapping);
    await new ElasticIndexer("favorite").updateMapping(favoriteMapping);
    ElasticIndexer.addMapping("curationHistory", curationHistoryMapping);
    await new ElasticIndexer("curationHistory").updateMapping(
      curationHistoryMapping,
    );
  } catch (err) {
    hexaLogger.insertError(
      "UpdateElasticIndexMappingsError",
      { function: "updateElasticIndexMappings" },
      "elastic-index.js->updateElasticIndexMappings",
      err,
    );
  }
};

module.exports = updateElasticIndexMappings;
