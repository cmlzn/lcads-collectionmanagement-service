const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("updateCollectionDocumentByQuery module", () => {
  let sandbox;
  let updateCollectionDocumentByQuery;
  let CollectionDocumentStub;

  const fakeQuery = { clientId: "abc123" };
  const fakeDataClause = { status: "archived" };
  const fakeUpdatedRows = [
    { getData: () => ({ id: "1", status: "archived" }) },
    { getData: () => ({ id: "2", status: "archived" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CollectionDocumentStub = {
      update: sandbox.stub().resolves([2, fakeUpdatedRows]),
    };

    updateCollectionDocumentByQuery = proxyquire(
      "../../../../../src/db-layer/main/CollectionDocument/utils/updateCollectionDocumentByQuery",
      {
        models: { CollectionDocument: CollectionDocumentStub },
        common: {
          HttpServerError: class HttpServerError extends Error {
            constructor(message, details) {
              super(message);
              this.name = "HttpServerError";
              this.details = details;
            }
          },
          BadRequestError: class BadRequestError extends Error {
            constructor(message) {
              super(message);
              this.name = "BadRequestError";
            }
          },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("updateCollectionDocumentByQuery", () => {
    it("should update records matching query and return getData list", async () => {
      const result = await updateCollectionDocumentByQuery(
        fakeDataClause,
        fakeQuery,
      );
      expect(result).to.deep.equal([
        { id: "1", status: "archived" },
        { id: "2", status: "archived" },
      ]);

      sinon.assert.calledOnceWithExactly(
        CollectionDocumentStub.update,
        fakeDataClause,
        {
          where: { query: fakeQuery, isActive: true },
          returning: true,
        },
      );
    });

    it("should return [] if update returns no matching rows", async () => {
      CollectionDocumentStub.update.resolves([0, []]);

      const result = await updateCollectionDocumentByQuery(
        fakeDataClause,
        fakeQuery,
      );
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      CollectionDocumentStub.update.resolves([
        2,
        [{ getData: () => undefined }, { getData: () => undefined }],
      ]);

      const result = await updateCollectionDocumentByQuery(
        fakeDataClause,
        fakeQuery,
      );
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await updateCollectionDocumentByQuery(fakeDataClause, undefined);
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await updateCollectionDocumentByQuery(fakeDataClause, "not-an-object");
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if model update fails", async () => {
      CollectionDocumentStub.update.rejects(new Error("update failed"));

      try {
        await updateCollectionDocumentByQuery(fakeDataClause, fakeQuery);
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenUpdatingCollectionDocumentByQuery",
        );
        expect(err.details.message).to.equal("update failed");
      }
    });

    it("should accept empty dataClause and still process", async () => {
      CollectionDocumentStub.update.resolves([0, []]);

      const result = await updateCollectionDocumentByQuery({}, fakeQuery);
      expect(result).to.deep.equal([]);
    });
  });
});
