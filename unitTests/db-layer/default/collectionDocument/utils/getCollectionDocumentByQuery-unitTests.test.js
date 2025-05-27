const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCollectionDocumentByQuery module", () => {
  let sandbox;
  let getCollectionDocumentByQuery;
  let CollectionDocumentStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test CollectionDocument",
    getData: () => ({ id: fakeId, name: "Test CollectionDocument" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CollectionDocumentStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getCollectionDocumentByQuery = proxyquire(
      "../../../../../src/db-layer/main/CollectionDocument/utils/getCollectionDocumentByQuery",
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
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getCollectionDocumentByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getCollectionDocumentByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test CollectionDocument",
      });
      sinon.assert.calledOnce(CollectionDocumentStub.findOne);
      sinon.assert.calledWith(CollectionDocumentStub.findOne, {
        where: { id: fakeId },
      });
    });

    it("should return null if no record is found", async () => {
      CollectionDocumentStub.findOne.resolves(null);

      const result = await getCollectionDocumentByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(CollectionDocumentStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCollectionDocumentByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCollectionDocumentByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      CollectionDocumentStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getCollectionDocumentByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCollectionDocumentByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      CollectionDocumentStub.findOne.resolves({ getData: () => undefined });

      const result = await getCollectionDocumentByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
