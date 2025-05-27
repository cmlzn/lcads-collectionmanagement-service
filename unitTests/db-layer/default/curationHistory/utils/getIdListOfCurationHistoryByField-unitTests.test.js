const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfCurationHistoryByField module", () => {
  let sandbox;
  let getIdListOfCurationHistoryByField;
  let CurationHistoryStub, hexaLogger;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CurationHistoryStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      collectionId: "example-type",
    };

    hexaLogger = {
      insertError: sandbox.stub(),
    };

    getIdListOfCurationHistoryByField = proxyquire(
      "../../../../../src/db-layer/main/CurationHistory/utils/getIdListOfCurationHistoryByField",
      {
        models: { CurationHistory: CurationHistoryStub },
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

  describe("getIdListOfCurationHistoryByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      CurationHistoryStub["collectionId"] = "string";
      const result = await getIdListOfCurationHistoryByField(
        "collectionId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(CurationHistoryStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      CurationHistoryStub["collectionId"] = "string";
      const result = await getIdListOfCurationHistoryByField(
        "collectionId",
        "val",
        true,
      );
      const call = CurationHistoryStub.findAll.getCall(0);
      expect(call.args[0].where["collectionId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfCurationHistoryByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      CurationHistoryStub["collectionId"] = 123; // expects number

      try {
        await getIdListOfCurationHistoryByField(
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
      CurationHistoryStub.findAll.resolves([]);
      CurationHistoryStub["collectionId"] = "string";

      try {
        await getIdListOfCurationHistoryByField(
          "collectionId",
          "nomatch",
          false,
        );
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "CurationHistory with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      CurationHistoryStub.findAll.rejects(new Error("query failed"));
      CurationHistoryStub["collectionId"] = "string";

      try {
        await getIdListOfCurationHistoryByField("collectionId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });

    it("should log error to hexaLogger if any error occurs", async () => {
      const error = new Error("boom");
      CurationHistoryStub.findAll.rejects(error);
      CurationHistoryStub["collectionId"] = "string";

      try {
        await getIdListOfCurationHistoryByField("collectionId", "test", false);
      } catch (err) {
        sinon.assert.calledOnce(hexaLogger.insertError);
        sinon.assert.calledWithMatch(hexaLogger.insertError, "DatabaseError");
      }
    });
  });
});
