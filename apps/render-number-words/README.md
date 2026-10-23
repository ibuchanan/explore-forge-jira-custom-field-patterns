# Number in words

`render-number-words` demonstrates a Jira custom field that stores a number
but displays it as English words: `42` becomes **forty-two**. Use this
experimental example when you want a friendlier field display without
changing numeric storage, search, or sorting.

## In the UI

The app provides a field named **Number in words**, not a separate app page
or issue panel. After installation, a Jira administrator adds the
app-provided field to the relevant issue screens. See the
[root README](../../README.md) for shared setup and installation.

- **Read:** The issue view and Jira Service Management portal view display
  English words using native UI Kit text. For example, `0` displays as
  **zero** and `-42` as **minus forty-two**.
- **Edit:** Jira's built-in number editor accepts the numeric value. Save
  `42`, then return to read mode to see **forty-two**.
- **Empty:** An unset or cleared field displays **None**, not zero.

Whole numbers from `-9007199254740991` to `9007199254740991` are supported.
Validation rejects fractions and values outside that range. Surfaces that
cannot render the custom view retain Jira's numeric display; API values
and exports remain numeric.

## Forge modules

The [manifest](manifest.yml) declares one module:

- [`jira:customField`][custom-field], key `number-in-words`: defines the
  number field, its whole-number validation, and a native UI Kit read view
  for `issue-view` and `portal-view`. No custom edit resource is declared,
  so Jira supplies the editor.

The view reads the saved value from Forge product context and converts it
locally with `number-to-words`. There are no backend functions, API calls,
requested scopes, or external permissions.

## Explore further

- [View entry point](src/frontend/index.tsx) and
  [number formatting](src/frontend/number-words.ts).
- [Behavior tests](tests/number-words.test.ts) and
  [UI specification](../../specs/render-number-words.md).
- [Development](../../DEVELOPMENT.md) and
  [contributing](../../CONTRIBUTING.md).

Apache 2.0 licensed. See [LICENSE](../../LICENSE).

[custom-field]: https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-custom-field/
