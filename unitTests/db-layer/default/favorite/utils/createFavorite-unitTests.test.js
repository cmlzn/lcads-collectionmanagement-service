const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createFavorite module", () => {
  let sandbox;
  let createFavorite;
  let FavoriteStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const mockCreatedFavorite = {
    getData: () => ({ id: fakeId, ...{ id: "custom-id" } }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    FavoriteStub = {
      create: sandbox.stub().resolves(mockCreatedFavorite),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createFavorite = proxyquire(
      "../../../../../src/db-layer/main/Favorite/utils/createFavorite",
      {
        models: { Favorite: FavoriteStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
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
          newUUID: newUUIDStub,
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("createFavorite", () => {
    it("should create Favorite and index to elastic if valid data", async () => {
      const input = { id: "custom-id" };
      const result = await createFavorite(input);

      expect(result).to.deep.equal({ id: fakeId, ...{ id: "custom-id" } });
      sinon.assert.calledOnce(FavoriteStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);

      sinon.assert.notCalled(newUUIDStub); // id was provided
    });

    it("should throw HttpServerError wrapping BadRequestError if input has unexpected field", async () => {
      const input = { ...{ id: "custom-id" }, foo: "bar" };

      try {
        await createFavorite(input);
        throw new Error("Expected to throw HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenCreatingFavorite");
        expect(err.details).to.be.instanceOf(Error);
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include('Unexpected field "foo"');
      }
    });

    it("should throw HttpServerError if Favorite.create fails", async () => {
      FavoriteStub.create.rejects(new Error("DB error"));
      const input = { id: "custom-id" };

      try {
        await createFavorite(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenCreatingFavorite");
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = { ...{ id: "custom-id" } };
      delete input.id;
      await createFavorite(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = { ...{ id: "custom-id" }, id: "existing-id" };
      await createFavorite(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        FavoriteStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is empty or satisfied", async () => {
      const input = { id: "custom-id" };
      await createFavorite(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = { ...{ id: "custom-id" }, id: "custom-id" };
      await createFavorite(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        FavoriteStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with favorite data", async () => {
      const input = { id: "custom-id" };
      await createFavorite(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = { id: "custom-id" };

      try {
        await createFavorite(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenCreatingFavorite");
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
