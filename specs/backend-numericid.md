# UI Specification: DummyJSON product selection

Status: Approved for resolver-based implementation.

## 1. Strategy & Scope

- **User Goal:** Select a DummyJSON product for a Jira issue without entering its ID manually.
- **Posture:** Auxiliary.
- **Placement:** The `backend-numericid` Jira custom field. Keep its existing field key and app ID.
- **Storage:** Store only the selected product's numeric ID in the Jira number field. Clearing saves `null`; never save a title, string ID, or product object.
- **Data Access:** The UI invokes a Forge backend resolver that uses the installed `@forge-ahead/dummyjson` client. Declare backend egress to `https://dummyjson.com`; no separate app storage or Jira REST write is needed.
- **Scope:** Change only this sub-app and any dependency/lockfile entries required by it. Do not deploy or install.

## 2. Structure & Skeleton

- **Hero Element:** The product title, rather than its numeric ID.
- **Editing:** A labeled, searchable, single-select UI Kit product picker. Load the complete product list, not just the API's default first page. Preselect the saved numeric ID.
- **Interaction Flow:** Open the editor, choose a product, and confirm through Jira's custom-field editing controls. Submit the selected numeric ID through Forge's custom-field submit API. Allow clearing the selection.
- **Read View:** Resolve the saved ID to its product title. Keep storage, search, sorting, and unsupported native surfaces numeric.
- **Experiences:** Read on issue view and portal view; edit on issue view, issue create, issue transition, and portal request where supported by Forge.
- **Layout:** Native UI Kit components and default styling; no custom CSS, images, or extra product details.

## 3. The State Matrix

- **Ideal:** Product titles populate the picker; choosing a product stores its numeric ID, and read mode displays its title.
- **Empty:** An unset field displays "None". A successful response with no products displays "No products available" and does not overwrite an existing value.
- **Loading:** Show an accessible loading indicator while context or products load; do not allow an unfinished load to clear or save the field.
- **Error:** Show a readable load error with retry. Keep an existing ID intact if loading fails or its product is unavailable, and show `Product #<id>` as a read-view fallback. A failed save leaves the editor open and displays an error.

## 4. Edge Cases

- Submit numbers without string coercion; valid IDs are positive safe integers.
- Preserve a saved ID that no longer appears in the catalog until the user explicitly replaces or clears it.
- Duplicate titles remain distinguishable by including their IDs in picker labels.
- Product titles wrap naturally in read mode; the picker uses native filtering and keyboard interaction.
- Fetch only the saved product in read mode; an empty field needs no product request.
