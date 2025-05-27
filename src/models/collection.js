const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//A logical grouping of documents curated by either an institution (institutional collection) or a user (personal collection). Supports YAML-like metadata for title, description, type, theme, visibility, tags, and audit. Also supports one or more curators for institutional collections. Supports public/private and curation workflow.
const Collection = sequelize.define(
  "collection",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    title: {
      // Human-friendly title for the collection.
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      // Long-form description about the collection's theme, scope or curation.
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      // Whether this is an institutional (curated) or a user/personal collection.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "institutional",
    },
    themeTags: {
      // Thematic or topical tags for improved discovery, e.g. 'posters', 'WWII', 'local authors'.
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    institution: {
      // Institution associated with this collection (institutional collections only; optional for personal).
      type: DataTypes.STRING,
      allowNull: true,
    },
    visibility: {
      // Determines if collection is public (listed in discovery) or private (only visible to curators/owners).
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "public",
    },
    ownerUserId: {
      // User who owns this collection (for personal collections); null for institutional ones.
      type: DataTypes.UUID,
      allowNull: true,
    },
    curatorUserIds: {
      // Array of user IDs who are recognized as curators/editors (for institutional collection management).
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
    },
    auditNotes: {
      // Notes or internal remarks for audit/compliance regarding this collection.
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
    indexes: [
      {
        unique: false,
        fields: ["title"],
      },
      {
        unique: false,
        fields: ["type"],
      },
      {
        unique: false,
        fields: ["visibility"],
      },
      {
        unique: false,
        fields: ["ownerUserId"],
      },

      {
        unique: true,
        fields: ["ownerUserId", "title"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = Collection;
