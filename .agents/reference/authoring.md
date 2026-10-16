# Authoring a Modern UI Zimlet: minimum requirements and patterns

Practical guidance for writing a Zimlet that runs in `zm-x-web`. It links to the focused files for each topic instead of repeating them. The index of all files is in the root [AGENTS.md](../../AGENTS.md#topic-to-file-map). Follow the [creation workflow](../workflow/create-zimlet.md) for the task sequence and the [authoring rules](../rules/authoring.md) for requirements; this file holds supporting information and examples.

Working examples: the live Zimlets in [zm-modern-zimlets](../../../zm-modern-zimlets/zimlets/) (`zimlets/*`) and [zm-cloudsuite-zimlets](../../../zm-cloudsuite-zimlets/packages/) (`packages/*`). Read their code when this file and the linked references do not answer a question. Layout and workflows: [zimlet-repositories.md](../../../zm-modern-zimlets/.agents/reference/zimlet-repositories.md).

## 1. Minimum package

```
<zimlet-name>/
  package.json         # name, version, main, module, scripts, devDependency @zimbra/zimlet-cli
  src/index.js         # default export: factory(context)
  src/intl/en_US.json  # at least: { "zimlet": { "label": "...", "description": "..." } }
  config_template.xml  # optional (admin-editable settings)
  scripts/postinst.sh  # only for repos that ship OS packages
```

`package.json` essentials (real example: [zimbra-zimlet-personal-notes](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-personal-notes/package.json)):

```json
{
  "private": true,
  "name": "zimbra-zimlet-<feature>",
  "version": "1.0.0",
  "main": "build/index.js",
  "module": "src/index.js",
  "scripts": {
    "build": "zimlet build",
    "watch": "zimlet watch",
    "start": "zimlet watch",
    "package": "zimlet package --name $npm_package_name --pkg-version $npm_package_version --zimbraXVersion '^4.42.0'"
  },
  "devDependencies": { "@zimbra/zimlet-cli": "^19.0.0" }
}
```

`module` is what the CLI uses as the author entry (`module` → `jsnext:main` → `main`). Node 24 is required by every repo. To run a Zimlet in dev mode, use `npm start` (it runs `zimlet watch`, like the `watch` script) and load it with the sideloader; see [development loading](./cli-commands.md#development-loading-no-packaging).

### Starting from the default template

[zm-x-zimlet-template-default](../../../zm-x-zimlet-template-default) is the scaffold behind `zimlet create default <dest>` (equivalent: `zimlet create zimbra/zm-x-zimlet-template-default <dest>`). Only its `template/` folder is copied, and every `{{name}}` placeholder in non-media files is replaced with the zimlet name (package name, i18n namespace, route slug).

| File | Purpose |
|---|---|
| `package.json` | Scripts `build`, `watch`/`start`, `package`, `lint`, `security:audit`; `main`/`module` as above. |
| `src/index.js` | Factory registering `slot::email-tab-item` (a Mail tab menu item) and `slot::routes` (a route at `/<email slug>/<name>`). |
| `src/components/app/` | The routed component (`App`) and its `style.less` (CSS Modules). |
| `src/enhancers.js`, `src/intl/en_US.json` | `withIntl()` wrapper and the English strings (namespace = zimlet name). |
| `src/constants/index.js` | `SLUG`, used in the route and menu href. |
| `zimlet.config.js` | Empty webpack hook with examples (see [cli-commands.md](./cli-commands.md#customizing-webpack)). |
| `.eslintrc.js`, `.editorconfig`, `.circleci/config.yml` | Lint, editor and CI defaults. |

The template was last updated in 2022 and lags the current CLI and host; see [known-issues.md](./known-issues.md) before using it unchanged.

## 2. Factory and lifecycle

```js
import { createElement } from 'preact';          // mandatory in every file containing JSX

export default function Zimlet(context) {
  const { plugins } = context;
  return {
    init() {
      plugins.register('slot::message-body-top',
        ({ emailData }) => <NoteBlock emailData={emailData} />);
    }
  };
}
```

- Real example: [zimbra-zimlet-email-reminder](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-email-reminder/src/index.js) has the same default-export factory and registers a slot inside `init()`. It returns an `exports` object with `init`, which is the form most live Zimlets use.
- The rules for lifecycle code are in [authoring.md](../rules/authoring.md#factory-and-lifecycle).
- Default export is called with the [context](../../../zm-x-web/.agents/zimlet/reference/context-and-shims.md) (via `new` if the function is constructible, otherwise as a plain call).
- `init()` runs once, only if the zimlet is not disabled for the account. Register all plugins there. Other timing facts, including the unverified `unload()/destroy()` behaviour: [runtime.md](../../../zm-x-web/.agents/zimlet/reference/runtime.md).
- Zimlets that need async setup (for example an OAuth lookup) register their plugins later from a promise inside `init()`, as Dropbox does.
- Register conditionally and undo with `plugins.unregister(name, sameHandlerReference)`.

## 3. Registration channels

For `plugins.register` patterns and recommended examples, use
[zimlet-examples.md](../../../zm-modern-zimlets/.agents/reference/zimlet-examples.md). The channels below are
separate from those registration patterns.

| Need | How | Reference |
|---|---|---|
| React to app actions (send, logout, invite reply) | `zimletEventEmitter.on(ZIMBRA_ZIMLET_EVENTS.X, fn[, isAsync])` | [context and shims §4](../../../zm-x-web/.agents/zimlet/reference/context-and-shims.md) |
| Modal outside own DOM | dispatch `addModal` (Redux `zimlets` slice) | [runtime.md](../../../zm-x-web/.agents/zimlet/reference/runtime.md#redux-bridge) |

Handler semantics (from `ZimletSlot` and `invokePlugin`): a function handler is called with the slot props (`payload` object) and its return value is rendered; a non-function value is rendered as-is; a returned function is turned into an element with the same props; exceptions are isolated per handler. Handlers run inline while the slot renders, so any hooks inside attach to the slot. Keep hook calls unconditional, or return an element of a real component for stateful UI.

## 4. What you may import

Only the shimmed modules ([list](../../../zm-x-web/.agents/zimlet/reference/context-and-shims.md#2-shimmed-modules-what-a-zimlet-may-import)) resolve to host singletons. Everything else you import is bundled into your `index.js`. `react`, `react-dom`, `preact` and `@apollo/client` are aliased to the host's. Import rules: [authoring.md](../rules/authoring.md#imports).

Icons: `icon` props (for example on `MenuItem`) take a **component** from `lucide-preact` (`import { LinkIcon } from 'lucide-preact'`, bundled into the zimlet). String icon names are not supported by the host `Icon` component (it logs `Icon => received name as string`).

## 5. Styles

- `.less`/`.css` under `src/components`, `src/screens`, `src/pages` → CSS Modules (`import style from './style.less'; <div class={style.box}/>`).
- Other style files are global.
- Shared global style variables and palette values come from the `zm-x-ui` repo: [README.md](../../../zm-x-ui/README.md), [`css-variables.css`](../../../zm-x-ui/css-variables.css), [`palette.css`](../../../zm-x-ui/palette.css), and [`variables.less`](../../../zm-x-ui/variables.less). Prefer these when they fit the design—for example, `var(--spacing-md)` or `var(--text-color)`—but treat this as guidance, not a hard requirement; use a local value when appropriate.
- `@zimbra/x-ui` is the public package of `zm-x-ui` (npm and GitHub). Add it to the Zimlet's `dependencies` (existing Zimlets use `"@zimbra/x-ui": "^13.1.0"`) and import it in a `.less` file: `@import '~@zimbra/x-ui/variables.less';` or `refs.less` for variables such as `@brand-primary`, and `helpers.less` for mixins. It is not a shimmed module, so it is bundled into the Zimlet. See `zimbra-zimlet-custom-fonts` and `zimbra-zimlet-calendar-subscription` for usage.
- Both are injected by the host via `context.styles.set`, so styles live in the host `<head>`, not in the iframe.

## 6. Localization

1. `src/intl/en_US.json` (mandatory fallback) with a namespace equal to the zimlet name plus the `zimlet` label block:
   ```json
   { "<zimlet-name>": { "title": "…" }, "zimlet": { "label": "…", "description": "…" } }
   ```
2. `src/enhancers.js`:
   ```js
   import { withIntlWrapper } from '@zimbra-client/enhancers';
   export const withIntl = () => withIntlWrapper({
     importFn: locale => import(/* webpackMode: "eager" */ `./intl/${locale}.json`),
     showLoader: false
   });
   ```
3. Wrap components with `withIntl()(Component)` and use `<Text id="<zimlet-name>.title" />` from `@zimbra/preact-i18n`.
   `withIntlWrapper` and `withZimletIntlWrapper` are the same function: the host `shims.js` exports both names under `@zimbra-client/enhancers` (`withZimletIntlWrapper: withIntlWrapper`). The default template uses `withZimletIntlWrapper`; the zimlets in `zm-modern-zimlets` that have an `enhancers.js` use `withIntlWrapper`. Either works.
4. Add other locales as `src/intl/<locale>.json`. Translation workflow and locale lists: each repo's `AGENTS.md` and `.agents/translation/config.yml` (uses the sibling [zm-frontend-ai-skills](../../../zm-frontend-ai-skills) repository and its `zimbra-translation` skill).

## 7. API calling

Use the host's [context and shims reference](../../../zm-x-web/.agents/zimlet/reference/context-and-shims.md) to find available context fields, imports, and API hooks. Prefer an existing host operation or hook when it covers the need.

- **Custom GraphQL:** When no existing host operation fits, use `context.getApolloClient()` for a custom query or mutation. This requires GraphQL and host-schema knowledge. Check `@zimbra-client/graphql` for prebuilt queries, mutations, and HOCs first. `@apollo/client` is host-shimmed, so do not add it as a package dependency.
- **Ready-made GraphQL hooks:** Prefer a suitable hook from `@zimbra-client/hooks/graphql` (or `@zimbra-client/hooks`) when one already performs the operation. Import and call the hook directly; you do not need to write a query with `useQuery` or add a GraphQL/Apollo dependency. The [context and shims reference §2](../../../zm-x-web/.agents/zimlet/reference/context-and-shims.md#2-shimmed-modules-what-a-zimlet-may-import) indexes the available hooks and exports.
- **Zimbra SOAP API:** For operations not covered by a suitable host hook or GraphQL operation, use `context.zimbraBatchClient.jsonRequest({ name, body })`. This sends a JSON-formatted SOAP request directly; it is not a GraphQL query.
- **REST or custom endpoints:** Use a `fetch`-based helper with the credentials and CSRF handling required by the endpoint. The org-chart Zimlet shows the plain pattern: origin from `context.zimbraOrigin`, token from `context.csrfToken` sent in the `X-Zimbra-Csrf-Token` header, `credentials: 'include'`, and Zimbra SOAP as JSON with `POST /service/soap/<Request>` ([fetchrequest.js](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-org-chart/src/api/fetchrequest.js), [index.js](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-org-chart/src/api/index.js)). The [FetchRequest helper](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-chat/src/api/fetch-request.js) of the chat Zimlet adds a product-specific extension proxy path (`/service/extension/chatproxy`); a generic proxy path option is not needed.

## 8. Data and state

- Redux: `store.zimletRedux.injectAsyncReducer/addActions/addSelectors`. See [context and shims §3](../../../zm-x-web/.agents/zimlet/reference/context-and-shims.md).
- Per-account or admin config: [config_template.xml](./packaging-deployment.md#2-config_templatexml-admin-editable-settings) or mailbox metadata hooks (`useCustomMetaData`).
- Platform checks (web vs desktop vs mobile): `getPlatformType()` / `PLATFORM_TYPES` from `@zimbra-client/platform`.

## 9. Non-Preact UI

Possible, with trade-offs. A factory can be headless (events, network calls, DOM), and React code works through the `preact/compat` alias (limits in [known-issues.md](./known-issues.md#zimlet-cli)). Mounting another framework (Vue, Svelte) or a vanilla widget imperatively into a container element returned from a handler is **unverified**: it comes from reading the host code only, and was not built or run (open claim `UC-P01-02` in [zimlet-documentation-claims.md](../plans/zimlet-documentation-claims.md)). If it works, you bundle the framework yourself, get no automatic re-render on slot prop changes, and have no shared Preact context. The runtime runs them in a **shared, same-origin iframe (no security boundary)**; the only `postMessage` use found in `zm-x-web` is the `USER_ACTIVITY` idle-timer signal.
