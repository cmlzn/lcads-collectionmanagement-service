const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getFavoriteById module", () => {
  let sandbox;
  let getFavoriteById;
  let FavoriteStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Favorite" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    FavoriteStub = {
      findByPk: sandbox.stub().resolves({
        getData: () => fakeData,
      }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
    };

    getFavoriteById = proxyquire(
      "../../../../../src/db-layer/main/Favorite/utils/getFavoriteById",
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

  describe("getFavoriteById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getFavoriteById(fakeId);

      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(FavoriteStub.findByPk);
      sinon.assert.calledWith(FavoriteStub.findByPk, fakeId);
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getFavoriteById(["1", "2"]);

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(FavoriteStub.findAll);
      sinon.assert.calledWithMatch(FavoriteStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      FavoriteStub.findByPk.resolves(null);
      const result = await getFavoriteById(fakeId);

      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      FavoriteStub.findAll.resolves([]);
      const result = await getFavoriteById(["a", "b"]);

      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      FavoriteStub.findByPk.rejects(new Error("DB failure"));

      try {
        await getFavoriteById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingFavoriteById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      FavoriteStub.findAll.rejects(new Error("array failure"));

      try {
        await getFavoriteById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingFavoriteById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      FavoriteStub.findByPk.resolves({ getData: () => undefined });
      const result = await getFavoriteById(fakeId);

      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      FavoriteStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getFavoriteById(["1", "2"]);

      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
