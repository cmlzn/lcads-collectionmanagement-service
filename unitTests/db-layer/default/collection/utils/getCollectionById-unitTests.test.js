const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCollectionById module", () => {
  let sandbox;
  let getCollectionById;
  let CollectionStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Collection" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CollectionStub = {
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

    getCollectionById = proxyquire(
      "../../../../../src/db-layer/main/Collection/utils/getCollectionById",
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

  describe("getCollectionById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getCollectionById(fakeId);

      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CollectionStub.findByPk);
      sinon.assert.calledWith(CollectionStub.findByPk, fakeId);
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getCollectionById(["1", "2"]);

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CollectionStub.findAll);
      sinon.assert.calledWithMatch(CollectionStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      CollectionStub.findByPk.resolves(null);
      const result = await getCollectionById(fakeId);

      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      CollectionStub.findAll.resolves([]);
      const result = await getCollectionById(["a", "b"]);

      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      CollectionStub.findByPk.rejects(new Error("DB failure"));

      try {
        await getCollectionById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCollectionById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      CollectionStub.findAll.rejects(new Error("array failure"));

      try {
        await getCollectionById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCollectionById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      CollectionStub.findByPk.resolves({ getData: () => undefined });
      const result = await getCollectionById(fakeId);

      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      CollectionStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getCollectionById(["1", "2"]);

      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
