# Migration Guide: Node 18 / npm 6 → Node 24 / npm 11 (PREAPPS-9204, Phase 1)

Audience: developers who build **custom Zimlets** for Zimbra Modern UI (`zm-x-web`) using `@zimbra/zimlet-cli`, and anyone building `zm-x-web` / `zm-modern-zimlets` locally or in CI.

Source changes:

| Repo | PR |
|------|----|
| `Zimbra/zm-x-web` | [#6322](https://github.com/Zimbra/zm-x-web/pull/6322) |
| `Zimbra/zm-modern-zimlets` | [#1124](https://github.com/Zimbra/zm-modern-zimlets/pull/1124) |
| `Zimbra/zm-cloudsuite-zimlets` | [#120](https://github.com/Zimbra/zm-cloudsuite-zimlets/pull/120) |
| CSP for Modern UI | [zm-x-web #6386](https://github.com/Zimbra/zm-x-web/pull/6386), [zimlet-cli #362](https://github.com/Zimbra/zimlet-cli/pull/362), [zm-modern-zimlets #1166](https://github.com/Zimbra/zm-modern-zimlets/pull/1166), [zm-cloudsuite-zimlets #126](https://github.com/Zimbra/zm-cloudsuite-zimlets/pull/126) |
| `Zimbra/zimlet-cli` | [#338](https://github.com/Zimbra/zimlet-cli/pull/338) |

---

## 1. Summary of breaking changes

| Area | Before | After |
|------|--------|-------|
| Node.js | `^18.20.0` | `^24.18.0` |
| npm | `^6.14` | `^11.12.1` |
| `@zimbra/zimlet-cli` | `^18.x` | `^20.0.0` |
| Transpiler | Babel (`babel-loader`, `@babel/*`) | **esbuild** (`esbuild-loader`) |
| i18n package | `preact-i18n` | **`@zimbra/preact-i18n`** |
| `preact-context-provider` (`provide`) | shimmed/available | **Removed** |
| `recompose` | shimmed/available | **Removed** (use `@zimbra-client/util` helpers / `es-toolkit`) |
| `wiretie` (`@wire`) | available | **Removed** |
| `preact-pwa-install` | shimmed | **Removed** → `@zimbra-client/pwa-utils` |
| Legacy context (2nd component arg `(props, context)`) | supported | **Not available** – use props / `context.store` |
| `context.zimletRedux` | top-level | `context.store.zimletRedux` |
| `preact-router` | `3.1.1_base_path_support` | `4.1.2_base_path_support` |
| Dependency install (monorepos) | `postinstall` recursive-install / `lerna bootstrap` | **npm workspaces** |
| `NODE_ENV=dev` implies watch mode | yes | **No** – use `--watch` |
| Content-Security-Policy | none | **Enforced by default in Modern UI** – see §8 (`zimlet-cli ^20`, `getCspNonce`) |

---

## 2. Environment / tooling upgrade

### 2.1 Install Node 24 and npm 11

```bash
nvm install 24.18.0
nvm use 24.18.0
npm install -g npm@11
node -v   # v24.18.x
npm -v    # 11.x
```

Notes:
- `.nvmrc` in `zm-x-web` is now `24.0.0`.
- Docker: `FROM node:18` → `FROM node:24`; remove `npm install -g npm@6` (Node 24 ships npm 11).
- CircleCI: `cimg/node:18.18` → `cimg/node:24.18`; remove the "Set correct npm version / `npm install -g npm@6`" step. Bump your dependency cache key (e.g. `v4-` → `v5-`) so stale `node_modules` aren't restored.

### 2.2 `engines` in your zimlet `package.json`

```diff
 "engines": {
-  "node": "^18.20.0",
-  "npm": "^6"
+  "node": "^24.18.0",
+  "npm": "^11"
 }
```

### 2.3 Upgrade the CLI

```diff
 "devDependencies": {
-  "@zimbra/zimlet-cli": "^18.9.0"
+  "@zimbra/zimlet-cli": "^20.0.0"
 }
```

### 2.4 Clean reinstall (important: lockfile v1 → v3)

npm 11 rewrites `package-lock.json` (lockfileVersion 3) and is stricter on peer dependencies.

```bash
rm -rf node_modules package-lock.json
npm install
# If you hit ERESOLVE peer-dependency errors, fix versions first;
# use --legacy-peer-deps only as a temporary workaround.
```

### 2.5 npm 7+ behavior changes you may notice

- Peer dependencies are installed automatically and conflicts **fail** the install (`ERESOLVE`).
- Lifecycle `postinstall` scripts that relied on npm 6 behavior (e.g. `lerna bootstrap`, `recursive-install`) are replaced by **workspaces** (see §6).
- `npm audit`, `npm ci` are stricter: `npm ci` fails if `package.json` and lockfile are out of sync.
- `package.json` `overrides` replaces `resolutions` for forcing transitive versions.

---

## 3. `zimlet-cli` v20 build changes

### 3.1 Babel → esbuild

`zimlet-cli` no longer ships Babel (`@babel/core`, `@babel/preset-env`, `@babel/register`, `@babel/polyfill`, `babel-loader`, `raw-loader` were removed). JS/JSX is compiled with `esbuild-loader`:

```js
{
  test: /\.jsx?$/,
  loader: require.resolve('esbuild-loader'),
  options: {
    loader: 'jsx',
    target: 'es2022',
    jsxFactory: 'createElement',
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,   // legacy decorators still work
        useDefineForClassFields: false  // "loose" class properties
      }
    }
  }
}
```

What this means for you:

1. **Always `import { createElement } from 'preact'`** in every file containing JSX (the JSX factory is `createElement`; this was already required, but is now strictly enforced).
2. **Legacy decorators (`@connect`, `@withIntl`) still work**, but must be placed on a **top-level class** (see §4.4).
3. **Babel-only syntax/plugins are gone.** Supported by esbuild: class properties, decorators (legacy), `export * as ns from`, dynamic `import()`. `export v from './x'` (`@babel/plugin-proposal-export-default-from`) is **not** supported – rewrite it:

```diff
-export Foo from './foo';
+export { default as Foo } from './foo';
```

4. **`@babel/polyfill` is no longer injected.** Use `core-js` / `regenerator-runtime` explicitly if you rely on `async/await` regenerator on old targets:

```js
import 'regenerator-runtime/runtime';
```

5. **Custom Babel config is ignored** (`.babelrc`, `babel` key in `package.json`). Remove it, and remove `@babel/*` devDependencies unless used for other tooling.

### 3.2 `zimlet.config.js` (webpack transformer) loading

`zimlet.config.js` is no longer loaded through `@babel/register`; it is loaded with Node's `createRequire`. Consequences:

- Both CommonJS (`module.exports = fn`) and ES syntax (`export default function configure(config, env)`, as used in `zm-cloudsuite-zimlets`) work on Node 24, because Node 24 can `require()` ES modules synchronously. **Top-level `await` is not allowed** in this file.
- Babel-only syntax and Babel-only plugins are no longer applied to this file.
- Errors are reported as `Error executing transformer at <path>`.
- If the export is not a function it is silently ignored.
- `zimlet.config.js` is cached per run; it is re-read on each build.

```js
// zimlet.config.js (either style works)
export default function configure(config, env) {
  config.resolve.alias = { ...config.resolve.alias, '@': require('path').resolve(__dirname, 'src') };
}
```

### 3.2.1 Webpack 5 asset modules: `url-loader` / `file-loader` / `raw-loader` removed

Rules that set `rule.loader = 'url-loader'` (common in older zimlets for SVG/images) fail. Use webpack 5 asset modules (as done in the cloudsuite zimlets):

```diff
-import path from 'path';
 // use url-loader for images
 config.module.rules.forEach(rule => {
-  if (rule.test.toString().indexOf('svg') !== -1) {
-    rule.loader = 'url-loader';
-  }
+  if (rule.test && rule.test.toString().indexOf('svg') !== -1) {
+    delete rule.loader;
+    delete rule.use;
+    rule.type = 'asset/inline';           // inline as data URI (replaces url-loader)
+    if (rule.generator && rule.generator.filename) {
+      delete rule.generator.filename;     // inherited font filename setting conflicts
+    }
+  }
 });
```

Also guard with `rule.test &&` – some rules have no `test`. `raw-loader` was removed from zimlet-cli; use `type: 'asset/source'`.

### 3.3 Loaders are resolved with `require.resolve`

If your `zimlet.config.js` references loaders by bare name from `config.module.rules` (e.g. `'css-loader'`, `'less-loader'`, `'postcss-loader'`), prefer `require.resolve('css-loader')` – with npm workspaces / hoisting, bare names may resolve from the wrong `node_modules`.

### 3.4 `watch` vs `production` mode

Previously `NODE_ENV=dev|development` forced watch mode. Now only the CLI flags do:

```bash
# before
NODE_ENV=development zimlet build        # implied watch
# after
zimlet watch            # or: zimlet build --watch / -w
zimlet build --production
```

If your CI/scripts depended on `NODE_ENV=development` to produce a non-production build, switch to explicit flags.

### 3.5 Updated shims

Zimlets must not bundle their own copies of host libraries; `zimlet-cli` aliases them to the host's copy. The shim list changed:

| Shim | Status |
|------|--------|
| `preact-i18n` | **Replaced** by `@zimbra/preact-i18n` |
| `preact-context-provider` | **Removed** |
| `recompose` | **Removed** |
| `preact-pwa-install` | **Removed** |
| `@zimbra-client/pwa-utils` | **Added** (`awaitInstallPrompt`, `isStandalone`) |
| `@zimbra-client/util` | **Added** exports: `getContext`, `branch`, `withProps` |
| `@zimbra-client/hooks` | **Added** export: `useZimbraContext` |
| `@zimbra-client/components` | **Added** export: `ZimbraProvider` |
| `preact-router` | **Added** exports: `exec`, `useRouter` |
| `preact/compat` | `StrictMode` export kept |

---

## 4. Required zimlet source code changes

### 4.1 `preact-i18n` → `@zimbra/preact-i18n`

Every import changes; the API (`Text`, `MarkupText`, `Localizer`, `IntlContext`, `useText`, `withText`, `intl`, `IntlProvider`) is the same.

```diff
-import { Text, MarkupText, useText, withText, intl, IntlContext } from 'preact-i18n';
+import { Text, MarkupText, useText, withText, intl, IntlContext } from '@zimbra/preact-i18n';
```

`package.json`:

```diff
 "devDependencies": {
-  "preact-i18n": "^2.4.0-preactx"
+  "@zimbra/preact-i18n": "^3.0.0"
 }
```

Typical `enhancers.js`:

```js
import { intl } from '@zimbra/preact-i18n';
import definition from './intl/en_US.json';

export const withIntl = () => intl({ definition });
```

Quick codemod:

```bash
grep -rl "from 'preact-i18n'" src | xargs sed -i.bak "s#from 'preact-i18n'#from '@zimbra/preact-i18n'#g"
```

### 4.2 Legacy context removed → use props and `context.store`

Preact legacy context (the **second argument** of a function component, `this.context`) is no longer supplied. Values are passed as props, and the redux-related objects moved under `context.store`.

**Zimlet entry point**

```diff
 export default function Zimlet(context) {
-  const { plugins, zimletRedux } = context;
+  const { plugins, store } = context;
+  const { zimletRedux } = store;
```

**Components that receive `context` as a prop (modals, etc.)**

```diff
-const { removeModal } = context.zimletRedux.actions.zimlets;
+const { removeModal } = context.store.zimletRedux.actions.zimlets;
```

**Function components reading the 2nd argument**

```diff
-export const App = withIntl()(({ getCustomMetadata }, { zimletRedux, advancedChatEnabled }) => {
+export const App = withIntl()(({ getCustomMetadata, advancedChatEnabled, store }) => {
+  const { zimletRedux } = store;
   ...
 });
```

```diff
-export const Dialog = withIntl()(({ type, folder, context }, { client }) => {
+export const Dialog = withIntl()(({ type, folder, context }) => {
```

If you need the Apollo client, use a hook (e.g. `useApolloClient` from `@apollo/client`) instead of `{ client }` from legacy context.

**New helper:** `useZimbraContext` from `@zimbra-client/hooks` and `ZimbraProvider` from `@zimbra-client/components` are now exported for reading/providing Zimbra context in hooks-based components.

```js
import { useZimbraContext } from '@zimbra-client/hooks';

const MyComponent = () => {
  const ctx = useZimbraContext();
  // ctx.store.zimletRedux, ctx.plugins, ...
};
```

### 4.2.1 `this.context.<x>` in class components → props or `getContext`

Values previously read from `this.context` (e.g. `zimbraBatchClient`, your own `dropboxClient`) must now arrive as props.

```diff
+import { getContext } from '@zimbra-client/util';

 @withIntl()
+@getContext(({ zimbraBatchClient }) => ({ zimbraBatchClient }))
 @connect(state => ({ clientEnabled: isEnabled(state) }))
 export default class DropboxOAuthButton extends Component {
-  deactivateApp = () => this.context.dropboxClient.deactivate();
+  deactivateApp = () => this.props.dropboxClient.deactivate();
   showAuthorize = () =>
     new AuthorizeWindowOpener({
-      zimbraOrigin: this.context.zimbraBatchClient.origin,
+      zimbraOrigin: this.props.zimbraBatchClient.origin,
```

Function components that used `this.context` (invalid anyway) now take props:

```diff
-export function CollaborationItem({ onViewChange }) {
-  const { googleDriveClient } = this.context;
+export function CollaborationItem({ onViewChange, googleDriveClient }) {
```

### 4.3 `preact-context-provider` (`provide`) removed

Pass values as explicit props (closure) when registering slots.

```diff
-import { provide } from 'preact-context-provider';
 ...
-plugins.register(
-  'slot::app',
-  provide({ zimlets, oneToOneChatEnabled })(() => <Heartbeat />)
-);
-plugins.register('slot::contact-card-item', provide({ oneToOneChatEnabled })(Presence));
+plugins.register('slot::app', () => (
+  <Heartbeat zimlets={zimlets} oneToOneChatEnabled={oneToOneChatEnabled} plugins={plugins} />
+));
+plugins.register('slot::contact-card-item', props => (
+  <Presence oneToOneChatEnabled={oneToOneChatEnabled} {...props} />
+));
```

Wrap once in the entry point and pass shared objects as props (pattern used in cloudsuite zimlets):

```diff
-const ProvidedDropboxSaver = provide({ dropboxClient, zimletRedux })(DropboxSaver);
+const notify = zimletRedux?.actions.notifications.notify;
+const ProvidedDropboxSaver = props => (
+  <DropboxSaver dropboxClient={dropboxClient} notify={notify} {...props} />
+);
 plugins.register('slot::attachment-items', ProvidedDropboxSaver);
```

Components registered without extra values (e.g. `settings`, `slot::routes`) can be registered directly, with no wrapper.

Remove `preact-context-provider` from `package.json`.

### 4.4 `wiretie` (`@wire`) removed

`@wire('zimletName', null, ({ zimletRedux }) => ({ ... }))` injected redux actions via legacy context. Get them from `store` instead.

```diff
-import wire from 'wiretie';
 import { connect } from 'react-redux';
+import { withIntl } from '../../enhancers';

-@wire('calendarSubscription', null, ({ zimletRedux }) => ({
-  removeSlot: zimletRedux.actions.zimlets.removeSlot
-}))
+@withIntl
 @connect(null, (dispatch, { removeSlot }) => ({
   removeModal: (...args) => dispatch(removeSlot(...args))
 }))
 class SubscribeModal extends Component { ... }
```

The `@wire('zimletRedux', null, zimletRedux => ({ notify: zimletRedux.actions.notifications.notify }))` form is replaced by passing `notify` as a prop from the entry point (see §4.3).

Pass `removeSlot` / `addSlot` as props from the zimlet entry (where you have `context.store.zimletRedux`):

```js
const { addSlot, removeSlot } = context.store.zimletRedux.actions.zimlets;
plugins.register('slot::menu', () => <ActionItem addSlot={addSlot} />);
```

### 4.5 `recompose` removed

Use `flowRight` from `es-toolkit/compat` for `compose`, and the `withProps` / `branch` / `getContext` helpers now exported from `@zimbra-client/util`.

```diff
-import { compose, withProps, branch, renderNothing } from 'recompose';
+import { flowRight } from 'es-toolkit/compat';
+import { withProps, branch } from '@zimbra-client/util';

-export default compose(
-  branch(({ isActive }) => !isActive, renderNothing),
+export default flowRight(
+  branch(({ isActive }) => !isActive, null),   // `null` replaces renderNothing
   withCalendars(),
   withProps(({ calendars }) => ({ calendars: calendars.filter(c => !c.owner) })),
-  branch(({ calendars }) => !calendars.length, renderNothing)
+  branch(({ calendars }) => !calendars.length, null)
 )(SubscribedCalendarList);
```

Add the dependency if you use it directly: `"es-toolkit": "^1.45.1"`. Other recompose helpers (`withState`, `lifecycle`, `withHandlers`, …) are **not** available – rewrite with hooks (`useState`, `useEffect`, `useCallback`).

### 4.6 Decorators must be on a top-level class

Define components at module scope instead of inside a factory function, and put decorators directly on the exported class.

```diff
-export default function createApp() {
-  @withIntl
-  @connect(state => ({ isOffline: state.network.isOffline }))
-  class App extends Component {
-    render() { ... }
-  }
-  return App;
-}
+@withIntl
+@connect(state => ({ isOffline: state.network.isOffline }))
+export default class App extends Component {
+  render() { ... }
+}
```

Update callers: `import App from './components/app'` instead of `createApp()`.

### 4.7 `preact-pwa-install` → `@zimbra-client/pwa-utils`

```diff
-import PwaInstall from 'preact-pwa-install';
+import { awaitInstallPrompt, isStandalone } from '@zimbra-client/pwa-utils';
+
+if (!isStandalone()) {
+  awaitInstallPrompt().then(prompt => { /* show custom install UI */ });
+}
```

### 4.8 `preact-router` 4.x

Host uses `preact-router#4.1.2_base_path_support`; `exec` and `useRouter` are now available from the shim:

```js
import { Router, route, exec, useRouter } from 'preact-router';
```

### 4.9 Upgraded host libraries (check your usage)

Zimlets share these via shims, so behavior follows the host version:

| Library | From → To | Watch for |
|---------|-----------|-----------|
| `react-redux` | 8 → 9 | Hooks API same; `connect` unchanged; types stricter |
| `redux` | 4 → 5 | `createStore` deprecated; action `type` must be string |
| `redux-thunk` | 2 → 3 | Named export `thunk` (no default) |
| `moment-timezone` | 0.5 → 0.6 | – |
| `@apollo/client` | pinned `3.10.0` in host | Use compatible hooks/APIs |
| `tinymce` | 7 → 8 | Plugin/config changes if your zimlet embeds TinyMCE |
| `pdfjs-dist` | 4 → 5 | ESM-only worker setup |
| `mime` | 3 → 4 | ESM only |
| `focus-trap`, `use-resize-observer`, `react-zoom-pan-pinch`, `react-markdown` (10), `lucide-preact` (1.x), `pretty-bytes` (7) | major bumps | Re-test any direct usage; many are ESM-only |

If your zimlet imports a package that is now ESM-only via `require()` in Node scripts, use dynamic `import()` or switch the script to `.mjs`.

---

## 5. Custom zimlet `package.json` checklist

```diff
 {
   "engines": {
-    "node": "^18.20.0",
-    "npm": "^6"
+    "node": "^24.18.0",
+    "npm": "^11"
   },
   "devDependencies": {
-    "@zimbra/zimlet-cli": "^18.9.0",
-    "@zimbra/eslint-config": "^2.0.0",
-    "preact-i18n": "^2.4.0-preactx",
-    "preact-context-provider": "^2.0.0-preactx.2",
-    "recompose": "^0.30.0",
-    "wiretie": "^1.1.2"
+    "@zimbra/zimlet-cli": "^20.0.0",
+    "@zimbra/eslint-config": "^3.0.0",
+    "@zimbra/preact-i18n": "^3.0.0"
   },
   "dependencies": {
+    "es-toolkit": "^1.45.1"
   }
 }
```

`@zimbra/eslint-config` v3 targets **ESLint 9 flat config**. Replace `.eslintrc*` with `eslint.config.mjs`:

```js
import zimbraConfig from '@zimbra/eslint-config';

export default [
  ...zimbraConfig,
  { ignores: ['**/build/**', '**/pkg/**', '**/node_modules/**'] }
];
```

---

## 6. Monorepo / workspaces changes (for repos that host multiple zimlets)

npm 7+ supports workspaces natively; `lerna bootstrap` and `recursive-install` were removed.

`zm-modern-zimlets/package.json`:

```diff
+  "workspaces": ["zimlets/*"],
   "scripts": {
-    "bootstrap": "is-ci && lerna bootstrap --concurrency 2 || lerna bootstrap",
-    "postinstall": "npm run bootstrap",
-    "lint": "npm run lint:modern && npm run lint:classic",
+    "lint": "eslint --cache --config eslint.config.mjs ."
   }
```

`zm-x-web/package.json`:

```diff
+  "workspaces": ["packages/@zimbra/*", "packages/@zimbra/electron-app/*"],
   "scripts": {
-    "packages:install": "npm-recursive-install --rootDir=packages",
-    "postinstall": "npm run -s packages:install",
-    "test:karma:unit": "karma start tests/unit/karma.conf.js --single-run"
+    "test:karma:unit": "karma start tests/unit/karma.conf.mjs --single-run"
   }
```

Also:
- Internal packages are now imported by package name (`import { CustomWebpackConfig } from '@zimbra/webpack-config'`) rather than a relative path.
- A new workspace `@zimbra/pwa-utils` was added (`Dockerfile` copies its `package*.json`).
- Run a single `npm install` at the repo root; **do not** `npm install` inside each zimlet folder (dependencies are hoisted to the root `node_modules`).
- Per-workspace scripts: `npm run build --workspace=zimlets/zimbra-zimlet-date` (or `-w`).
- `overrides` (npm) are used at the root to pin transitive deps (e.g. `react`/`react-dom` → `preact`, `react-popper`, `graphql-ws`). Put overrides only in the **root** `package.json`.
- CI: dependency cache paths still list each workspace's `node_modules`; drop the `remove-node-modules` step.

### Removed / archived zimlets (zm-modern-zimlets)

These legacy/classic zimlets were removed from the active build and package scripts: `zimbra-zimlet-admin-chat`, `zimbra-zimlet-admin-mail-recall`, `zimbra-zimlet-classic-chat`, `zimbra-zimlet-classic-document-editor`, `zimbra-zimlet-classic-set-default-client`, `zimbra-zimlet-classic-unsupportedbrowser`. `zimbra-zimlet-restore-contacts` moved to `archived/`. If you forked any of these, they are not built or linted by default anymore.

---

### Cloudsuite zimlets (zm-cloudsuite-zimlets, PR #120)

- Same workspaces change: `"workspaces": ["packages/*"]`; `lerna bootstrap --hoist` and the `postinstall` hook are removed.
- Per-package ESLint 6 / `eslint-config-synacor` / `prettier-eslint` devDependencies and `lint`/`test` scripts were removed. A root `eslint.config.mjs` (flat config using `@zimbra/eslint-config` v3, plus husky + lint-staged) lints everything. Delete the `eslintConfig` key and `.eslintrc.js` in your zimlet.
- `@zimbra/zimlet-cli` `^12.6.0` → `^20.0.0`, `@zimbra/x-ui` → `^13.1.0`, `@zimbra/oauth-client` `#1.5.2` → `#2.0.0`.
- Jest 25 → 29: add `jest-environment-jsdom`, set `"testEnvironment": "jsdom"`, move `testURL` into `testEnvironmentOptions.url`, and map `@zimbra-client/*` and `@zimbra/preact-i18n` to mocks in `moduleNameMapper`.
- Archived zimlets (`zimbra-zimlet-admin-dashboard`, `zimbra-zimlet-collaboration-list`, …) moved to `archived/` and are not linted/built.

---

## 7. Other Node 24 runtime considerations

- `process.binding`, `new Buffer()`, `url.parse()` and similar legacy APIs emit deprecations or have been removed in Node 24. Use `Buffer.from()`, `new URL()`.
- `fetch`, `AbortController`, `structuredClone` are built in; polyfills like `node-fetch`/`whatwg-fetch` aren't required in build scripts.
- OpenSSL 3: legacy hashes (e.g. `md4` used by older webpack 4 setups) fail – not an issue with webpack 5, but remove any `NODE_OPTIONS=--openssl-legacy-provider` workarounds.
- Native modules (`node-sass`, old `fsevents`, etc.) must be rebuilt/upgraded. Prefer `less` (already used) over `node-sass`.
- `require()` of ES modules is supported in Node 24 for sync ESM, but prefer `import`.
- Karma config is now ESM (`karma.conf.mjs`); `chai-sinon` framework was replaced – `frameworks: ['mocha']`, and import `chai`/`sinon`/`sinon-chai` explicitly in tests (chai 6, sinon 21, sinon-chai 4 are ESM-friendly).

---

## 8. Making custom Zimlets compatible with the Modern UI CSP

Related changes: [zm-x-web #6386](https://github.com/Zimbra/zm-x-web/pull/6386), [zimlet-cli #362](https://github.com/Zimbra/zimlet-cli/pull/362), [zm-modern-zimlets #1166](https://github.com/Zimbra/zm-modern-zimlets/pull/1166), [zm-cloudsuite-zimlets #126](https://github.com/Zimbra/zm-cloudsuite-zimlets/pull/126).

> ### ⚠️ Important notes
> 1. **Trust boundary for zimlets:** CSP reduces risk but does **not** make an untrusted zimlet safe. Zimlets run in the same JavaScript context as the Modern UI (the realm is *not* a security sandbox), and a zimlet can read the CSP nonce through `getCspNonce()`. **Administrators must deploy only trusted, reviewed zimlets.**
> 2. **CSP is implemented only for Modern UI.** Users of the Classic UI are **not** protected by this policy and remain exposed to the vulnerabilities CSP mitigates.

### 8.1 What changed

The reverse proxy now sends a `Content-Security-Policy` header for Modern UI (attribute `zimbraReverseProxyModernCSPPolicy`), enforced by default, and writes a fresh random nonce into every `index.html` response (replacing `{{nonce}}` in the policy). Default policy:

```
manifest-src 'self' blob:;
connect-src 'self';
default-src 'self';
script-src 'self' 'nonce-{{nonce}}';
style-src 'self' 'unsafe-inline';
img-src 'self' https: data:;
object-src 'none';
frame-ancestors 'none';
form-action 'self';
frame-src 'self';
base-uri 'self';
```

Modern UI itself:
- reads the nonce from `<meta name="csp-nonce">` once at startup, **removes the tag** from the DOM, and keeps the value in memory;
- adds the nonce to the zimlet loader script, the zimlet evaluation script, zimlet `<style>` tags and the HTML viewer CSS reset;
- no longer precaches `index.html` in the service worker (a cached copy would replay a stale nonce); navigation requests use `NetworkFirst`;
- removed `action="javascript:"` from its own forms.

### 8.2 What each directive means for your zimlet

| Directive | Effect on zimlets | Typical violation |
|-----------|-------------------|-------------------|
| `script-src 'self' 'nonce-…'` | Only same-origin scripts and scripts carrying the page nonce run. No `eval`-like inline handlers. | Injecting `<script src="https://cdn…">` without a nonce; inline `onclick="…"`; `javascript:` URLs; `<script>` with inline code |
| `default-src 'self'` | Fallback for fonts, media, workers, etc. – same origin only. | Loading web fonts / media from a CDN |
| `connect-src 'self'` | `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource` only to the same origin. | Calling a third-party REST API directly from the browser |
| `style-src 'self' 'unsafe-inline'` | Inline styles allowed; external stylesheets must be same-origin. | `<link rel="stylesheet" href="https://fonts.googleapis.com/…">` |
| `img-src 'self' https: data:` | Same-origin, any `https:` and `data:` images. | `http://` images |
| `frame-src 'self'` | iframes only to same origin. | Embedding third-party pages (YouTube, Jitsi, etc.) in an iframe |
| `form-action 'self'` | Forms may only submit to same origin; `action="javascript:"` is **blocked**. | `<form action="javascript:">` |
| `object-src 'none'` | No `<object>`, `<embed>`, plugins. | PDF/Flash embeds |
| `base-uri 'self'` | `<base href>` limited to same origin. | Injecting `<base>` |
| `frame-ancestors 'none'` | Modern UI can't be framed. | Hosting Modern UI in an iframe |
| `manifest-src 'self' blob:` | Web app manifest from same origin or blob. | – |

### 8.3 Use `@zimbra/zimlet-cli` `^20.0.0`

`getCspNonce` is exposed through the `@zimbra-client/util` shim starting with zimlet-cli 20. If you already moved to `^20.0.0` in §2, nothing more is needed. Otherwise:

```diff
 "devDependencies": {
-  "@zimbra/zimlet-cli": "^18.9.0"
+  "@zimbra/zimlet-cli": "^20.0.0"
 }
```

### 8.4 How to fix common violations

#### a) Zimlet injects a third-party `<script>` (Dropbox, Google Drive, OneDrive style)

Set the nonce on the script element. This is the fix applied in zm-cloudsuite-zimlets:

```diff
+import { getCspNonce } from '@zimbra-client/util';

 const script = document.createElement('script');
 script.src = GOOGLE_DRIVE_SCRIPT_URL;
 script.id = GOOGLE_DRIVE_SCRIPT_ID;

+const nonce = getCspNonce();
+if (nonce) {
+  script.setAttribute('nonce', nonce);
+}
 window.parent.document.head.appendChild(script);
```

Notes:
- `getCspNonce()` returns `null` when no nonce is in use (CSP off, or the proxy didn't fill it in), so always guard it.
- **Nonces are not inherited.** Scripts that a third-party SDK creates itself (e.g. an SDK that loads further scripts) won't carry the nonce and will be blocked. Check the SDK's documentation for a nonce option, or the script's host must be explicitly allowed by the administrator in the policy.
- The script's origin must also be allowed. With the default policy a nonce'd `<script src>` from any host is allowed *only* because the nonce authorizes it; `connect-src` still blocks that script's network calls to other hosts.

#### b) Dynamically added `<style>` tags

Inline styles are allowed (`'unsafe-inline'`), but add the nonce if you need to be forward-compatible with a stricter policy:

```js
const style = document.createElement('style');
const nonce = getCspNonce();
if (nonce) style.setAttribute('nonce', nonce);
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);
```

Styles imported from `.less`/`.css` in your zimlet are handled by zimlet-cli and Modern UI (nonce is added for you).

#### c) `<form action="javascript:">` → `preventDefault()`

`form-action 'self'` blocks the `javascript:` URL. Remove the `action` and prevent the default submission in the handler:

```diff
-addZimlet = () => {
+addZimlet = e => {
+  e.preventDefault();
   const { name, url } = this.state;
   ...
 };

-<form onSubmit={this.addZimlet} action="javascript:">
+<form onSubmit={this.addZimlet}>
```

#### d) Inline event handler attributes and `javascript:` URLs

```diff
-<button onclick="doSomething()">Go</button>
-<a href="javascript:doSomething()">Go</a>
+<button onClick={doSomething}>Go</button>
+<a href="#" onClick={e => { e.preventDefault(); doSomething(); }}>Go</a>
```

In JSX (Preact) use `onClick={fn}`; that's an event listener and is not affected by CSP. Strings of HTML containing `onclick=` set via `innerHTML` **are** blocked – build the DOM with `createElement` or attach listeners with `addEventListener`.

#### e) `eval`, `new Function`, string `setTimeout`

`script-src` does not include `'unsafe-eval'`. Replace them:

```diff
-setTimeout("refresh()", 1000);
+setTimeout(() => refresh(), 1000);
-const fn = new Function('a', 'return a + 1');
+const fn = a => a + 1;
```

Also check bundled libraries (old template engines, `lodash.template`, some chart/PDF libs) – use CSP-safe builds. Make sure `devtool` in your `zimlet.config.js` isn't `eval`-based for production (zimlet-cli's production build doesn't use `eval`).

#### f) Network calls to external hosts (`connect-src 'self'`)

Browser calls to third-party APIs are blocked. Options, in order of preference:
1. Route the call through the Zimbra server (a server extension / existing Zimbra proxy endpoint) so the browser only talks to the same origin.
2. If a third-party API is genuinely required, an **administrator** must explicitly add the host to `connect-src` in `zimbraReverseProxyModernCSPPolicy` – and accept the added risk.

#### g) External stylesheets, fonts, iframes, images

- Bundle fonts/CSS with the zimlet (same origin) instead of loading from CDNs.
- `http://` images are blocked; use `https:` or `data:` URLs.
- Third-party iframes are blocked by `frame-src 'self'`; open the page in a new tab (`openExternalBrowser` from `@zimbra-client/browser`) or have the admin add the host to `frame-src`.

### 8.5 Policy for administrators

- Attribute: `zimbraReverseProxyModernCSPPolicy`. Keep `{{nonce}}` inside `script-src` (`'nonce-{{nonce}}'`); the proxy replaces it per response.
- Only loosen the policy per host when really needed (e.g. add the specific Dropbox/Google/Microsoft host to `connect-src` / `frame-src`); avoid `'unsafe-inline'` / `'unsafe-eval'` in `script-src`.
- After changing the policy, reload the proxy and hard-refresh the browser.

### 8.6 Testing your zimlet locally with CSP

The `zm-x-web` dev server applies the production default policy with a fixed nonce so you see violations during development:

| Env var | Values | Meaning |
|---------|--------|---------|
| `CSP_MODE` | `enforce` (default) \| `report-only` \| `off` | Enforce, report only (`Content-Security-Policy-Report-Only`), or disable the header |
| `CSP_POLICY` | custom string | Override the default policy; `{{nonce}}` is replaced with the fixed dev nonce |

```bash
# See violations without breaking the page
CSP_MODE=report-only npm start

# Try your own policy
CSP_POLICY="default-src 'self'; script-src 'self' 'nonce-{{nonce}}'; connect-src 'self' https://api.example.com" npm start
```

Open the browser DevTools → Console; violations read `Refused to load the script '…' because it violates the following Content Security Policy directive: …`. Fix every one before shipping.

Paths proxied to the Zimbra server (`/@zimbra/…`, `/json/…`, `/user_uploads/…`, `/external_content/…`) get no CSP header locally, same as in production.

**Sideloader zimlet (development only):** when CSP is enabled, loading a zimlet bundle from your local webpack dev server through the sideloader works only if that URL is in `connect-src`. The dev-server default policy already includes `https://localhost:8081/index.js`; for a deployed environment the admin must add it to the policy:

```
connect-src 'self' https://localhost:8081/index.js;
```

Do not allow this in production.

### 8.7 Bundled zimlets (what we already did)

- `zm-modern-zimlets`: all zimlets bumped to `@zimbra/zimlet-cli ^20.0.0`; Sideloader form no longer uses `action="javascript:"`; `zimbra-zimlet-user-feedback` (loaded an external feedback form) was **deprecated and moved to `archived/`**.
- `zm-cloudsuite-zimlets`: Dropbox, Google Drive and OneDrive set the nonce on the third-party SDK `<script>` they inject; all packages bumped to zimlet-cli `^20.0.0`.

### 8.8 CSP checklist for custom zimlets

- [ ] Upgrade to `@zimbra/zimlet-cli@^20.0.0`.
- [ ] Add `nonce` (from `getCspNonce()`) to every dynamically created `<script>` (and `<style>` where appropriate).
- [ ] Remove `action="javascript:"` from forms; call `e.preventDefault()`.
- [ ] Remove inline `on*` HTML attributes, `javascript:` URLs, `eval`, `new Function`, string timers.
- [ ] Replace direct third-party `fetch`/XHR/WebSocket calls with same-origin/server-proxied calls (or get an admin allowlist).
- [ ] Bundle fonts/CSS/images locally; no third-party iframes.
- [ ] Run with `CSP_MODE=enforce` and verify there are **no** console violations.
- [ ] Confirm with the administrator that only trusted zimlets are deployed, and that Classic UI is not assumed to be covered.

---

## 9. Migration checklist

- [ ] Install Node 24.18+ and npm 11.12+ (`nvm use`), update `.nvmrc`, Dockerfile, CI images.
- [ ] Bump `engines` and `@zimbra/zimlet-cli` to `^20.0.0`, `@zimbra/eslint-config` to `^3.0.0`.
- [ ] Delete `node_modules` + `package-lock.json`; run `npm install` once; resolve any `ERESOLVE` errors.
- [ ] Replace `preact-i18n` → `@zimbra/preact-i18n` (imports and `package.json`).
- [ ] Replace `context.zimletRedux` → `context.store.zimletRedux`.
- [ ] Remove legacy-context usage (`(props, context)`), pass values via props / hooks.
- [ ] Remove `preact-context-provider`, `wiretie`, `recompose`, `preact-pwa-install` usages.
- [ ] Move decorators to top-level classes; import `createElement` in all JSX files.
- [ ] Replace `url-loader`/`raw-loader` usage in `zimlet.config.js` with asset modules (§3.2.1).
- [ ] Remove Babel config / dependencies.
- [ ] Replace `NODE_ENV=development` watch behavior with `zimlet watch` / `--watch`.
- [ ] Migrate ESLint to flat config (`eslint.config.mjs`).
- [ ] Update CI cache key and remove `npm@6` install steps.
- [ ] Make the zimlet CSP-compliant (§8.8).
- [ ] Run `npm run build` / `zimlet package` and smoke-test the zimlet in a Zimbra Modern UI 24-era build.

---

## 10. Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| `npm ERR! ERESOLVE could not resolve` | npm 7+ strict peers. Align versions; temporary: `npm install --legacy-peer-deps`. |
| `Cannot find module 'preact-i18n'` / `'recompose'` / `'wiretie'` | Removed shims – follow §4. |
| `Unexpected token` on `export Foo from './foo'` | Babel-only syntax; use `export { default as Foo } from './foo'`. |
| `React is not defined` / `createElement is not a function` | Add `import { createElement } from 'preact';`. |
| `Decorators are not valid here` | Decorator on a class declared inside a function; hoist to module scope (§4.6). |
| `Error executing transformer at .../zimlet.config.js` | Check the error text; avoid top-level `await`; replace `url-loader` (§3.2.1). |
| `Cannot read properties of undefined (reading 'notify')` / `this.context` is undefined | Legacy context removed – pass `notify`, clients etc. as props or use `getContext` (§4.2.1). |
| `Cannot read properties of undefined (reading 'actions')` on `zimletRedux` | Use `context.store.zimletRedux` (§4.2). |
| `Warning: missing export "X" from shim` | Your zimlet-cli version is older than the host – upgrade to `@zimbra/zimlet-cli@^20`. |
| `lerna bootstrap` / `npm-recursive-install` not found | Replaced by workspaces – run `npm install` at the root. |
| `Refused to load the script … violates the following Content Security Policy directive` | Add nonce via `getCspNonce()` (§8.4a). |
| `Refused to connect … connect-src` | Same-origin/proxy the call or admin allowlist (§8.4f). |
| `Refused to send form data … form-action` | Remove `action="javascript:"` (§8.4c). |
| `npm ci` fails with lockfile out of sync | Regenerate lockfile with npm 11 and commit it. |
