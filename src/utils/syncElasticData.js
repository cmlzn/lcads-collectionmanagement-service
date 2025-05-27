const { getCollectionById } = require("dbLayer");
const { getCollectionDocumentById } = require("dbLayer");
const { getFavoriteById } = require("dbLayer");
const { getCurationHistoryById } = require("dbLayer");
const { Collection } = require("models");
const { CollectionDocument } = require("models");
const { Favorite } = require("models");
const { CurationHistory } = require("models");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");
const { Op } = require("sequelize");

const indexCollectionData = async () => {
  const collectionIndexer = new ElasticIndexer("collection", {
    isSilent: true,
  });
  console.log("Starting to update indexes for Collection");

  const idListData = await Collection.findAll({
    attributes: ["id"],
  });
  const idList = idListData ? idListData.map((item) => item.id) : [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getCollectionById(chunk);
    if (dataList.length) {
      await collectionIndexer.indexBulkData(dataList);
      await collectionIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexCollectionDocumentData = async () => {
  const collectionDocumentIndexer = new ElasticIndexer("collectionDocument", {
    isSilent: true,
  });
  console.log("Starting to update indexes for CollectionDocument");

  const idListData = await CollectionDocument.findAll({
    attributes: ["id"],
  });
  const idList = idListData ? idListData.map((item) => item.id) : [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getCollectionDocumentById(chunk);
    if (dataList.length) {
      await collectionDocumentIndexer.indexBulkData(dataList);
      await collectionDocumentIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexFavoriteData = async () => {
  const favoriteIndexer = new ElasticIndexer("favorite", { isSilent: true });
  console.log("Starting to update indexes for Favorite");

  const idListData = await Favorite.findAll({
    attributes: ["id"],
  });
  const idList = idListData ? idListData.map((item) => item.id) : [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getFavoriteById(chunk);
    if (dataList.length) {
      await favoriteIndexer.indexBulkData(dataList);
      await favoriteIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexCurationHistoryData = async () => {
  const curationHistoryIndexer = new ElasticIndexer("curationHistory", {
    isSilent: true,
  });
  console.log("Starting to update indexes for CurationHistory");

  const idListData = await CurationHistory.findAll({
    attributes: ["id"],
  });
  const idList = idListData ? idListData.map((item) => item.id) : [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getCurationHistoryById(chunk);
    if (dataList.length) {
      await curationHistoryIndexer.indexBulkData(dataList);
      await curationHistoryIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexCollectionData();
    console.log(
      "Collection agregated data is indexed, total collections:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing Collection data",
      err.toString(),
    );
    hexaLogger.insertError(
      "ElasticIndexInitError",
      { function: "indexCollectionData" },
      "syncElasticIndexData.js->indexCollectionData",
      err,
    );
  }

  try {
    const dataCount = await indexCollectionDocumentData();
    console.log(
      "CollectionDocument agregated data is indexed, total collectionDocuments:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing CollectionDocument data",
      err.toString(),
    );
    hexaLogger.insertError(
      "ElasticIndexInitError",
      { function: "indexCollectionDocumentData" },
      "syncElasticIndexData.js->indexCollectionDocumentData",
      err,
    );
  }

  try {
    const dataCount = await indexFavoriteData();
    console.log(
      "Favorite agregated data is indexed, total favorites:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing Favorite data",
      err.toString(),
    );
    hexaLogger.insertError(
      "ElasticIndexInitError",
      { function: "indexFavoriteData" },
      "syncElasticIndexData.js->indexFavoriteData",
      err,
    );
  }

  try {
    const dataCount = await indexCurationHistoryData();
    console.log(
      "CurationHistory agregated data is indexed, total curationHistories:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing CurationHistory data",
      err.toString(),
    );
    hexaLogger.insertError(
      "ElasticIndexInitError",
      { function: "indexCurationHistoryData" },
      "syncElasticIndexData.js->indexCurationHistoryData",
      err,
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;
