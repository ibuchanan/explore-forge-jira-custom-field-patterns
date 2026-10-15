// Legacy Node module resolution does not read the package's ./jira export map.
// Reuse the installed types without changing the public runtime import.
declare module "@forge/react/jira" {
  export { CustomFieldEdit } from "@forge/react/out/components/jira";
}
