# Product picker with numeric storage

<!-- cspell:words numericid dummyjson -->

`backend-numericid` lets users choose a [DummyJSON](https://dummyjson.com/)
product by title while storing only its numeric ID in a Jira custom field.
This experimental example solves the mismatch between a human-friendly
picker and an external system's identifier: users do not need to remember
IDs, and Jira retains numeric values for search, sorting, and API access.

## In the UI

The app provides a field named **Product**, not a separate app page or
issue panel. After installation, a Jira administrator adds the
app-provided field to the relevant issue screens and, for portal use, the
request configuration. See the [root README](../../README.md) for shared
setup and installation.

- **Read:** The issue view and Jira Service Management portal view resolve
  the saved ID to a product title. An unset field displays **None**.
- **Edit:** A searchable, clearable, single-select picker lists products as
  `Title (#ID)`, so duplicate titles remain distinguishable. The saved
  product is preselected. Choose a product and confirm through Jira's
  field-editing controls; clearing the picker saves `null`.
- **Placement:** Custom editing is declared for issue view (inline), issue
  creation, issue transitions, and portal requests where Forge supports
  those experiences and the field is configured to appear.

Only the numeric ID is saved, never a title or product object. The read
view fetches the selected product; the editor loads the full catalog.
Where the custom UI is not supported, Jira retains the numeric display.

If a product disappears, the read view falls back to `Product #<id>`.
Load failures show a retry action without overwriting the saved ID;
loading disables the picker, and save failures retain the selection for
another attempt. IDs must be positive safe integers, up to
`9007199254740991`.

## Forge modules

The [manifest](manifest.yml) declares two module types:

- [`jira:customField`][custom-field], key `number-in-words`: defines the
  **Product** number field, ID validation, and native UI Kit read and edit
  experiences. The key is retained from the number-to-words example;
  the field now selects products.
- [`function`][function], key `products`, handler `index.handler`: hosts
  the [Forge resolver][resolver]. Its `getProducts` and `getProduct`
  operations retrieve product IDs and titles from DummyJSON through
  `@forge-ahead/dummyjson`.

The UI calls the resolver through Forge Bridge and saves the selected ID
with `view.submit`, using the [CustomFieldEdit][custom-field-edit]
component. Backend fetch permission is declared for
`https://dummyjson.com`; no Jira API scopes or separate app storage are
used. Product labels depend on that external demo service being available.

## Explore further

- [Field UI](src/frontend/product-field.tsx) and
  [backend resolver](src/index.ts).
- [UI tests](tests/product-field.test.tsx),
  [resolver tests](tests/products.test.ts), and
  [UI specification](../../specs/backend-numericid.md).
- [Development](../../DEVELOPMENT.md) and
  [contributing](../../CONTRIBUTING.md).

Apache 2.0 licensed. See [LICENSE](../../LICENSE).

[custom-field]: https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-custom-field/
[function]: https://developer.atlassian.com/platform/forge/manifest-reference/modules/function/
[resolver]: https://developer.atlassian.com/platform/forge/runtime-reference/forge-resolver/
[custom-field-edit]: https://developer.atlassian.com/platform/forge/ui-kit/jira-components/custom-field-edit/
