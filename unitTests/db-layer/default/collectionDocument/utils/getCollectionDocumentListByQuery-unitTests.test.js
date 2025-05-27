const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCollectionDocumentListByQuery module", () => {
  let sandbox;
  let getCollectionDocumentListByQuery;
  let CollectionDocumentStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CollectionDocumentStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getCollectionDocumentListByQuery = proxyquire(
      "../../../../../src/db-layer/main/CollectionDocument/utils/getCollectionDocumentListByQuery",
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

  describe("getCollectionDocumentListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getCollectionDocumentListByQuery({ isActive: true });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(CollectionDocumentStub.findAll);
      sinon.assert.calledWithMatch(CollectionDocumentStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      CollectionDocumentStub.findAll.resolves(null);

      const result = await getCollectionDocumentListByQuery({ active: false });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      CollectionDocumentStub.findAll.resolves([]);

      const result = await getCollectionDocumentListByQuery({
        clientId: "xyz",
      });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      CollectionDocumentStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getCollectionDocumentListByQuery({ active: true });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCollectionDocumentListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCollectionDocumentListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      CollectionDocumentStub.findAll.rejects(new Error("findAll failed"));

      try {
        await getCollectionDocumentListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCollectionDocumentListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
