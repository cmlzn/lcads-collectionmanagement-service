const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const CollectionManagementServiceManager = require("../../service-manager/CollectionManagementServiceManager");

/* Base Class For the Crud Routes Of DbObject CollectionDocument */
class CollectionDocumentManager extends CollectionManagementServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "collectionDocument";
    this.modelName = "CollectionDocument";
    this.routeResourcePath = "";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = CollectionDocumentManager;
