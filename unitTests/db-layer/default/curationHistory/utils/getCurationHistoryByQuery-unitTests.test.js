const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCurationHistoryByQuery module", () => {
  let sandbox;
  let getCurationHistoryByQuery;
  let CurationHistoryStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test CurationHistory",
    getData: () => ({ id: fakeId, name: "Test CurationHistory" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CurationHistoryStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getCurationHistoryByQuery = proxyquire(
      "../../../../../src/db-layer/main/CurationHistory/utils/getCurationHistoryByQuery",
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

  describe("getCurationHistoryByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getCurationHistoryByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test CurationHistory",
      });
      sinon.assert.calledOnce(CurationHistoryStub.findOne);
      sinon.assert.calledWith(CurationHistoryStub.findOne, {
        where: { id: fakeId },
      });
    });

    it("should return null if no record is found", async () => {
      CurationHistoryStub.findOne.resolves(null);

      const result = await getCurationHistoryByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(CurationHistoryStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCurationHistoryByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCurationHistoryByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      CurationHistoryStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getCurationHistoryByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCurationHistoryByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      CurationHistoryStub.findOne.resolves({ getData: () => undefined });

      const result = await getCurationHistoryByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
