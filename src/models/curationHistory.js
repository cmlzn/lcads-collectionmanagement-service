const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Audit log of curation/review actions taken on institutional collections or document assignments. Stores action, actor, reason, before/after state, and timestamp.
const CurationHistory = sequelize.define(
  "curationHistory",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    collectionId: {
      // Collection affected by this curation event.
      type: DataTypes.UUID,
      allowNull: false,
    },
    collectionDocumentId: {
      // Assignment affected by this event (document/collection link).
      type: DataTypes.UUID,
      allowNull: true,
    },
    actorUserId: {
      // User or librarian who performed this curation action.
      type: DataTypes.UUID,
      allowNull: false,
    },
    actionType: {
      // The nature/type of curation event: addDocument, removeDocument, createCollection, updateCollection, deleteCollection, changeVisibility, reorderDocument, editMetadata.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "addDocument",
    },
    actionTimestamp: {
      // When this curation action was logged.
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      // Description, rationale, or comment on why this action occurred (optional).
      type: DataTypes.TEXT,
      allowNull: true,
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
    indexes: [],
  },
);

module.exports = CurationHistory;
