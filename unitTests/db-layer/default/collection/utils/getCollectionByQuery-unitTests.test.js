const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCollectionByQuery module", () => {
  let sandbox;
  let getCollectionByQuery;
  let CollectionStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test Collection",
    getData: () => ({ id: fakeId, name: "Test Collection" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CollectionStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getCollectionByQuery = proxyquire(
      "../../../../../src/db-layer/main/Collection/utils/getCollectionByQuery",
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
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getCollectionByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getCollectionByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test Collection" });
      sinon.assert.calledOnce(CollectionStub.findOne);
      sinon.assert.calledWith(CollectionStub.findOne, {
        where: { id: fakeId },
      });
    });

    it("should return null if no record is found", async () => {
      CollectionStub.findOne.resolves(null);

      const result = await getCollectionByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(CollectionStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCollectionByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCollectionByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      CollectionStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getCollectionByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCollectionByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      CollectionStub.findOne.resolves({ getData: () => undefined });

      const result = await getCollectionByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
