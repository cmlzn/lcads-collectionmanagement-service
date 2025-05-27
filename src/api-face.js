const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "lcads - collectionManagement",
    brand: {
      name: "lcads",
      image: "https://mindbricks.com/images/logo-light.svg",
      moduleName: "collectionManagement",
    },
    auth: {
      url: authUrl,
    },
    dataObjects: [
      {
        name: "Collection",
        description:
          "A logical grouping of documents curated by either an institution (institutional collection) or a user (personal collection). Supports YAML-like metadata for title, description, type, theme, visibility, tags, and audit. Also supports one or more curators for institutional collections. Supports public/private and curation workflow.",
        reference: {
          tableName: "collection",
          properties: [
            {
              name: "title",
              type: "String",
            },

            {
              name: "description",
              type: "Text",
            },

            {
              name: "type",
              type: "Enum",
            },

            {
              name: "themeTags",
              type: "[String]",
            },

            {
              name: "institution",
              type: "String",
            },

            {
              name: "visibility",
              type: "Enum",
            },

            {
              name: "ownerUserId",
              type: "ID",
            },

            {
              name: "curatorUserIds",
              type: "[ID]",
            },

            {
              name: "auditNotes",
              type: "Text",
            },
          ],
        },
        endpoints: [],
      },

      {
        name: "CollectionDocument",
        description:
          "Assignment object mapping a document (metadata record) to a collection. Includes notes, document order/prioritization in collection, user assignments, visibility override, and assignment audit.",
        reference: {
          tableName: "collectionDocument",
          properties: [
            {
              name: "collectionId",
              type: "ID",
            },

            {
              name: "documentMetadataId",
              type: "ID",
            },

            {
              name: "assignedByUserId",
              type: "ID",
            },

            {
              name: "notes",
              type: "Text",
            },

            {
              name: "orderInCollection",
              type: "Integer",
            },
          ],
        },
        endpoints: [],
      },

      {
        name: "Favorite",
        description:
          "Personal favorite shortcut for user to quickly access or recall a document. Each (user, documentMetadataId) pair is unique.",
        reference: {
          tableName: "favorite",
          properties: [
            {
              name: "userId",
              type: "ID",
            },

            {
              name: "documentMetadataId",
              type: "ID",
            },
          ],
        },
        endpoints: [],
      },

      {
        name: "CurationHistory",
        description:
          "Audit log of curation/review actions taken on institutional collections or document assignments. Stores action, actor, reason, before/after state, and timestamp.",
        reference: {
          tableName: "curationHistory",
          properties: [
            {
              name: "collectionId",
              type: "ID",
            },

            {
              name: "collectionDocumentId",
              type: "ID",
            },

            {
              name: "actorUserId",
              type: "ID",
            },

            {
              name: "actionType",
              type: "Enum",
            },

            {
              name: "actionTimestamp",
              type: "Date",
            },

            {
              name: "reason",
              type: "Text",
            },
          ],
        },
        endpoints: [],
      },
    ],
  };

  inject(app, config);
};
