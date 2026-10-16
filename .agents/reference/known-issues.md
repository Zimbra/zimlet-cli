# Known gaps and items to confirm

Items that are incomplete, stale or only partly verified, so the developer guide built from these files does not state them as settled. Each entry says how it was checked. Remove an entry when it is fixed or confirmed. Issues in the Zimlet monorepos are kept in [zimlet-known-issues.md](../../../zm-modern-zimlets/.agents/reference/zimlet-known-issues.md).

Unless noted, "read from code" means found by reading the source in the sibling repositories, not by running Modern UI in a browser. Local commands were run on Node 18; the repositories require Node 24.

## How to read this file

Each entry is a bullet with its ID and issue, followed by these fields:

- **Type**: `Issue` when something in the code, template or docs is wrong or broken, including one not yet confirmed in a browser. `Gap` when something is unknown, not checked or not documented.
- **Functional**: `Yes` when it changes what a Zimlet builds, packages, deploys or does at run time. `No` when it only affects docs text, cosmetics or inert code. `Unknown` when a gap has not been checked.
- **Severity**: `High` when it blocks a documented workflow or leads a reader to a failure, for example a Zimlet that is silently absent. `Medium` when it works only with a workaround or fails in one case. `Low` for cosmetic, wording or inert items.
- **Impact**: what happens because of the issue, for example "the build breaks". `Unknown` when the effect has not been checked.
- **Evidence**: how it was checked.
- **Fix**: the next step, or what to confirm.

The ID is `KI-<nn>`; use it to refer to an entry. The severities are a first assessment. Review them when an entry is updated.

## Default template (`zm-x-zimlet-template-default`)

Last commit 2022. The team will fix the template, and the guide's quickstart is written for the refreshed template, so it has no manual-fix step. Check the template before relying on the items below. `zimlet create` itself works (confirmed by you). The template pins `@zimbra/zimlet-cli ^14.0.0`, not the current 19.0.0.

- **KI-01: `import { Text } from 'preact-i18n'` does not match the current host**
  - Type: Issue
  - Functional: Yes
  - Severity: High
  - Impact: The template does not build on CLI 19, and `Text` throws at render on the host.
  - Evidence: The host (`zimlet-manager/shims.js`) provides only `@zimbra/preact-i18n`, so `Text` should throw at render time (inferred, not run in a browser). CLI 14 still builds it; CLI 19.0.0 fails with `Can't resolve 'preact-i18n'`. A copy of `template/` built and packaged after switching to `@zimbra/preact-i18n`.
  - Fix: Import from `@zimbra/preact-i18n` and move to CLI 19.
- **KI-02: Menu item icon is a string (`icon='question-circle'`)**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: The menu icon fails, because the host rejects string names.
  - Evidence: Host `Icon` rejects string names (`@zimbra/blocks` `icon/index.js`). Read from code.
  - Fix: Use a `lucide-preact` component.
- **KI-03: Old toolchain: CLI `^14.0.0` and ESLint 8 with `eslint-config-synacor`**
  - Type: Issue
  - Functional: Yes
  - Severity: High
  - Impact: `npm install` fails with `ERESOLVE`, and `npm run lint` fails on every file.
  - Evidence: CLI 14 lacks the `@zimbra/preact-i18n` and `preact/jsx-runtime` shims; current repos use CLI 19 and ESLint 9 with `@zimbra/eslint-config`. `npm install` fails with `ERESOLVE`; with `--legacy-peer-deps` it installs, but `npm run lint` fails on every file with a `babel-eslint` parsing error (Node 18, 20, 24). The `preact-i18n/no-text-as-children` rule works on its own and reports literal text as `Untranslated text`.
  - Fix: Update versions and lint config.
- **KI-04: Label and description fall back to `package.json`**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: `zimlet package` warns and uses `TBD` as the label and description.
  - Evidence: `src/intl/en_US.json` has no `zimlet.label`/`zimlet.description`, so `zimlet package` warns that the fallback is deprecated and uses `TBD`.
  - Fix: Add the `zimlet` block and drop the `--label/--description` script args.
