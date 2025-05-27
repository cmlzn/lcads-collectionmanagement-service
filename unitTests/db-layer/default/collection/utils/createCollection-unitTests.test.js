const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createCollection module", () => {
  let sandbox;
  let createCollection;
  let CollectionStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const mockCreatedCollection = {
    getData: () => ({ id: fakeId, ...{ id: "custom-id" } }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CollectionStub = {
      create: sandbox.stub().resolves(mockCreatedCollection),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createCollection = proxyquire(
      "../../../../../src/db-layer/main/Collection/utils/createCollection",
      {
        models: { Collection: CollectionStub },
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

  describe("createCollection", () => {
    it("should create Collection and index to elastic if valid data", async () => {
      const input = { id: "custom-id" };
      const result = await createCollection(input);

      expect(result).to.deep.equal({ id: fakeId, ...{ id: "custom-id" } });
      sinon.assert.calledOnce(CollectionStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);

      sinon.assert.notCalled(newUUIDStub); // id was provided
    });

    it("should throw HttpServerError wrapping BadRequestError if input has unexpected field", async () => {
      const input = { ...{ id: "custom-id" }, foo: "bar" };

      try {
        await createCollection(input);
        throw new Error("Expected to throw HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenCreatingCollection");
        expect(err.details).to.be.instanceOf(Error);
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include('Unexpected field "foo"');
      }
    });

    it("should throw HttpServerError if Collection.create fails", async () => {
      CollectionStub.create.rejects(new Error("DB error"));
      const input = { id: "custom-id" };

      try {
        await createCollection(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenCreatingCollection");
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = { ...{ id: "custom-id" } };
      delete input.id;
      await createCollection(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = { ...{ id: "custom-id" }, id: "existing-id" };
      await createCollection(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        CollectionStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is empty or satisfied", async () => {
      const input = { id: "custom-id" };
      await createCollection(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = { ...{ id: "custom-id" }, id: "custom-id" };
      await createCollection(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        CollectionStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with collection data", async () => {
      const input = { id: "custom-id" };
      await createCollection(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = { id: "custom-id" };

      try {
        await createCollection(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenCreatingCollection");
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
