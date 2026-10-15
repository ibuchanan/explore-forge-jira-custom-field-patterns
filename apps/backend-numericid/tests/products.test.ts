import { beforeEach, describe, expect, it, vi } from "vitest";
import { handler } from "../src/index";

const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("@forge-ahead/dummyjson", () => ({
  createDummyJSONClient: () => ({ GET: get }),
}));

const call = (functionKey: string, payload: unknown = {}) =>
  handler({ call: { functionKey, payload }, context: {} });
const success = (value: unknown) => ({ isErr: () => false, value });
const failure = (status: number) => ({
  isErr: () => true,
  error: { status },
});

beforeEach(() => get.mockReset());

describe("product resolver", () => {
  it("loads all products and returns only numeric IDs and titles", async () => {
    get.mockResolvedValue(
      success({ products: [{ id: 7, title: "Example", price: 12 }] }),
    );
    await expect(call("getProducts")).resolves.toEqual([
      { id: 7, title: "Example" },
    ]);
    expect(get).toHaveBeenCalledWith("/products", {
      params: { query: { limit: 0, select: "id,title" } },
    });
  });

  it("supports an empty catalog", async () => {
    get.mockResolvedValue(success({ products: [] }));
    await expect(call("getProducts")).resolves.toEqual([]);
  });

  it.each(["7", 0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1, null])(
    "rejects an invalid requested ID: %s",
    async (id) => {
      await expect(call("getProduct", { id })).rejects.toThrow(
        "positive numeric product ID",
      );
      expect(get).not.toHaveBeenCalled();
    },
  );

  it("fetches one saved product without loading the catalog", async () => {
    get.mockResolvedValue(success({ id: 7, title: "Example" }));
    await expect(call("getProduct", { id: 7 })).resolves.toEqual({
      id: 7,
      title: "Example",
    });
    expect(get).toHaveBeenCalledWith("/products/{id}", {
      params: { path: { id: 7 }, query: { select: "id,title" } },
    });
  });

  it("returns null for a removed product", async () => {
    get.mockResolvedValue(failure(404));
    await expect(call("getProduct", { id: 7 })).resolves.toBeNull();
  });

  it.each(["getProducts", "getProduct"])(
    "reports API errors from %s",
    async (functionKey) => {
      get.mockResolvedValue(failure(503));
      await expect(call(functionKey, { id: 7 })).rejects.toThrow(
        "Unable to load",
      );
    },
  );

  it.each([
    { id: "7", title: "Example" },
    { id: 0, title: "Example" },
    { id: 7, title: " " },
    { id: 7 },
    null,
  ])("rejects a malformed product: %j", async (product) => {
    get.mockResolvedValue(success({ products: [product] }));
    await expect(call("getProducts")).rejects.toThrow("invalid product");
  });

  it("rejects malformed lists rather than presenting an empty catalog", async () => {
    get.mockResolvedValue(success({ products: null }));
    await expect(call("getProducts")).rejects.toThrow("invalid product list");
  });

  it("rejects a response for a different saved ID", async () => {
    get.mockResolvedValue(success({ id: 8, title: "Other product" }));
    await expect(call("getProduct", { id: 7 })).rejects.toThrow(
      "different product",
    );
  });
});
