const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCollectionDocumentById module", () => {
  let sandbox;
  let getCollectionDocumentById;
  let CollectionDocumentStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CollectionDocument" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CollectionDocumentStub = {
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

    getCollectionDocumentById = proxyquire(
      "../../../../../src/db-layer/main/CollectionDocument/utils/getCollectionDocumentById",
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

  describe("getCollectionDocumentById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getCollectionDocumentById(fakeId);

      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CollectionDocumentStub.findByPk);
      sinon.assert.calledWith(CollectionDocumentStub.findByPk, fakeId);
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getCollectionDocumentById(["1", "2"]);

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CollectionDocumentStub.findAll);
      sinon.assert.calledWithMatch(CollectionDocumentStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      CollectionDocumentStub.findByPk.resolves(null);
      const result = await getCollectionDocumentById(fakeId);

      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      CollectionDocumentStub.findAll.resolves([]);
      const result = await getCollectionDocumentById(["a", "b"]);

      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      CollectionDocumentStub.findByPk.rejects(new Error("DB failure"));

      try {
        await getCollectionDocumentById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCollectionDocumentById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      CollectionDocumentStub.findAll.rejects(new Error("array failure"));

      try {
        await getCollectionDocumentById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCollectionDocumentById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      CollectionDocumentStub.findByPk.resolves({ getData: () => undefined });
      const result = await getCollectionDocumentById(fakeId);

      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      CollectionDocumentStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getCollectionDocumentById(["1", "2"]);

      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
