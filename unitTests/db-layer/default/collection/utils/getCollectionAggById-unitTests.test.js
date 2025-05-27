const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCollectionAggById module", () => {
  let sandbox;
  let getCollectionAggById;
  let CollectionStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Collection" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CollectionStub = {
      findByPk: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getCollectionAggById = proxyquire(
      "../../../../../src/db-layer/main/Collection/utils/getCollectionAggById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getCollectionAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getCollectionAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CollectionStub.findByPk);
      sinon.assert.calledOnce(CollectionStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getCollectionAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CollectionStub.findAll);
      sinon.assert.calledOnce(CollectionStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      CollectionStub.findByPk.resolves(null);
      const result = await getCollectionAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      CollectionStub.findAll.resolves([]);
      const result = await getCollectionAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      CollectionStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCollectionAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      CollectionStub.findByPk.resolves({ getData: () => undefined });
      const result = await getCollectionAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findByPk)", async () => {
      CollectionStub.findByPk.rejects(new Error("fail"));
      try {
        await getCollectionAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCollectionAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      CollectionStub.findAll.rejects(new Error("all fail"));
      try {
        await getCollectionAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCollectionAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      CollectionStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getCollectionAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCollectionAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
