export type Product = {
  id: number;
  title: string;
};

export const isProductId = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;