- **KI-05: README lists `npm run package` twice**
  - Type: Issue
  - Functional: No
  - Severity: Low
  - Impact: Readers run `npm run package` when they meant `npm run lint`.
  - Evidence: The first entry ("Pass JavaScript files using ESLint") should be `npm run lint`.
  - Fix: Fix the first entry.
- **KI-06: Not checked: `.circleci/config.yml` (AWS S3 orb) and whether `--zimbraXVersion '^4.0.0'` suits the template**
  - Type: Gap
  - Functional: Unknown
  - Severity: Low
  - Impact: Unknown. A broken CI config or version range would go unnoticed.
  - Evidence: Not checked.
  - Fix: Review.

## Host runtime (`zm-x-web`), read from code

- **KI-07: `unload()` / `destroy()` appear not to run**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: Cleanup in `unload()` and `destroy()` is skipped.
  - Evidence: `_shutdown` checks `context.unload` on the realm result instead of `context.handler`. See [runtime.md](../../../zm-x-web/.agents/zimlet/reference/runtime.md). Not confirmed in a browser.
  - Fix: Confirm in a browser.
- **KI-08: For the consolidated bundle the context name resolves to `serverConsolidatedZimlets` instead of each zimlet's own name**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: Resource URLs, cache keys, style tag ids and error source names collide with the shared name.
  - Evidence: Read from code. Affects `resourceUrl`, `cache`, the style tag id and `err.sourceZimlet`. Not confirmed in a browser.
  - Fix: Confirm in a browser.
- **KI-09: `removeModal` reducer reads `payload.modals` instead of the state's modals**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: Modals are not removed by `removeModal`.
  - Evidence: Read from code.
  - Fix: Read the state's modals in the reducer.
- **KI-10: `preact/jsx-runtime` is aliased by zimlet-cli but not provided by the host, so JSX files must import `createElement`**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: JSX files that rely on the automatic runtime fail at render.
  - Evidence: Read from code.
  - Fix: Document the `createElement` import in examples.
- **KI-11: A leftover `preact-pwa-install` shim exists in zimlet-cli only**
  - Type: Issue
  - Functional: No
  - Severity: Low
  - Impact: No effect today. The shim is dead code in the build tooling.
  - Evidence: Read from code.
  - Fix: Remove it, or document why it stays.
- **KI-12: `@zimbra-client/util/redux` is generated by zimlet-cli but has no key in the host `shims.js`**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: An import from `@zimbra-client/util/redux` builds, then fails when used.
  - Evidence: `SHIMMED_MODULES` entry `['@zimbra-client/util', 'redux', 'contacts']` and shim file `src/shims/@zimbra-client/util/redux` exist in zimlet-cli. The host `shims.js` has only `@zimbra-client/util` and `@zimbra-client/util/contacts`. Read from code. An import from it builds and then fails when used.
  - Fix: Decide whether to add it to the host or remove it from `SHIMMED_MODULES`.
- **KI-14: `context.config` is normally `undefined`**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: A Zimlet that reads `context.config` gets `undefined`.
  - Evidence: `zimletContext.config` is set from `options.config` in `zm-x-web/src/lib/zimlet-manager/index.js`, but `zm-x-web/src/components/zimlet-loader.js` loads Zimlets with only `{ name, compat }`, so no config reaches the Zimlet. The app config (`zimbraOrigin`, `useJwt`, `useCsrf`, ...) goes to the manager, not to each Zimlet. Read from code.
  - Fix: Use `useClientConfig` (exported by the shims, from `zm-x-web/src/hooks/client-config`) for host settings.

## Slot catalog

- **KI-15: Every record has `placementAreas: [unclassified]` (155 records)**
  - Type: Gap
  - Functional: No
  - Severity: Medium
  - Impact: Authors cannot tell where a slot renders or what its payload holds, so the guide cannot describe it.
  - Evidence: Slot placement and payload meaning need per-slot research before the guide can describe them.
  - Fix: Research each slot by the rules in [slots.md](../rules/doc-guide/slots.md).
