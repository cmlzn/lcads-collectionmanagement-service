const { DataTypes } = require("sequelize");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");
const { hexaLogger } = require("common");

const Collection = require("./collection");
const CollectionDocument = require("./collectionDocument");
const Favorite = require("./favorite");
const CurationHistory = require("./curationHistory");

Collection.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const typeOptions = ["institutional", "personal"];
  const dataTypetypeCollection = typeof data.type;
  const enumIndextypeCollection =
    dataTypetypeCollection === "string"
      ? typeOptions.indexOf(data.type)
      : data.type;
  data.type_idx = enumIndextypeCollection;
  data.type =
    enumIndextypeCollection > -1
      ? typeOptions[enumIndextypeCollection]
      : undefined;
  // set enum Index and enum value
  const visibilityOptions = ["private", "public"];
  const dataTypevisibilityCollection = typeof data.visibility;
  const enumIndexvisibilityCollection =
    dataTypevisibilityCollection === "string"
      ? visibilityOptions.indexOf(data.visibility)
      : data.visibility;
  data.visibility_idx = enumIndexvisibilityCollection;
  data.visibility =
    enumIndexvisibilityCollection > -1
      ? visibilityOptions[enumIndexvisibilityCollection]
      : undefined;

  data._owner = data.ownerUserId ?? undefined;
  return data;
};

CollectionDocument.prototype.getData = function () {
  const data = this.dataValues;

  data.collection = this.collection ? this.collection.getData() : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  return data;
};

CollectionDocument.belongsTo(Collection, {
  as: "collection",
  foreignKey: "collectionId",
  targetKey: "id",
  constraints: false,
});

Favorite.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  data._owner = data.userId ?? undefined;
  return data;
};

CurationHistory.prototype.getData = function () {
  const data = this.dataValues;

  data.collection = this.collection ? this.collection.getData() : undefined;
  data.collectionDocument = this.collectionDocument
    ? this.collectionDocument.getData()
    : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const actionTypeOptions = [
    "addDocument",
    "removeDocument",
    "createCollection",
    "updateCollection",
    "deleteCollection",
    "changeVisibility",
    "reorderDocument",
    "editMetadata",
  ];
  const dataTypeactionTypeCurationHistory = typeof data.actionType;
  const enumIndexactionTypeCurationHistory =
    dataTypeactionTypeCurationHistory === "string"
      ? actionTypeOptions.indexOf(data.actionType)
      : data.actionType;
  data.actionType_idx = enumIndexactionTypeCurationHistory;
  data.actionType =
    enumIndexactionTypeCurationHistory > -1
      ? actionTypeOptions[enumIndexactionTypeCurationHistory]
      : undefined;

  return data;
};

CurationHistory.belongsTo(Collection, {
  as: "collection",
  foreignKey: "collectionId",
  targetKey: "id",
  constraints: false,
});

CurationHistory.belongsTo(CollectionDocument, {
  as: "collectionDocument",
  foreignKey: "collectionDocumentId",
  targetKey: "id",
  constraints: false,
});

module.exports = {
  Collection,
  CollectionDocument,
  Favorite,
  CurationHistory,
  updateElasticIndexMappings,
};
