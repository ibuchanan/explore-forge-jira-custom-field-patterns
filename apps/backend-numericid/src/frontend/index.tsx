import ForgeReconciler, { Spinner, useProductContext } from "@forge/react";
import React from "react";
import { ProductEdit, ProductView } from "./product-field";

const App = () => {
  const context = useProductContext();
  if (!context) return <Spinner label="Loading product field" />;
  const fieldValue = context.extension["fieldValue"];
  return context.extension["entryPoint"] === "edit" ? (
    <ProductEdit key={String(fieldValue)} fieldValue={fieldValue} />
  ) : (
    <ProductView key={String(fieldValue)} fieldValue={fieldValue} />
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
