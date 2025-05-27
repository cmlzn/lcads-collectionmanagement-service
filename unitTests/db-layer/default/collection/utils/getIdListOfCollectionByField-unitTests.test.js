const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfCollectionByField module", () => {
  let sandbox;
  let getIdListOfCollectionByField;
  let CollectionStub, hexaLogger;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CollectionStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      title: "example-type",
    };

    hexaLogger = {
      insertError: sandbox.stub(),
    };

    getIdListOfCollectionByField = proxyquire(
      "../../../../../src/db-layer/main/Collection/utils/getIdListOfCollectionByField",
      {
        models: { Collection: CollectionStub },
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

  describe("getIdListOfCollectionByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      CollectionStub["title"] = "string";
      const result = await getIdListOfCollectionByField(
        "title",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(CollectionStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      CollectionStub["title"] = "string";
      const result = await getIdListOfCollectionByField("title", "val", true);
      const call = CollectionStub.findAll.getCall(0);
      expect(call.args[0].where["title"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfCollectionByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      CollectionStub["title"] = 123; // expects number

      try {
        await getIdListOfCollectionByField("title", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      CollectionStub.findAll.resolves([]);
      CollectionStub["title"] = "string";

      try {
        await getIdListOfCollectionByField("title", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "Collection with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      CollectionStub.findAll.rejects(new Error("query failed"));
      CollectionStub["title"] = "string";

      try {
        await getIdListOfCollectionByField("title", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });

    it("should log error to hexaLogger if any error occurs", async () => {
      const error = new Error("boom");
      CollectionStub.findAll.rejects(error);
      CollectionStub["title"] = "string";

      try {
        await getIdListOfCollectionByField("title", "test", false);
      } catch (err) {
        sinon.assert.calledOnce(hexaLogger.insertError);
        sinon.assert.calledWithMatch(hexaLogger.insertError, "DatabaseError");
      }
    });
  });
});
