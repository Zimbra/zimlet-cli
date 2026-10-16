# Zimlet architecture in Modern UI: overview

Audience: front-end engineers who must understand how Zimlets are built, shipped, loaded and how they talk to the host. This file is the **overview**. Each topic has a focused file (linked below) so tools can load only what they need. Entry point for this material: the root [AGENTS.md](../../AGENTS.md).

All repositories are assumed to be **siblings** in one parent folder. Every link in these files is relative to the file containing it.

| Repo | Role | Guide / reference |
|---|---|---|
| [zm-x-web](../../../zm-x-web) | Modern UI host (Preact SPA). Contains the **Zimlet Manager runtime** and all slots. | [runtime.md](../../../zm-x-web/.agents/zimlet/reference/runtime.md) |
| [zimlet-cli](../..) | `zimlet` CLI: `create`, `watch`, `build`, `package`. Compile-time shim aliasing. | [cli-commands.md](./cli-commands.md) |
| [zm-modern-zimlets](../../../zm-modern-zimlets) and [zm-cloudsuite-zimlets](../../../zm-cloudsuite-zimlets) | Monorepos of product-feature and service-integration Zimlets. | [Zimlet monorepos](./zimlet-repositories.md) |
| [zm-x-ui](../../../zm-x-ui) | Shared LESS variables and mixins used by `zm-x-web` and Zimbra X Zimlets; also provides CSS variables recommended for Zimlets. | [README.md](../../../zm-x-ui/README.md), [css-variables.css](../../../zm-x-ui/css-variables.css), [palette.css](../../../zm-x-ui/palette.css), [variables.less](../../../zm-x-ui/variables.less) |
| Zimbra server | Stores zimlets, enables them per COS/user, serves the consolidated bundle. | [packaging-deployment.md](./packaging-deployment.md) §3 |
| [zm-x-zimlet-template-default](../../../zm-x-zimlet-template-default) | Default scaffold used by `zimlet create`. | [authoring.md](./authoring.md#starting-from-the-default-template) |
| [zm-frontend-ai-skills](../../../zm-frontend-ai-skills) | Agent skills shared by the front-end repos. The `zimbra-translation` skill (add a language, fix or sync translations, audit) is what both zimlet repos' `AGENTS.md` point to; it reads each repo's `.agents/translation/config.yml`. | [SKILL.md](../../../zm-frontend-ai-skills/skills/zimbra-translation/SKILL.md) |
| [zm-x-oauth-client](../../../zm-x-oauth-client) | `@zimbra/oauth-client` (v2.0.0): JS client for the server's OAuth extension (`/service/extension/oauth2`). Exports `OAuthClient` (`getInfo`, `getCredentials`, `getIdentifiers`, `removeCredentials`, `buildProxyUrl`), `AuthorizeRoute`, `oauthRouter` and `AuthorizeWindowOpener`. A dependency of the cloud zimlets (Dropbox, Google Drive, OneDrive, Slack, Zoom), bundled into each. | [README.md](../../../zm-x-oauth-client/README.md) |

## 1. Big picture

```
 zm-modern-zimlets / zm-cloudsuite-zimlets         zimlet-cli
   zimlets/<name>/src/index.js  ── zimlet build ─▶  webpack (esbuild) ─▶ build/index.js (+css, assets)
                                   zimlet package ─▶ <name>.xml + <name>*.properties ─▶ pkg/<name>.zip
                                                              │ zmzimletctl deploy (or admin console)
                                                              ▼
                                  Zimbra server: LDAP zimlet entry + COS/user presence
                                  GET /service/zimlet/res/Zimlets-nodev_all.zgz?zimbraXZimletCompatibleWith=<zm-x-web version>
                                                              │
                                                              ▼
                              zm-x-web: ZimletLoader ─▶ zimletManager.loadZimletByUrls
                                        split bundle ─▶ run each in shared same-origin iframe
                                        global zimlet(factory) ─▶ factory(context) ─▶ init() ─▶ plugins.register(...)
                                        ZimletSlot / invokePlugin render the registrations in host screens
```

Development replaces the server bundle step with the **sideloader** zimlet that calls the same `loadZimletByUrls` with the `zimlet watch` URL.

## 2. Runtime in one page

Details and caveats: [runtime.md](../../../zm-x-web/.agents/zimlet/reference/runtime.md).

1. `App` creates one `zimletManager` and exposes it as `context.zimlets`.
2. `ZimletLoader` fetches the consolidated bundle. The server includes only zimlets enabled for the user and whose `zimbraXZimletCompatibleSemVer` range satisfies the host version.
3. The bundle is split by the `/* Zimlet: <name>File: … */` markers; each part is evaluated through a `<script>` tag inside **one shared, same-origin, off-screen iframe**. That gives scope hygiene (no accidental globals, own `window`), not a security sandbox. All zimlets share the iframe.
4. The CLI-generated entry calls the global `zimlet(factory)`. The manager builds `zimletContext` and instantiates the factory (`new` if constructible, otherwise a plain call).
5. `ZimletLoader` calls `init()` for each zimlet not marked `disabled` in `accountZimlets`.
6. `plugins.register('slot::<name>', handler)` fills host slots. `ZimletSlot` re-renders on `plugins::changed`.

## 3. How host and zimlet communicate

Because the iframe is same-origin and the code is evaluated in the host's JS engine, there is no RPC layer. The channels are:

1. **Direct references** handed over in `zimletContext` (Apollo client getter, Redux `store`, batch client, `plugins`, `styles`, …): [context and shims](../../../zm-x-web/.agents/zimlet/reference/context-and-shims.md).
2. **Build-time shimming**: zimlet-cli aliases `preact`, `@apollo/client`, `react-redux`, `@zimbra-client/*`, … to generated modules that re-export from `global.shims[...]`, which is the host `shims` object. Zimlets therefore share the host's library instances. [Compile side](./cli-commands.md#build-pipeline-configure-in-srcindexjs), [host side](../../../zm-x-web/.agents/zimlet/reference/context-and-shims.md#2-shimmed-modules-what-a-zimlet-may-import).
3. **Plugin registry**: `plugins.register` / `invokePlugin` / `ZimletSlot`, plus bare-key channels such as `settings` and `messageProcessors:*`: [slot-behavior.md](../../../zm-x-web/.agents/zimlet/reference/slot-behavior.md), [catalog](../../../zm-x-web/.agents/zimlet/context/zimlet-slots.yml), [verticals](../../../zm-x-web/.agents/zimlet/reference/verticals.md).
4. **Shared Redux store**: `store.zimletRedux` (dynamic reducers/actions/selectors) and the `zimlets` slice (modals, conditional slots, labels).
5. **Host application events**: `zimletEventEmitter` + `ZIMBRA_ZIMLET_EVENTS` (`ONBEFORESEND`, `ONSEND`, `AFTERONSEND`, `ONSENDINVITEREPLY`, `LOGOUT`). Separate from the manager's own `mitt` events (`init`, `plugins::changed`, `zimlets-initialized`).

One `postMessage` use exists: a zimlet may post `USER_ACTIVITY` to reset the idle-session timer ([idle-session-notifier](../../../zm-x-web/src/components/idle-session-notifier/index.js)). It is not a general channel.

## 4. Role of zimlet-cli

Compile-time only. It is the single tool a zimlet author needs: it hides webpack, rewrites host-library imports to runtime lookups, collects CSS into `ZIMLET_STYLES` (the host injects it), and produces the zip/XML that Zimbra understands. Commands, options and pipeline: [cli-commands.md](./cli-commands.md). Packaging output and server contract: [packaging-deployment.md](./packaging-deployment.md).

## 5. Dev-time vs prod-time

**Dev**: `npm run watch` in the zimlet → `https://localhost:8081/index.js` (accept the self-signed certificate) → sideloader page in Modern UI → same load path as production. Saving a file triggers webpack HMR; `entry.js` re-calls `zimlet(factory)`, and the manager's replacement performs shutdown → setup → init (soft restart, iframe kept).

**Prod**: `zimlet build` → `zimlet package` → deploy zip (`zmzimletctl` or admin console) → enable per COS/user → Modern UI receives it in the consolidated bundle. Server packaging and deployment are covered in [packaging-deployment.md](./packaging-deployment.md).

## 6. Zimlet source repositories

Both `zm-modern-zimlets` and `zm-cloudsuite-zimlets` contain Zimlets built with
the same `zimlet-cli` tool and loaded through the same `zm-x-web` runtime.
`zm-modern-zimlets` primarily holds product features; `zm-cloudsuite-zimlets`
primarily holds integrations with external services and also maintains shared
cloud-integration components. See each repository's own guide for its layout
and workflows.

## 7. Where to read next

| Question | File |
|---|---|
| How do I write one? | [authoring.md](./authoring.md) |
| Which slot do I use? | [zimlet-slots.yml](../../../zm-x-web/.agents/zimlet/context/zimlet-slots.yml), [slot-behavior.md](../../../zm-x-web/.agents/zimlet/reference/slot-behavior.md) |
| What can I import / what is in `context`? | [context-and-shims.md](../../../zm-x-web/.agents/zimlet/reference/context-and-shims.md) |
| New top-level tab (Chat, Video, Cloud, Integrations) | [verticals.md](../../../zm-x-web/.agents/zimlet/reference/verticals.md) |
| Which registration pattern and real Zimlet should I use? | [zimlet-registration-patterns.md](./zimlet-registration-patterns.md) |
| How are the Zimlet monorepos organized? | [zimlet-repositories.md](./zimlet-repositories.md) |
| Which CLI command or option should I use? | [cli-commands.md](./cli-commands.md) |
| Why does my zimlet not appear on the server? | [packaging-deployment.md](./packaging-deployment.md) §3 |
| What known template, CLI, or host gaps should I check? | [needs-attention.md](./needs-attention.md) |
