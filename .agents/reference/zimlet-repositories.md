# Zimlet monorepos

This reference compares the two monorepos that maintain Modern UI Zimlets. It explains
their shared conventions and where their layouts, dependencies, development, and delivery
workflows differ.

For how Zimlets register with the host, see [zimlet-registration-patterns.md](./zimlet-registration-patterns.md).
For the host-side contract, see [zm-x-web's slot behavior](../../../zm-x-web/.agents/zimlet/reference/slot-behavior.md)
and [slot catalog](../../../zm-x-web/.agents/zimlet/context/zimlet-slots.yml).

## Shared conventions

- Both repositories contain Modern UI Zimlets that run in `zm-x-web`.
- Each Zimlet package uses `@zimbra/zimlet-cli ^19.0.0` and Node.js 24.
- Install workspace dependencies from the monorepo root; build and package individual
  Zimlets from their package directories.
- A package's entry point and registration contract follow the guidance in
  [authoring.md](./authoring.md). Use the registration-pattern reference for examples
  drawn from real Zimlets.
- Translation workflows are described in each repository's `AGENTS.md` and
  `.agents/translation/config.yml`.

## At a glance

| | `zm-modern-zimlets` | `zm-cloudsuite-zimlets` |
|---|---|---|
| Purpose | Product-feature Zimlets | Third-party service integrations (cloud storage, video calls, chat) |
| Workspace root | `zimlets/*` | `packages/*` |
| Live packages | 36 Zimlet packages | 7 Zimlets plus the `zimbra-cloud-common` shared library (8 packages total) |
| Lerna | `^4`, independent versions | `^3.22`, independent versions |
| Shared Zimlet library | None | `zimbra-cloud-common` |
| Tests | No root test runner; CI invokes package scripts for changed Zimlets | `zimbra-cloud-common` has Jest tests; Zimlet packages have no tests |
| Notable delivery difference | OS-package allow-list and per-OS packages | Shared root webpack hooks and tagged integration publishing |

## `zm-modern-zimlets`

Repository guide: [`zm-modern-zimlets/.agents/reference/zimlet-repo.md`](../../../zm-modern-zimlets/.agents/reference/zimlet-repo.md).

### Layout and tooling

- npm workspaces and Lerna `^4` (`"version": "independent"`) manage packages under
  `zimlets/*`. There are 36 tracked Zimlet packages. `archived/` contains retired,
  non-workspace projects: briefcase-edit-lool, duplicate-contacts, holiday-calendar,
  outlook-connector, restore-contacts, send-header, and smx.
- Each package uses `@zimbra/zimlet-cli ^19.0.0` as its only build dependency. There is
  no shared library package.
- The repository requires Node `^24.18.0` and npm `^11.12.1`.
- Root `AGENTS.md` covers the repository's translation workflow.
- Root lint uses `eslint.config.mjs` and `eslint.override.mjs`. There is no root test
  runner; `scripts/find-changes-and-test.sh` runs per-package scripts for changed
  Zimlets in CI.
- Only `zimbra-zimlet-user-sessions-management` currently has a custom
  `zimlet.config.js`.

### Typical package and commands

```text
zimlets/zimbra-zimlet-<feature>/
  package.json  LICENSE  README.md
  src/index.js  src/components/  src/hooks/  src/intl/  src/enhancers.js
  scripts/postinst.sh        # for OS-package deployment
  config_template.xml        # optional administrator settings
```

Install dependencies at the repository root. To watch one package, run
`npx lerna run start --scope '*personal-notes'` there. Run `npm run build` and then
`npm run package` inside a Zimlet package to build and create its zip.

The [personal-notes Zimlet](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-personal-notes/src/index.js)
is a small reference implementation. The root README's manual-release example is stale:
it says `packages/zimbra-zimlet-sideloader`, but the package is under `zimlets/`.

### Delivery

CI detects changed Zimlets, runs lint, audit, build and package steps, and collects
per-OS packages. It publishes RPMs (r7/r8/r9) and DEBs to Nexus on demand with approval,
and also uploads a zip to an object-store bucket. OS-package Zimlets need
`scripts/postinst.sh` and must be added to both `scripts/make-zimbra9-packages.sh` and
`scripts/gather-packages-zimbra9.sh`. Packages not on the allow-list are built only as
zips. Releases use `npx lerna version --no-push`; then
`scripts/update-xml-version.mjs` aligns the XML descriptor version. The CI
configuration is more current than the README's older release instructions.

## `zm-cloudsuite-zimlets`

Repository guide: [`zm-cloudsuite-zimlets/.agents/reference/zimlet-repo.md`](../../../zm-cloudsuite-zimlets/.agents/reference/zimlet-repo.md).

### Layout and shared package

- npm workspaces and Lerna `^3.22` (`"version": "independent"`) manage packages under
  `packages/*` (not `zimlets/*`). The seven live Zimlets are Dropbox, Google Drive,
  Jitsi, OneDrive, Slack, Video Call Preferences, and Zoom. The eighth live package is
  the shared `zimbra-cloud-common` library. Archived packages (admin-dashboard,
  collaboration-list, direct-to-consumer-billing, email-safety, migration, skype, and
  trial-countdown) are not built or shipped.
- `zimbra-cloud-common` provides shared integration components, utilities,
  internationalization, and enhancers. Zimlet packages import its source through
  workspace links, so install dependencies from the monorepo root.
- CI uses Node `24.18`; the Zimlet packages use `@zimbra/zimlet-cli ^19.0.0`.
- Root `AGENTS.md` covers the repository's translation workflow.
- Jest tests are limited to `zimbra-cloud-common`, using the Enzyme Preact adapter.
  The Zimlet packages have no tests.

### Configuration and build

Provider settings come from the Zimbra deployment, not from credentials embedded in a
Zimlet bundle. `zimbra-cloud-common` provides `getZimletConfig` for server-supplied
`zimletConfig` properties. OAuth integrations use
[`zm-x-oauth-client`](../../../zm-x-oauth-client), currently consumed at tag `2.0.0`.
It provides `OAuthClient`, `AuthorizeRoute`, `oauthRouter`, and
`AuthorizeWindowOpener`; the server OAuth extension is separate.

The root `zimlet.config.js` exports shared `{ before, after }` webpack hooks. Individual
Zimlet packages export function-style configs that call those hooks and customize the
package config. The root hook adds the shared components directory to CSS processing
and monorepo `node_modules` to loader resolution; package hooks can set deployment
`publicPath` or customize asset handling. The CLI executes function exports, not the
root hooks object.

Install dependencies at the repository root. To watch one Zimlet, run
`npx lerna run start --scope '*dropbox'` there (port conflicts can occur when running
several packages in parallel). Run `npx lerna run test --scope @zimbra/cloud-common`
for the shared library tests. Build a Zimlet before running `npm run package` inside
its package directory.

### Delivery

Most package build scripts run `zimlet build` and copy `.netlify/_headers` into the
build for hosted development. Common package structure includes `src/index.js`,
`src/components`, `src/store`, `src/utils`, `src/intl`, `src/enhancers.js`, optional
`config_template.xml`, `.netlify/_headers`, and `scripts/postinst.sh`.

CI builds tagged packages and publishes them to an OCI bucket and Dropbox using
[`gather-tags-for-deploy.sh`](../../../zm-cloudsuite-zimlets/scripts/gather-tags-for-deploy.sh)
and [`upload-to-dropbox.sh`](../../../zm-cloudsuite-zimlets/scripts/upload-to-dropbox.sh).
Zimlets use `scripts/postinst.sh` for server deployment.
