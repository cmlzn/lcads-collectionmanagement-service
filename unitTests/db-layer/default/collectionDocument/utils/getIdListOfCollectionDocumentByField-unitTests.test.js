const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfCollectionDocumentByField module", () => {
  let sandbox;
  let getIdListOfCollectionDocumentByField;
  let CollectionDocumentStub, hexaLogger;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CollectionDocumentStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      collectionId: "example-type",
    };

    hexaLogger = {
      insertError: sandbox.stub(),
    };

    getIdListOfCollectionDocumentByField = proxyquire(
      "../../../../../src/db-layer/main/CollectionDocument/utils/getIdListOfCollectionDocumentByField",
      {
        models: { CollectionDocument: CollectionDocumentStub },
        common: {
          HttpServerError: class HttpServerError extends Error {
            constructor(msg, details) {
              super(msg);
              this.name = "HttpServerError";
              this.details = details;
            }
          },
          BadRequestError: class BadRequestError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "BadRequestError";
            }
          },
          NotFoundError: class NotFoundError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "NotFoundError";
            }
          },
          hexaLogger,
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getIdListOfCollectionDocumentByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      CollectionDocumentStub["collectionId"] = "string";
      const result = await getIdListOfCollectionDocumentByField(
        "collectionId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(CollectionDocumentStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      CollectionDocumentStub["collectionId"] = "string";
      const result = await getIdListOfCollectionDocumentByField(
        "collectionId",
        "val",
        true,
      );
      const call = CollectionDocumentStub.findAll.getCall(0);
      expect(call.args[0].where["collectionId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfCollectionDocumentByField(
          "nonexistentField",
          "x",
          false,
        );
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      CollectionDocumentStub["collectionId"] = 123; // expects number

      try {
        await getIdListOfCollectionDocumentByField(
          "collectionId",
          "wrong-type",
          false,
        );
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      CollectionDocumentStub.findAll.resolves([]);
      CollectionDocumentStub["collectionId"] = "string";

      try {
        await getIdListOfCollectionDocumentByField(
          "collectionId",
          "nomatch",
          false,
        );
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "CollectionDocument with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      CollectionDocumentStub.findAll.rejects(new Error("query failed"));
      CollectionDocumentStub["collectionId"] = "string";

      try {
        await getIdListOfCollectionDocumentByField(
          "collectionId",
          "test",
          false,
        );
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });

    it("should log error to hexaLogger if any error occurs", async () => {
      const error = new Error("boom");
      CollectionDocumentStub.findAll.rejects(error);
      CollectionDocumentStub["collectionId"] = "string";

      try {
        await getIdListOfCollectionDocumentByField(
          "collectionId",
          "test",
          false,
        );
      } catch (err) {
        sinon.assert.calledOnce(hexaLogger.insertError);
        sinon.assert.calledWithMatch(hexaLogger.insertError, "DatabaseError");
      }
    });
  });
});