- **KI-16: The catalog is generated for a given commit**
  - Type: Gap
  - Functional: No
  - Severity: Low
  - Impact: Slot docs go stale after host changes.
  - Evidence: Process note.
  - Fix: Regenerate it with `zm-x-web/.agents/zimlet/scripts/find-slots.sh` after host changes.

## `zimlet-cli`

- **KI-17: `zimlet package` crashes on a zimlet without `src/intl`**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: `zimlet package` crashes, so the Zimlet is not packaged.
  - Evidence: `createLocalizationFiles` in `package.js` catches a failed read of `src/intl` and then calls `.filter` on an undefined value. Read from code.
  - Fix: Decide the fix.
- **KI-18: `zimlet package` writes `label = undefined` and `description = undefined` into a locale's `.properties` file**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: The admin console shows `undefined` as the label and description for that locale.
  - Evidence: Happens when that locale's `src/intl/<locale>.json` has no `zimlet.label` or `zimlet.description`, because `getUnicode` returns `undefined` for an empty string. Checked by running it. The admin console then shows "undefined" for that locale.
  - Fix: Return `''` from `getUnicode` for empty input, or skip empty keys.
- **KI-19: Descriptor values are not XML-escaped**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: A `&` or `<` in a value can produce an invalid descriptor.
  - Evidence: Read from code.
  - Fix: Escape the values before writing the descriptor.
- **KI-20: `.properties` files are always written to `./build` regardless of `--builddir`**
  - Type: Issue
  - Functional: Yes
  - Severity: Low
  - Impact: Output goes to `./build` even when `--builddir` is set, so a build step that reads `--builddir` finds no files.
  - Evidence: Read from code.
  - Fix: Write them to `--builddir`.
- **KI-21: `zimlet watch` prints an `http://` Local URL, but the server answers only over HTTPS**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: The printed URL does not load, so authors see no Zimlet.
  - Evidence: Node 24, CLI 19: `https://` returned the file, `http://` did not connect. `src/index.js` reads `config.devServer.https`, but the webpack 5 config sets `devServer.server.type` (since commit `3c5aeaa`), so the CLI always prints `http://`.
  - Fix: Read `config.devServer.server.type === 'https'`. Until then, use the `https://` URL in the sideloader.
