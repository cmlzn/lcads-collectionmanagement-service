const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCollectionDocumentAggById module", () => {
  let sandbox;
  let getCollectionDocumentAggById;
  let CollectionDocumentStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CollectionDocument" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CollectionDocumentStub = {
      findByPk: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getCollectionDocumentAggById = proxyquire(
      "../../../../../src/db-layer/main/CollectionDocument/utils/getCollectionDocumentAggById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getCollectionDocumentAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getCollectionDocumentAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CollectionDocumentStub.findByPk);
      sinon.assert.calledOnce(CollectionDocumentStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getCollectionDocumentAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CollectionDocumentStub.findAll);
      sinon.assert.calledOnce(CollectionDocumentStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      CollectionDocumentStub.findByPk.resolves(null);
      const result = await getCollectionDocumentAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      CollectionDocumentStub.findAll.resolves([]);
      const result = await getCollectionDocumentAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      CollectionDocumentStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCollectionDocumentAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      CollectionDocumentStub.findByPk.resolves({ getData: () => undefined });
      const result = await getCollectionDocumentAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findByPk)", async () => {
      CollectionDocumentStub.findByPk.rejects(new Error("fail"));
      try {
        await getCollectionDocumentAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCollectionDocumentAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      CollectionDocumentStub.findAll.rejects(new Error("all fail"));
      try {
        await getCollectionDocumentAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCollectionDocumentAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      CollectionDocumentStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getCollectionDocumentAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCollectionDocumentAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
