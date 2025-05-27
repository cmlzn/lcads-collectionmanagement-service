const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Assignment object mapping a document (metadata record) to a collection. Includes notes, document order/prioritization in collection, user assignments, visibility override, and assignment audit.
const CollectionDocument = sequelize.define(
  "collectionDocument",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    collectionId: {
      // The collection to which this document is assigned.
      type: DataTypes.UUID,
      allowNull: false,
    },
    documentMetadataId: {
      // Document metadata record (actual document identity).
      type: DataTypes.UUID,
      allowNull: false,
    },
    assignedByUserId: {
      // User that assigned this document to the collection.
      type: DataTypes.UUID,
      allowNull: false,
    },
    notes: {
      // Optional notes, commentary, or rationale for document assignment/curation.
      type: DataTypes.TEXT,
      allowNull: true,
    },
    orderInCollection: {
      // Ordering or prioritization of the document within the collection (for UI curation or featured lists).
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    isActive: {
      // isActive property will be set to false when deleted
      // so that the document will be archived
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["collectionId"],
      },
      {
        unique: false,
        fields: ["documentMetadataId"],
      },

      {
        unique: true,
        fields: ["collectionId", "documentMetadataId"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = CollectionDocument;
