const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCurationHistoryAggById module", () => {
  let sandbox;
  let getCurationHistoryAggById;
  let CurationHistoryStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CurationHistory" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CurationHistoryStub = {
      findByPk: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getCurationHistoryAggById = proxyquire(
      "../../../../../src/db-layer/main/CurationHistory/utils/getCurationHistoryAggById",
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

  describe("getCurationHistoryAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getCurationHistoryAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CurationHistoryStub.findByPk);
      sinon.assert.calledOnce(CurationHistoryStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getCurationHistoryAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CurationHistoryStub.findAll);
      sinon.assert.calledOnce(CurationHistoryStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      CurationHistoryStub.findByPk.resolves(null);
      const result = await getCurationHistoryAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      CurationHistoryStub.findAll.resolves([]);
      const result = await getCurationHistoryAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      CurationHistoryStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCurationHistoryAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      CurationHistoryStub.findByPk.resolves({ getData: () => undefined });
      const result = await getCurationHistoryAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findByPk)", async () => {
      CurationHistoryStub.findByPk.rejects(new Error("fail"));
      try {
        await getCurationHistoryAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCurationHistoryAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      CurationHistoryStub.findAll.rejects(new Error("all fail"));
      try {
        await getCurationHistoryAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCurationHistoryAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      CurationHistoryStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getCurationHistoryAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCurationHistoryAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
