const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const CollectionManagementServiceManager = require("../../service-manager/CollectionManagementServiceManager");

/* Base Class For the Crud Routes Of DbObject Favorite */
class FavoriteManager extends CollectionManagementServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "favorite";
    this.modelName = "Favorite";
    this.routeResourcePath = "";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = FavoriteManager;
