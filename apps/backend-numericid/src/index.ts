import Resolver from "@forge/resolver";
import { createDummyJSONClient } from "@forge-ahead/dummyjson";
import { isProductId, type Product } from "./products";

const client = createDummyJSONClient();
const resolver = new Resolver();

const productSummary = (value: unknown): Product => {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    !isProductId(value.id) ||
    !("title" in value) ||
    typeof value.title !== "string" ||
    !value.title.trim()
  ) {
    throw new Error("DummyJSON returned an invalid product.");
  }
  return { id: value.id, title: value.title };
};

resolver.define("getProducts", async () => {
  const result = await client.GET("/products", {
    params: { query: { limit: 0, select: "id,title" } },
  });
  if (result.isErr())
    throw new Error("Unable to load products from DummyJSON.");
  if (!Array.isArray(result.value.products)) {
    throw new Error("DummyJSON returned an invalid product list.");
  }
  return result.value.products.map(productSummary);
});

resolver.define<{ id?: unknown }, Product | null>(
  "getProduct",
  async ({ payload }) => {
    const id = payload?.id;
    if (!isProductId(id)) {
      throw new Error("A positive numeric product ID is required.");
    }
    const result = await client.GET("/products/{id}", {
      params: { path: { id }, query: { select: "id,title" } },
    });
    if (result.isErr()) {
      if (result.error.status === 404) return null;
      throw new Error("Unable to load the product from DummyJSON.");
    }
    const product = productSummary(result.value);
    if (product.id !== id) {
      throw new Error("DummyJSON returned a different product.");
    }
    return product;
  },
);

export const handler = resolver.getDefinitions();
