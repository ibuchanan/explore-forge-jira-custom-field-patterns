# Explore Forge Jira Custom Field Patterns

[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

Experimental Atlassian Forge apps demonstrating Jira custom-field patterns
with UI Kit. Each directory under `apps/` is a separate Forge app with its
own manifest, runtime dependencies, and TypeScript configuration. Use an app
in this npm workspace or copy it out as a starting point for your own app.

<!-- cspell:words numericid -->

| App | Pattern |
| --- | --- |
| [render-number-words](apps/render-number-words/README.md) | Store a whole number and display it as English words, such as `42` → `forty-two`. |
| [backend-numericid](apps/backend-numericid/README.md) | Choose a DummyJSON product by title through a backend resolver; store only its numeric ID. |
| [backend-text](apps/backend-text/README.md) | Currently a copy of the local number-to-words example, with no backend resolver or text-valued storage. |

## Prerequisites

- Node.js 24 and npm, matching [`.nvmrc`](.nvmrc).
- The [Forge CLI](https://developer.atlassian.com/platform/forge/getting-started/)
  and an Atlassian account.
- A Jira Cloud development site where you can install apps.

Install the CLI and authenticate with an Atlassian API scoped token:

```sh
npm install --global @forge/cli
forge login
```

## Try an app in this repository

Install dependencies from the repository root, then enter the app directory:

```sh
npm install
cd apps/render-number-words
```

Run the registration, deployment, and installation commands below from this
app directory, not from the repository root.

## Copy an app into its own project

Each app can be copied out; the other apps and root workspace are not needed
at runtime. From a clean source checkout at the repository root, for example:

```sh
cp -R apps/render-number-words ../my-number-words-app
cp LICENSE .npmrc ../my-number-words-app/
cd ../my-number-words-app
npm install
```

Copy the source directory, not any generated `node_modules/`, `dist/`, or
`coverage/` directories. Each app declares its runtime dependencies locally.
Build, test, and size-check tools are shared at the monorepo root; install
the needed development tools in your copy using the
[standalone development instructions](DEVELOPMENT.md#standalone-development).
Your copy will have its own lockfile after `npm install`.

## Register, deploy, and install

From the selected app directory or standalone copy, register your own app
**once**:

```sh
forge register
```

Registration writes a new `app.id` into `manifest.yml`. Do not deploy using
the sample's existing ID. Skip registration if you already registered this
app yourself: registering again creates a new app identity rather than
updating the existing one, with separate environments, storage, and installs.

Deploy the app, then install it on your Jira site. Replace
`example.atlassian.net` with your site hostname:

```sh
forge deploy --environment development
forge install --site example.atlassian.net --product jira --environment development
```

Deployment uploads the app; installation makes it available on that site.
Review any requested permissions before accepting the installation. For
`render-number-words`, a Jira administrator can then create a custom field
using the **Number in words** field type and add it to an issue screen.

For later code changes, rerun `forge deploy --environment development`.
If you change scopes, deploy and then upgrade the existing installation:

```sh
forge install --upgrade --site example.atlassian.net --product jira --environment development
```

See the [Forge CLI reference](https://developer.atlassian.com/platform/forge/cli-reference/)
for more commands.

## Development and contributions

Run `npm run check` from the repository root to verify all apps. See
[DEVELOPMENT.md](DEVELOPMENT.md) for workspace commands and standalone tools,
and [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution process.

## License

Apache 2.0 licensed. See [LICENSE](LICENSE).
