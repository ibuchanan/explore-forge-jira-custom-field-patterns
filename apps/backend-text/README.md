# Backend text

`backend-text` currently demonstrates the same local number-to-words
pattern as [render-number-words](../render-number-words/README.md): store a
number in Jira and display English words such as **forty-two** instead of
`42`. It separates a readable presentation from numeric storage, search,
and sorting.

Despite the directory name, the current implementation has no backend
resolver or text-valued storage. It is an experimental copy of the
number-to-words example, not yet a backend-backed text field.

## In the UI

The app provides a field named **Number in words**, not a separate app page
or issue panel. After installation, a Jira administrator adds the
app-provided field to the relevant issue screens. See the
[root README](../../README.md) for shared setup and installation.

- **Read:** The issue view and Jira Service Management portal view display
  the stored number as English words using native UI Kit text.
- **Edit:** Jira's built-in number editor accepts a number. Save `42`, then
  return to read mode to see **forty-two**.
- **Empty:** An unset or cleared field displays **None**; `0` displays as
  **zero**.

Whole numbers from `-9007199254740991` to `9007199254740991` are supported;
fractions and out-of-range values fail validation. Outside the custom
read view, Jira retains numeric display and data, including API values
and exports.

## Forge modules

The [manifest](manifest.yml) declares one module:

- [`jira:customField`][custom-field], key `number-in-words`: defines the
  number field, its whole-number validation, and a native UI Kit read view
  for `issue-view` and `portal-view`. There is no custom edit resource;
  Jira supplies the number editor.

Conversion runs locally in the frontend with `number-to-words`. No
function module, requested scopes, or external permissions are declared.

## Explore further

- [View entry point](src/frontend/index.tsx) and
  [number formatting](src/frontend/number-words.ts).
- [Behavior tests](tests/number-words.test.ts).
- [Development](../../DEVELOPMENT.md) and
  [contributing](../../CONTRIBUTING.md).

Apache 2.0 licensed. See [LICENSE](../../LICENSE).

[custom-field]: https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-custom-field/