- **KI-23: `zimlet watch` does not move to the next free port when another dev server listens on 8081**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: A second `zimlet watch` fails to start.
  - Evidence: [cli-commands.md](./cli-commands.md#commands) says it scans up to +100. On macOS with Node 24 and CLI 19.0.0, a second `zimlet watch` crashed with `EADDRINUSE: address already in use ::1:8081`. Probable cause (not confirmed): `get-port` in `src/index.js` checks a different address than the one webpack-dev-server binds.
  - Fix: Pass `--port` as a workaround.
- **KI-24: `react-dom/client` (the React 18 `createRoot` API) fails to build**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: Imports from `react-dom/client` fail to build, so the Zimlet is not built.
  - Evidence: The CLI aliases only `react` and `react-dom` to `preact/compat` (`src/index.js`). Fails with `Can't resolve 'react-dom/client'` (Node 24, CLI 19). `import React, { useState } from 'react'` builds and rendered in the Modern UI (confirmed by you).
  - Fix: Use the classic React API, or add an alias for `react-dom/client`.
- **KI-33: zimlet-cli generates five `@zimbra-client/components` exports that the host does not provide: `ToolbarButton`, `CollapsedSubmenu`, `AlignedLabel`, `AttachmentItem`, `TextArea`**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: The import builds. Calling one of these components throws `[ZimletCli]: Export @zimbra-client/components.<Name> was not found` at run time.
  - Evidence: The `@zimbra-client/components` mock list in `build-shims.js` has 59 names, and the generated shim has 59 `wrap(...)` exports. The host `'@zimbra-client/components'` key in `zm-x-web/src/lib/zimlet-manager/shims.js` (line 191) has 54 names and none of the five. `ToolbarButton` and `CollapsedSubmenu` were removed in `7a7091e19d` (PREAPPS-4082), `AlignedLabel` in `995d29bb18` (PREAPPS-7344). `AttachmentItem` and `TextArea` never appear in that file's history. Checked in `zm-x-web` branch `PREAPPS-9850`. Read from code, not run in a browser.
  - Fix: Remove the five entries from `build-shims.js` and run `npm run build:shims`. Do not add them to the host. Document them only if the host exports them.
- **KI-34: The generated `react-redux` shim exports six names that the host does not provide: `ReactReduxContext`, `createDispatchHook`, `createSelectorHook`, `useStore`, `createStoreHook`, `shallowEqual`**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: The import builds. Calling one of these exports throws `[ZimletCli]: Export react-redux.<Name> was not found` at run time.
  - Evidence: `createShim` in `build-shims.js` builds module shims from `Object.keys(require(...))` of the installed `react-redux` package (8.1.3), so the generated `src/shims/react-redux/index.js` has 11 exports. The host `'react-redux'` key in `zm-x-web/src/lib/zimlet-manager/shims.js` (line 175) has five: `Provider`, `connect`, `useSelector`, `useDispatch`, `batch`. The six extra names are not in the host. Checked in `zm-x-web` branch `PREAPPS-9850`. Read from code, not run in a browser.
  - Fix: Restrict the generated `react-redux` shim to the host's five names, or source the list from the host, then run `npm run build:shims`. Do not add the six names to the host unless the host needs them. The reference page already lists only the five host names.
- **KI-35: The generated `preact-router` shim exports six names that the host does not provide: `subscribers`, `getCurrentUrl`, `Router`, `Route`, `exec`, `useRouter`**
  - Type: Issue
  - Functional: Yes
  - Severity: Medium
  - Impact: The import builds. Calling one of these exports throws `[ZimletCli]: Export preact-router.<Name> was not found` at run time.
  - Evidence: `createShim` in `build-shims.js` builds module shims from `Object.keys(require(...))` of the installed `preact-router` package, so the generated `src/shims/preact-router/index.js` has eight exports. The host `'preact-router'` key in `zm-x-web/src/lib/zimlet-manager/shims.js` (line 182) has two: `route` and `Link`. The six extra names are not in the host. Checked in `zm-x-web` branch `PREAPPS-9850`. Read from code, not run in a browser.
  - Fix: Restrict the generated `preact-router` shim to the host's two names, or source the list from the host, then run `npm run build:shims`. The reference page already lists only `route` and `Link`.

## Documentation sources

- **KI-25: The mapping from a Zimbra server release to its `zm-x-web` version is not documented, so authors cannot derive the `--zimbraXVersion` range from a server version alone**
  - Type: Gap
  - Functional: Yes
  - Severity: High
  - Impact: Authors pick a wrong `--zimbraXVersion` range, and the Zimlet is then silently absent on the server.
  - Evidence: Not documented in these repositories. A wrong range makes a Zimlet silently absent.
  - Fix: Today authors read the version from Modern UI (Settings, About). See [packaging-deployment.md](./packaging-deployment.md#1-zimlet-package).
- **KI-26: Server behaviour in [packaging-deployment.md](./packaging-deployment.md) (bundle filtering, `zmzimletctl`) is not verified**
  - Type: Gap
  - Functional: Unknown
  - Severity: Medium
  - Impact: Deployment steps that depend on server behaviour may not work as written.
  - Evidence: Not run against a server.
  - Fix: Verify against a server, where one is available.
- **KI-27: The `zimbra-translation` skill in [zm-frontend-ai-skills](../../../zm-frontend-ai-skills) is not verified against the zimlet repos**
  - Type: Gap
  - Functional: No
  - Severity: Low
  - Impact: Translation workflows may not work as written against the zimlet repos.
  - Evidence: Read, not run. Its workflows are add language, fix, sync and audit.
  - Fix: Run its workflows against the zimlet repos.
