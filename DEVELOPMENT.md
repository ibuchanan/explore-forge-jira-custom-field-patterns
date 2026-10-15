# Development

Install dependencies with `npm install` from the repository root. Run the
checks before sending a pull request:

```sh
npm run check
npm run lint:docs
```

To build all apps, run `npm run build`. To target one app, select its
workspace:

```sh
npm run build --workspace render-number-words
npm run lint --workspace render-number-words
```

Run shared formatting, linting, and tests from the repository root. To run
only one app's tests:

```sh
npm test --workspace render-number-words
```

Run Forge CLI commands directly from the app directory containing
`manifest.yml`. See the [README](README.md#register-deploy-and-install) for
registration, deployment, and installation.

## Standalone development

A copied app includes its source, tests, manifest, runtime dependencies, and
local TypeScript configuration. Repository-wide tooling is not copied with
it. After copying `render-number-words`, install these tools in the copy to
use its build, typecheck, and size-check scripts and run its tests:

```sh
npm install --save-dev \
  typescript@^5.9.3 @types/node@24 \
  @types/react@^18.3.31 @types/number-to-words@^1.2 \
  vitest@^5.0.4 size-limit@14.2.0 @size-limit/file@14.2.0
npm run build
npm run typecheck
npm run size:check
npm test
forge lint
```

Keep TypeScript on version 5 for Forge bundler compatibility. Check each
app's imports and scripts when copying a different app; its development
tools may differ. Shared formatting, documentation linting, and Git hooks
belong to this repository and are optional for an independent copy.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution process.
