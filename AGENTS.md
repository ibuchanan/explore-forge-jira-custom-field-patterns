# Agent guidance

This repository is an Atlassian Forge app. Read `manifest.yml` before
changing modules, functions, scopes, or external permissions. Prefer
Forge's built-in authentication and storage to custom services; check
authorization when using app-level access.

Before submitting changes, run `npm run lint`, `npm run format:check`,
`npm run typecheck`, and `npm run test`. Review scope or egress changes before
deploying; do not deploy or install without approval.
