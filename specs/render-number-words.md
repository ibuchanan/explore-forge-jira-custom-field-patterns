# UI Specification: Number in words

## 1. Strategy & Scope

- **User Goal:** Demonstrate numeric Jira field storage with a word-based display.
- **Posture:** Auxiliary.
- **Placement:** Jira custom field, displayed on issue view and portal view.
- **Storage:** A number or `null`; never a formatted string.
- **Supported values:** Whole numbers from -9007199254740991 to 9007199254740991.
- **Manifest keys:** `number-in-words` for the field and `number-words-view`
  for its UI resource. Preserve the existing app ID and runtime.

## 2. Structure & Skeleton

- **Hero Element:** The English words returned by `number-to-words.toWords`.
- **Hierarchy:** One native UI Kit text element; no extra heading or styling.
- **Interaction Flow:** Jira's built-in number editor accepts a number, validates
  it, and saves it. Returning to view mode displays the number in words.
- **Editing:** Remove the template's fruit selector and custom edit resource.
- **Other surfaces:** Jira's native numeric display remains in use where a UI Kit
  field view is unsupported. Numeric search, sorting, API values, and exports
  remain numeric; no global string formatter is introduced.

## 3. The State Matrix

- **Ideal:** `42` displays as "forty-two"; `-42` as "minus forty-two";
  `0` as "zero".
- **Empty:** `null` or an absent value displays as "None"; clearing the editor
  unsets the field rather than saving zero.
- **Loading:** An accessible spinner while product context is unavailable.
- **Error:** Jira validation rejects fractions and out-of-range values. The view
  displays a readable error instead of calling the converter on invalid data.
  Forge handles product-context failures through its host error boundary.

## 4. Edge Cases

- Long word representations wrap naturally without truncation.
- Zero is a value, not an empty state.
- Both safe-integer boundaries are supported; fractions are not rounded.
- Conversion runs locally without backend functions, API calls, new scopes,
  or external permissions.
