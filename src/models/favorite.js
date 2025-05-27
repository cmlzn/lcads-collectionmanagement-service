const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Personal favorite shortcut for user to quickly access or recall a document. Each (user, documentMetadataId) pair is unique.
const Favorite = sequelize.define(
  "favorite",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    userId: {
      // User who created this favorite.
      type: DataTypes.UUID,
      allowNull: false,
    },
    documentMetadataId: {
      // The document marked as favorite by the user.
      type: DataTypes.UUID,
      allowNull: false,
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
        fields: ["userId"],
      },
      {
        unique: false,
        fields: ["documentMetadataId"],
      },

      {
        unique: true,
        fields: ["userId", "documentMetadataId"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = Favorite;
