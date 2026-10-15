import { invoke, view } from "@forge/bridge";
import {
  Button,
  ErrorMessage,
  Label,
  Select,
  Spinner,
  Stack,
  Text,
} from "@forge/react";
// Documented Jira component omitted by the prelint allowlist:
// https://developer.atlassian.com/platform/forge/ui-kit/jira-components/custom-field-edit/
// ast-grep-ignore: no-unapproved-forge-react-components-tsx
import { CustomFieldEdit } from "@forge/react/jira";
import { useEffect, useRef, useState } from "react";
import { isProductId, type Product } from "../products";

type FieldProps = { fieldValue: unknown };
type ProductOption = { label: string; value: number };

const LoadError = ({ retry }: { retry: () => void }) => (
  <Stack space="space.100">
    <ErrorMessage>Unable to load products. Please try again.</ErrorMessage>
    <Button onClick={retry}>Retry</Button>
  </Stack>
);

export const ProductView = ({ fieldValue }: FieldProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(isProductId(fieldValue));
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: The retry counter intentionally reruns the request.
  useEffect(() => {
    if (!isProductId(fieldValue)) return;
    let active = true;
    setLoading(true);
    setFailed(false);
    setProduct(null);
    invoke<Product | null>("getProduct", { id: fieldValue })
      .then((value) => {
        if (active) setProduct(value && "body" in value ? value.body : value);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fieldValue, attempt]);

  if (fieldValue == null) return <Text>None</Text>;
  if (loading) return <Spinner label="Loading product" />;
  return (
    <Stack space="space.100">
      <Text>{product?.title ?? `Product #${String(fieldValue)}`}</Text>
      {failed && <LoadError retry={() => setAttempt((value) => value + 1)} />}
    </Stack>
  );
};

export const ProductEdit = ({ fieldValue }: FieldProps) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [selected, setSelected] = useState<ProductOption | null>(
    typeof fieldValue === "number"
      ? { value: fieldValue, label: `Product #${fieldValue} (unavailable)` }
      : null,
  );
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const submitting = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: The retry counter intentionally reruns the request.
  useEffect(() => {
    let active = true;
    setProducts(null);
    setFailed(false);
    invoke<Product[]>("getProducts")
      .then((value) => {
        if (active) setProducts(Array.isArray(value) ? value : value.body);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const options = products?.map(({ id, title }) => ({
    label: `${title} (#${id})`,
    value: id,
  }));
  const selection =
    options?.find((option) => option.value === selected?.value) ?? selected;

  const onSubmit = async () => {
    if (products === null || submitting.current) return;
    const id = selected?.value ?? null;
    if (id !== null && !isProductId(id)) {
      setSaveError("Choose a valid product or clear the field.");
      return;
    }
    submitting.current = true;
    setSaving(true);
    setSaveError("");
    try {
      await view.submit(id);
    } catch {
      setSaveError("Unable to save the product. Please try again.");
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  };

  return (
    <CustomFieldEdit
      onSubmit={onSubmit}
      disableSubmitOnBlur={products === null || saving}
      disableSubmitOnEnter={products === null || saving}
    >
      <Stack space="space.100">
        <Label labelFor="product">Product</Label>
        <Select
          inputId="product"
          options={options ?? []}
          value={selection}
          onChange={(option: ProductOption | null) => {
            setSelected(option);
            setSaveError("");
          }}
          isClearable
          isSearchable
          isDisabled={products === null || saving}
          isLoading={products === null && !failed}
          placeholder="Select a product"
        />
        {products === null && !failed && <Spinner label="Loading products" />}
        {failed && <LoadError retry={() => setAttempt((value) => value + 1)} />}
        {products?.length === 0 && <Text>No products available</Text>}
        {saveError && <ErrorMessage>{saveError}</ErrorMessage>}
      </Stack>
    </CustomFieldEdit>
  );
};
