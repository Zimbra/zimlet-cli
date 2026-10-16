# Known gaps and items to confirm

Items that are incomplete, stale or only partly verified, so the developer guide built from these files does not state them as settled. Each entry says how it was checked. Remove an entry when it is fixed or confirmed.

Unless noted, "read from code" means found by reading the source in the sibling repositories, not by running Modern UI in a browser. Local commands were run on Node 18; the repositories require Node 24.

## Default template (`zm-x-zimlet-template-default`)

Last commit 2022. `zimlet create` itself works (confirmed by you). The template pins `@zimbra/zimlet-cli ^14.0.0`, so a created project builds with CLI 14, not the current 19.0.0 that all the zimlet repos use.

| Issue | Evidence | Fix |
|---|---|---|
| `import { Text } from 'preact-i18n'` does not match the current host | CLI 14 shims `preact-i18n` (checked in the published 14.3.0 package), so the build passes. The host (`zimlet-manager/shims.js`) now provides only `@zimbra/preact-i18n`, so that shim finds nothing and `Text` should throw at render time (inferred, not run in a browser). With the current CLI 19.0.0 the build itself fails with `Can't resolve 'preact-i18n'` (built a copy of `template/`; after switching to `@zimbra/preact-i18n` the build and `zimlet package` succeeded). | Import from `@zimbra/preact-i18n` and move to CLI 19. |
| Menu item icon is a string (`icon='question-circle'`) | Host `Icon` rejects string names (`@zimbra/blocks` `icon/index.js`). Read from code. | Use a `lucide-preact` component. |
| Old toolchain | `devDependencies` pin `@zimbra/zimlet-cli ^14.0.0` (current 19.0.0; 14 also lacks the `@zimbra/preact-i18n` and `preact/jsx-runtime` shims), ESLint 8 with `eslint-config-synacor`; current repos use ESLint 9 with `@zimbra/eslint-config`. | Update versions and lint config. Also: `npm install` on the template fails with `ERESOLVE` (`eslint-config-synacor@3.0.5` needs ESLint 6 or older, the template has ESLint 8); with `--legacy-peer-deps` it installs, but `npm run lint` then fails on every file with a parsing error from `babel-eslint` (checked on Node 18, 20 and 24). Run on its own with the template's rule settings, the `preact-i18n/no-text-as-children` rule works and reports literal text as `Untranslated text`. |
| Label and description fall back to `package.json` | `src/intl/en_US.json` has no `zimlet.label`/`zimlet.description`, so `zimlet package` warns that the fallback is deprecated and uses `TBD`. | Add the `zimlet` block and drop the `--label/--description` script args. |
| README typo | The command list has `npm run package` twice; the first ("Pass JavaScript files using ESLint") should be `npm run lint`. | Fix the first entry. |
| Not checked | `.circleci/config.yml` (AWS S3 orb), current `--zimbraXVersion '^4.0.0'` suitability. | Review. |

## Host runtime (`zm-x-web`), read from code

- **`unload()` / `destroy()` appear not to run.** `_shutdown` checks `context.unload` on the realm result instead of `context.handler`. Confirm in a browser. See [runtime.md](../../../zm-x-web/.agents/zimlet/reference/runtime.md).
- **Shared zimlet name.** For the consolidated bundle the context name resolves to `serverConsolidatedZimlets` instead of each zimlet's own name, affecting `resourceUrl`, `cache`, the style tag id and `err.sourceZimlet`. Confirm in a browser.
- **`removeModal` reducer** reads `payload.modals` instead of the state's modals.
- **`preact/jsx-runtime`** is aliased by zimlet-cli but not provided by the host, so JSX files must import `createElement`. A leftover `preact-pwa-install` shim exists in zimlet-cli only.
- **Legacy slot names with no host callsite** (registered by cloud zimlets, not in the catalog; inert today): `attachment-items`, `attachment-upload-and-link`, `collaboration-zimlet-collaboration-list`, `…-list-files`, `…-list-videos`, `…-list-chat`. Checked against the current catalog and `zm-x-web/src`. Decide whether to remove them from the zimlets or document them as deprecated.

## Slot catalog

- Every record has `placementAreas: [unclassified]` (155 records). Slot placement and payload meaning still need per-slot research before the guide can describe them. Rules are in [slot-doc.md](../rules/slot-doc.md).
- The catalog is generated for a given commit; regenerate it with `zm-x-web/.agents/zimlet/scripts/find-slots.sh` after host changes.

## `zimlet-cli`

- `zimlet package` (`package.js`, `createLocalizationFiles`) catches a failed read of `src/intl` and then calls `.filter` on an undefined value, so a zimlet without `src/intl` crashes at that step. Read from code.
- Descriptor values are not XML-escaped, and `.properties` files are always written to `./build` regardless of `--builddir`. Read from code.
- `zimlet watch` prints `Local: http://localhost:<port>/index.js`, but the server answers only over HTTPS (run with Node 24 and CLI 19: the `https://` URL returned the file, the `http://` URL did not connect). Use the `https://` URL in the sideloader.

## Documentation sources

- The mapping from a Zimbra server release to its `zm-x-web` version is not documented in any of these repositories, so authors cannot derive the right `--zimbraXVersion` range from a server version alone. Today they must read the version from Modern UI (Settings, About). See [packaging-deployment.md](./packaging-deployment.md#1-zimlet-package).
- Server behaviour in [packaging-deployment.md](./packaging-deployment.md) (bundle filtering, `zmzimletctl`) was not run against a server.
- The `zimbra-translation` skill in [zm-frontend-ai-skills](../../../zm-frontend-ai-skills) was read, not run, so its workflows (add language, fix, sync, audit) are not verified against the zimlet repos.
- [zm-x-oauth-client](../../../zm-x-oauth-client): its README describes installing over HTTPS with a GitHub token and tag `1.2.2`; the cloud zimlets use `git+ssh` with tag `2.0.0`. It talks to a server-side OAuth extension that is not part of this workspace, so provider connection flows were not exercised.
- `zm-modern-zimlets` README: the release section still shows `cd packages/...` (the directory is `zimlets/`) and an older tag-and-approve flow; prefer its CI configuration.
- `zm-cloudsuite-zimlets`: the `@zimbra/cloud-common` workspace link was missing from the checked-out `node_modules/@zimbra/`; a root `npm install` is needed. Some local folders under `packages/` (and four under `zm-modern-zimlets/zimlets/`) hold only `node_modules`/`build`/`pkg` and are not source.
