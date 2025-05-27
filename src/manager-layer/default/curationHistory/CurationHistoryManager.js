const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const CollectionManagementServiceManager = require("../../service-manager/CollectionManagementServiceManager");

/* Base Class For the Crud Routes Of DbObject CurationHistory */
class CurationHistoryManager extends CollectionManagementServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "curationHistory";
    this.modelName = "CurationHistory";
    this.routeResourcePath = "";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = CurationHistoryManager;
