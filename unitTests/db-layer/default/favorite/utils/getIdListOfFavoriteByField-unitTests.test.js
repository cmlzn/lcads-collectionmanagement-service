const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfFavoriteByField module", () => {
  let sandbox;
  let getIdListOfFavoriteByField;
  let FavoriteStub, hexaLogger;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    FavoriteStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      userId: "example-type",
    };

    hexaLogger = {
      insertError: sandbox.stub(),
    };

    getIdListOfFavoriteByField = proxyquire(
      "../../../../../src/db-layer/main/Favorite/utils/getIdListOfFavoriteByField",
      {
        models: { Favorite: FavoriteStub },
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

  describe("getIdListOfFavoriteByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      FavoriteStub["userId"] = "string";
      const result = await getIdListOfFavoriteByField(
        "userId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(FavoriteStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      FavoriteStub["userId"] = "string";
      const result = await getIdListOfFavoriteByField("userId", "val", true);
      const call = FavoriteStub.findAll.getCall(0);
      expect(call.args[0].where["userId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfFavoriteByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      FavoriteStub["userId"] = 123; // expects number

      try {
        await getIdListOfFavoriteByField("userId", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      FavoriteStub.findAll.resolves([]);
      FavoriteStub["userId"] = "string";

      try {
        await getIdListOfFavoriteByField("userId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "Favorite with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      FavoriteStub.findAll.rejects(new Error("query failed"));
      FavoriteStub["userId"] = "string";

      try {
        await getIdListOfFavoriteByField("userId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });

    it("should log error to hexaLogger if any error occurs", async () => {
      const error = new Error("boom");
      FavoriteStub.findAll.rejects(error);
      FavoriteStub["userId"] = "string";

      try {
        await getIdListOfFavoriteByField("userId", "test", false);
      } catch (err) {
        sinon.assert.calledOnce(hexaLogger.insertError);
        sinon.assert.calledWithMatch(hexaLogger.insertError, "DatabaseError");
      }
    });
  });
});
