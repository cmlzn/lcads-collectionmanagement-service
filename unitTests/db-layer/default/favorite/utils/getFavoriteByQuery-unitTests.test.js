const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getFavoriteByQuery module", () => {
  let sandbox;
  let getFavoriteByQuery;
  let FavoriteStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test Favorite",
    getData: () => ({ id: fakeId, name: "Test Favorite" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    FavoriteStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getFavoriteByQuery = proxyquire(
      "../../../../../src/db-layer/main/Favorite/utils/getFavoriteByQuery",
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
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getFavoriteByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getFavoriteByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test Favorite" });
      sinon.assert.calledOnce(FavoriteStub.findOne);
      sinon.assert.calledWith(FavoriteStub.findOne, { where: { id: fakeId } });
    });

    it("should return null if no record is found", async () => {
      FavoriteStub.findOne.resolves(null);

      const result = await getFavoriteByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(FavoriteStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getFavoriteByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getFavoriteByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      FavoriteStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getFavoriteByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingFavoriteByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      FavoriteStub.findOne.resolves({ getData: () => undefined });

      const result = await getFavoriteByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
