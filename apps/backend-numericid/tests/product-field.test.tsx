import type React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProductEdit, ProductView } from "../src/frontend/product-field";

const { invoke, submit } = vi.hoisted(() => ({
  invoke: vi.fn(),
  submit: vi.fn(),
}));
vi.mock("@forge/bridge", () => ({ invoke, view: { submit } }));
vi.mock("@forge/react", () => ({
  Button: "Button",
  ErrorMessage: "ErrorMessage",
  Label: "Label",
  Select: "Select",
  Spinner: "Spinner",
  Stack: "Stack",
  Text: "Text",
}));
vi.mock("@forge/react/jira", () => ({ CustomFieldEdit: "CustomFieldEdit" }));

let renderer: ReactTestRenderer;
const mount = async (element: React.ReactElement) => {
  await act(async () => {
    renderer = create(element);
  });
};
const element = (name: string) =>
  renderer.root.find((node) => String(node.type) === name);
const choose = async (value: number | null) => {
  await act(async () => {
    element("Select").props["onChange"](
      value === null ? null : { label: `Product ${value}`, value },
    );
  });
};
const save = async () => {
  await act(async () => {
    await element("CustomFieldEdit").props["onSubmit"]();
  });
};

beforeEach(() => {
  invoke.mockReset();
  submit.mockReset().mockResolvedValue(undefined);
});
afterEach(() => {
  act(() => renderer?.unmount());
});

describe("product editor", () => {
  it("preselects the saved ID with searchable labeled options", async () => {
    invoke.mockResolvedValue([
      { id: 7, title: "Same title" },
      { id: 8, title: "Same title" },
    ]);
    await mount(<ProductEdit fieldValue={7} />);
    expect(element("Select").props).toMatchObject({
      value: { label: "Same title (#7)", value: 7 },
      options: [
        { label: "Same title (#7)", value: 7 },
        { label: "Same title (#8)", value: 8 },
      ],
      isSearchable: true,
      isClearable: true,
      inputId: element("Label").props["labelFor"],
    });
    await choose(8);
    await save();
    expect(submit).toHaveBeenCalledWith(8);
    expect(typeof submit.mock.calls[0]?.[0]).toBe("number");
  });

  it("accepts a metadata-wrapped catalog from the bridge", async () => {
    invoke.mockResolvedValue({ body: [{ id: 7, title: "Example" }] });
    await mount(<ProductEdit fieldValue={7} />);
    expect(element("Select").props["value"]).toEqual({
      label: "Example (#7)",
      value: 7,
    });
    await save();
    expect(submit).toHaveBeenCalledWith(7);
  });

  it("clears the field with null", async () => {
    invoke.mockResolvedValue([{ id: 7, title: "Example" }]);
    await mount(<ProductEdit fieldValue={7} />);
    await choose(null);
    await save();
    expect(submit).toHaveBeenCalledWith(null);
  });

  it("does not save or clear while the catalog is loading", async () => {
    invoke.mockReturnValue(new Promise(() => {}));
    await mount(<ProductEdit fieldValue={7} />);
    expect(element("Select").props["isDisabled"]).toBe(true);
    expect(element("Spinner").props["label"]).toBe("Loading products");
    await save();
    expect(submit).not.toHaveBeenCalled();
  });

  it("preserves the saved ID on load failure and permits retry", async () => {
    invoke.mockRejectedValueOnce(new Error("Offline"));
    await mount(<ProductEdit fieldValue={7} />);
    expect(element("ErrorMessage").props["children"]).toContain(
      "Unable to load",
    );
    await save();
    expect(submit).not.toHaveBeenCalled();
    invoke.mockResolvedValueOnce([{ id: 7, title: "Example" }]);
    await act(async () => element("Button").props["onClick"]());
    expect(element("Select").props["value"].value).toBe(7);
    await save();
    expect(submit).toHaveBeenCalledWith(7);
  });

  it("keeps an unavailable saved ID, including when the catalog is empty", async () => {
    invoke.mockResolvedValue([]);
    await mount(<ProductEdit fieldValue={99} />);
    expect(element("Text").props["children"]).toBe("No products available");
    expect(element("Select").props["value"].value).toBe(99);
    await save();
    expect(submit).toHaveBeenCalledWith(99);
  });

  it("shows save errors and retains the selection for another attempt", async () => {
    invoke.mockResolvedValue([{ id: 7, title: "Example" }]);
    submit.mockRejectedValueOnce(new Error("Failed"));
    await mount(<ProductEdit fieldValue={null} />);
    await choose(7);
    await save();
    expect(element("ErrorMessage").props["children"]).toContain(
      "Unable to save",
    );
    expect(element("Select").props["value"].value).toBe(7);
    await save();
    expect(submit).toHaveBeenLastCalledWith(7);
  });

  it("rejects invalid selection IDs instead of submitting them", async () => {
    invoke.mockResolvedValue([]);
    await mount(<ProductEdit fieldValue={null} />);
    await choose(-1);
    await save();
    expect(submit).not.toHaveBeenCalled();
    expect(element("ErrorMessage").props["children"]).toContain(
      "valid product",
    );
  });
});

describe("product read view", () => {
  it("does not fetch for an unset field", async () => {
    await mount(<ProductView fieldValue={null} />);
    expect(element("Text").props["children"]).toBe("None");
    expect(invoke).not.toHaveBeenCalled();
  });

  it("resolves only the saved product and shows its title", async () => {
    invoke.mockResolvedValue({ id: 7, title: "Example" });
    await mount(<ProductView fieldValue={7} />);
    expect(invoke).toHaveBeenCalledExactlyOnceWith("getProduct", { id: 7 });
    expect(element("Text").props["children"]).toBe("Example");
  });

  it("accepts a metadata-wrapped product from the bridge", async () => {
    invoke.mockResolvedValue({ body: { id: 7, title: "Example" } });
    await mount(<ProductView fieldValue={7} />);
    expect(element("Text").props["children"]).toBe("Example");
  });

  it("shows the stored ID when its product has disappeared", async () => {
    invoke.mockResolvedValue(null);
    await mount(<ProductView fieldValue={99} />);
    expect(element("Text").props["children"]).toBe("Product #99");
  });

  it("shows the stored ID and a retry action on load failure", async () => {
    invoke.mockRejectedValueOnce(new Error("Offline"));
    await mount(<ProductView fieldValue={7} />);
    expect(element("Text").props["children"]).toBe("Product #7");
    invoke.mockResolvedValueOnce({ id: 7, title: "Recovered" });
    await act(async () => element("Button").props["onClick"]());
    expect(element("Text").props["children"]).toBe("Recovered");
  });
});
