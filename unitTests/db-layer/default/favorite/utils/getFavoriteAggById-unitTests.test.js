const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getFavoriteAggById module", () => {
  let sandbox;
  let getFavoriteAggById;
  let FavoriteStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Favorite" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    FavoriteStub = {
      findByPk: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getFavoriteAggById = proxyquire(
      "../../../../../src/db-layer/main/Favorite/utils/getFavoriteAggById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getFavoriteAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getFavoriteAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(FavoriteStub.findByPk);
      sinon.assert.calledOnce(FavoriteStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getFavoriteAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(FavoriteStub.findAll);
      sinon.assert.calledOnce(FavoriteStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      FavoriteStub.findByPk.resolves(null);
      const result = await getFavoriteAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      FavoriteStub.findAll.resolves([]);
      const result = await getFavoriteAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      FavoriteStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getFavoriteAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      FavoriteStub.findByPk.resolves({ getData: () => undefined });
      const result = await getFavoriteAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findByPk)", async () => {
      FavoriteStub.findByPk.rejects(new Error("fail"));
      try {
        await getFavoriteAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingFavoriteAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      FavoriteStub.findAll.rejects(new Error("all fail"));
      try {
        await getFavoriteAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingFavoriteAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      FavoriteStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getFavoriteAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingFavoriteAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
