const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCurationHistoryById module", () => {
  let sandbox;
  let getCurationHistoryById;
  let CurationHistoryStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CurationHistory" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CurationHistoryStub = {
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

    getCurationHistoryById = proxyquire(
      "../../../../../src/db-layer/main/CurationHistory/utils/getCurationHistoryById",
      {
        models: { CurationHistory: CurationHistoryStub },
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

  describe("getCurationHistoryById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getCurationHistoryById(fakeId);

      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CurationHistoryStub.findByPk);
      sinon.assert.calledWith(CurationHistoryStub.findByPk, fakeId);
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getCurationHistoryById(["1", "2"]);

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CurationHistoryStub.findAll);
      sinon.assert.calledWithMatch(CurationHistoryStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      CurationHistoryStub.findByPk.resolves(null);
      const result = await getCurationHistoryById(fakeId);

      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      CurationHistoryStub.findAll.resolves([]);
      const result = await getCurationHistoryById(["a", "b"]);

      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      CurationHistoryStub.findByPk.rejects(new Error("DB failure"));

      try {
        await getCurationHistoryById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCurationHistoryById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      CurationHistoryStub.findAll.rejects(new Error("array failure"));

      try {
        await getCurationHistoryById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCurationHistoryById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      CurationHistoryStub.findByPk.resolves({ getData: () => undefined });
      const result = await getCurationHistoryById(fakeId);

      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      CurationHistoryStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getCurationHistoryById(["1", "2"]);

      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
