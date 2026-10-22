# Zimlet architecture in Modern UI: overview

Audience: Developers who wants to understand how Zimlets are built, shipped, loaded and how they talk to the host. This file is the **overview**. Each topic has a focused file (linked below) so tools can load only what they need. Entry point for this material: the root [AGENTS.md](../../AGENTS.md).

All repositories are assumed to be **siblings** in one parent folder. Every link in these files is relative to the file containing it.

| Repo | Role | Guide / reference |
|---|---|---|
| [zm-x-web](../../../zm-x-web) | Modern UI host (Preact SPA). Contains the **Zimlet Manager runtime**, context and all slots. `ZimletLoader` fetches the consolidated bundle, `zimletManager` splits it per zimlet and runs each part in one shared same-origin iframe, then calls the global `zimlet(factory)` and `init()`. Zimlets fill host slots through `plugins.register`. | [zimlet.md](../../../zm-x-web/.agents/zimlet/reference/zimlet.md) |
| [zimlet-cli](../..) | Compile-time only. The single tool a zimlet author needs: hides webpack, rewrites host-library imports to runtime lookups, collects CSS into `ZIMLET_STYLES` (the host injects it), and produces the zip/XML that Zimbra understands. Commands: `create`, `watch`, `build`, `package`. | [cli-commands.md](./cli-commands.md), [packaging-deployment.md](./packaging-deployment.md) |
| [zm-modern-zimlets](../../../zm-modern-zimlets) and [zm-cloudsuite-zimlets](../../../zm-cloudsuite-zimlets) | Monorepos built with `zimlet-cli` and loaded through the same `zm-x-web` runtime. `zm-modern-zimlets` primarily holds product features; `zm-cloudsuite-zimlets` primarily holds integrations with external services and shared cloud-integration components. | [Zimlet monorepos](../../../zm-modern-zimlets/.agents/reference/zimlet-repositories.md), [authoring.md](./authoring.md#starting-from-the-default-template) |
| [zm-x-ui](../../../zm-x-ui) | Shared LESS variables and mixins used by `zm-x-web` and Zimbra X Zimlets; also provides CSS variables recommended for Zimlets. | [README.md](../../../zm-x-ui/README.md), [css-variables.css](../../../zm-x-ui/css-variables.css), [palette.css](../../../zm-x-ui/palette.css), [variables.less](../../../zm-x-ui/variables.less) |
| [Zimbra server](../../../zm-mailbox) | Stores zimlets, enables them per COS/user, serves the consolidated bundle. | [packaging-deployment.md §3](./packaging-deployment.md#3-server-contract) |
| [zm-x-zimlet-template-default](../../../zm-x-zimlet-template-default) | Default scaffold used by `zimlet create`. | [authoring.md](./authoring.md#starting-from-the-default-template) |
| [zm-frontend-ai-skills](../../../zm-frontend-ai-skills) | Agent skills shared by the front-end repos. The `zimbra-translation` skill (add a language, fix or sync translations, audit) is what both zimlet repos' `AGENTS.md` point to; it reads each repo's `.agents/translation/config.yml`. | [SKILL.md](../../../zm-frontend-ai-skills/skills/zimbra-translation/SKILL.md) |
|  |

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

## 2. How host and zimlet communicate

Because the iframe is same-origin and the code is evaluated in the host's JS engine, there is no RPC layer. The channels are:

1. **Direct references** handed over in `zimletContext` (Apollo client getter, Redux `store`, batch client, `plugins`, `styles`, …): [context and shims](../../../zm-x-web/.agents/zimlet/reference/context-and-shims.md).
2. **Build-time shimming**: zimlet-cli aliases `preact`, `@apollo/client`, `react-redux`, `@zimbra-client/*`, … to generated modules that re-export from `global.shims[...]`, which is the host `shims` object. Zimlets therefore share the host's library instances. [Compile side](./cli-commands.md#build-pipeline-configure-in-srcindexjs), [host side](../../../zm-x-web/.agents/zimlet/reference/context-and-shims.md#2-shimmed-modules-what-a-zimlet-may-import).
3. **Plugin registry**: `plugins.register` / `invokePlugin` / `ZimletSlot`, plus bare-key channels such as `settings` and `messageProcessors:*`: [slot-behavior.md](../../../zm-x-web/.agents/zimlet/reference/slot-behavior.md), [catalog](../../../zm-x-web/.agents/zimlet/context/zimlet-slots.yml), [verticals](../../../zm-x-web/.agents/zimlet/reference/verticals.md).
4. **Shared Redux store**: `store.zimletRedux` (dynamic reducers/actions/selectors) and the `zimlets` slice (modals, conditional slots, labels).
5. **Host application events**: `zimletEventEmitter` + `ZIMBRA_ZIMLET_EVENTS` (`ONBEFORESEND`, `ONSEND`, `AFTERONSEND`, `ONSENDINVITEREPLY`, `LOGOUT`). Separate from the manager's own `mitt` events (`init`, `plugins::changed`, `zimlets-initialized`).

**Server API reference.** For the endpoints and operations that a Zimlet calls on the Zimbra server, such as the requests it sends with the batch client, use the [Zimbra SOAP API reference (10.1.0)](https://files.zimbra.com/docs/soap_api/10.1.0/api-reference/index.html). Check each request and field there instead of describing the server API from memory.

One `postMessage` use exists: a zimlet may post `USER_ACTIVITY` to reset the idle-session timer ([idle-session-notifier](../../../zm-x-web/src/components/idle-session-notifier/index.js)). It is not a general channel.

## 3. Dev-time vs prod-time

**Dev**: `npm start` in the zimlet → `https://localhost:8081/index.js` (accept the self-signed certificate) → sideloader page in Modern UI → same load path as production. Saving a file rebuilds the bundle that the dev server serves, but the dev server runs with `client: false` and sends no update to the browser, so an open Modern UI page keeps the old code until it is reloaded. With *Persist on Reload* ticked, the sideloader loads the new bundle on that reload. The soft restart path (`entry.js` re-calls `zimlet(factory)`, and the manager's replacement performs shutdown → setup → init, iframe kept) exists but is not triggered by a save.

**Prod**: `zimlet build` → `zimlet package` → deploy zip (`zmzimletctl` or admin console) → enable per COS/user → Modern UI receives it in the consolidated bundle. Server packaging and deployment are covered in [packaging-deployment.md](./packaging-deployment.md).
