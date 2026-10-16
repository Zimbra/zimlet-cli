# Zimlet registration patterns

Entry point for documenting **how a Zimlet registers with Modern UI** (`zm-x-web`): which `plugins.register` styles exist, which Zimlets use each, and which slots or keys they fill. It covers registration style and its data only, not what the registered components render.

The data is in [zimlet-registration-patterns.yml](../context/zimlet-registration-patterns.yml). This file explains how to read it and records what the research found. It does not repeat the Zimlet and slot lists; follow the links to the YAML.

Facts below come from the sources of 43 Zimlets (36 in `zm-modern-zimlets`, 7 in `zm-cloudsuite-zimlets`; `zimbra-cloud-common` is a library and folders without `src/index.js` are skipped). For workspace layout and repository-specific workflows, see [Zimlet monorepos](./zimlet-repositories.md), with separate sections for [zm-modern-zimlets](./zimlet-repositories.md#zm-modern-zimlets) and [zm-cloudsuite-zimlets](./zimlet-repositories.md#zm-cloudsuite-zimlets).

## How to use it for documentation

1. Pick the pattern in the table below and open its entry in the YAML (`patterns[].id`).
2. Read `summary`, `hostSide`, `variants` and `notes`. Use `recommendedExample` unless a variant needs a different one.
3. Open the Zimlet's `src/index.js` (`zimlets[].index`, or `patterns[].usages[]` → the Zimlet's entry) and build the example from it. Do not copy a whole file; keep the registration and what it needs.
4. For the host side, open the `hostSide` references and the entry in the [slot catalog](../../../zm-x-web/.agents/zimlet/context/zimlet-slots.yml). The catalog is a reference for the host half of the picture (which component renders the slot, which props it passes, how `invokePlugin` results are consumed). Slot names in the YAML are recorded as the Zimlet registers them and are not checked against the catalog.
5. Verify the example with the [zimlet-doc-verify](../skills/zimlet-doc-verify/SKILL.md) skill before it goes into a page.

A Zimlet usually combines patterns. `zimlets[].registrations[].pattern` and `zimlets[].modifiers` show the combination per Zimlet. For example, `zimbra-zimlet-attachment-missing-alert` uses a slot, a settings companion slot and a settings registration; `zimbra-zimlet-video-call-preferences`, `zimbra-zimlet-zoom`, `zimbra-zimlet-slack` and the cloud-storage Zimlets each mix three.

## Registration patterns

These say **what** is registered and under which key.

| Pattern id | Key used | What it does | Recommended example |
|---|---|---|---|
| `slot-ui` | `slot::<name>` | Fills a host slot with UI. | [personal-notes](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-personal-notes/src/index.js) |
| `slot-behavior` | `slot::<name>` | Uses a slot for logic or to change the host: a component that returns `null`, or a handler returning `{}` to suppress a host item. | [disable-screen-capture](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-disable-screen-capture/src/index.js) |
| `settings` | `settings` | Adds a settings section, or fields to a host section. | [attachment-missing-alert](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-attachment-missing-alert/src/index.js) |
| `settings-companion-slot` | `slot::<settings slot>` | UI inside a host settings panel, next to a `settings` registration. | [attachment-missing-alert](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-attachment-missing-alert/src/index.js) |
| `message-processor` | `messageProcessors:<kind>` | Transforms message or event content. The handler returns the processor. | [spy-blocker](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-spy-blocker/src/index.js) |
| `vertical-route` | `slot::routes`, `slot::<vertical>-tab-item`, landing-page slots | Adds a screen: route, menu item, landing-page content. | [sideloader](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-sideloader/src/index.js) |

Variants of each pattern (for example `extend-host-section` and `new-section` for `settings`) are in the `variants` list of its YAML entry, with example Zimlets.

## Registration modifiers

These say **how or when** a registration happens and combine with any pattern above.

| Pattern id | Meaning | Recommended example |
|---|---|---|
| `conditional-registration` | Registered only when a condition holds (platform, account attribute or license, environment). | [secure-mail](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-secure-mail/src/index.js) |
| `async-registration` | Registered after a promise resolves. | [dropbox](../../../zm-cloudsuite-zimlets/packages/zimbra-zimlet-dropbox/src/index.js) |
| `dynamic-registration` | Registered and unregistered at runtime, from `store.subscribe` or from a component effect. | [google-drive](../../../zm-cloudsuite-zimlets/packages/zimbra-zimlet-google-drive/src/index.js) |
| `loop-registration` | Registered in a loop over configuration. | [external-setting-links](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-external-setting-links/src/index.js) |
| `multi-handler` | Several handlers for one key. | [slack](../../../zm-cloudsuite-zimlets/packages/zimbra-zimlet-slack/src/index.js) |
| `redux-wiring` | Reducer, actions or selectors added through `context.store.zimletRedux`, removed in `destroy()`. | [document-editor](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-document-editor/src/index.js) |
| `factory-shape` | `exports.init = …` versus returning `{ init() {} }`. | [personal-notes](../../../zm-modern-zimlets/zimlets/zimbra-zimlet-personal-notes/src/index.js) |
| `no-registration` | Assigned by the scanner to a Zimlet that registers nothing in its sources. No Zimlet is in this state today, so the YAML has no entry for it. | none |

## Findings worth knowing when writing

- **Registration is not always in `src/index.js`.** `ads`, `chat`, `org-chart` and `web-search` register or unregister slots from components, usually inside `useEffect` or an event callback. `ads` registers nothing in `index.js`, and builds its slot names at runtime. The YAML records the `file` of each registration. In a pattern's `usages`, `files` lists the files other than `src/index.js` and `unregisters` lists the keys removed at runtime, so the pattern view shows these too.
- **Only `dropbox` is promise-based.** `google-drive` and `onedrive` call `registerPlugins()` directly from `init()`; `zoom` calls it from activation-status callbacks. All four add or remove attachment or calendar slots from `store.subscribe`.
- **Back-compatible duplicates.** The cloud-storage Zimlets keep registering the `collaboration-zimlet-collaboration-list*` slots alongside newer ones.
- **`settings` extends host sections by `id`.** `writingEmail` and `calendarAndReminders` are host sections defined in `zm-x-web/src/components/settings/constants.js`; the Zimlets using them pass no title or component. Other ids create a new section. Field `type` values seen are `userPref`, `modifyProperties` and `mailboxMetadata`; several Zimlets build the field with a helper.
- **Message processors take no arguments.** The host calls the handler without arguments and uses the returned function (or, for `attachPopover`, calls the handler with `(urlPrefix, isMobileView, sanitized)`). Several Zimlets pair a processor with a banner in `slot::message-body-top`.
- **Handler shapes differ.** Inline arrow, component reference, local `Wrapped*`/`Provided*` wrapper, object (`settings`), and a handler that returns a render function (`calendar-subscription`).
- **The slot name `writting-email-additional-settings` is spelled that way in the host.** Use it as is.

## Limits of the data

- Classification is by key name and shape, not by running the Zimlet. `slot-behavior` lists only registrations whose component was checked to return `null` or whose handler returns `{}`; other `slot::app` and send-toolbar registrations stay in `slot-ui` until checked.
- Conditions are detected lexically around the call. A registration inside a function that `init()` calls conditionally is not marked conditional (for example in `zoom` and `google-drive`); the entry's `notes` say so where it matters.
- Slot names built from template literals are recorded as written, for example `slot::${adSlots}`.
- Line numbers are not stored. The file path and key are the stable references.

## Keeping it current

[scan-zimlet-registrations.mjs](../scripts/scan-zimlet-registrations.mjs) rescans the Zimlet sources and merges the mechanical fields into the YAML. It needs the sibling repository layout described in the root [AGENTS.md](../../AGENTS.md#sibling-repositories) and Node `^24.18.0`.

```sh
node .agents/scripts/scan-zimlet-registrations.mjs --check   # report only, exits 1 on anything new or changed
node .agents/scripts/scan-zimlet-registrations.mjs           # merge into the YAML
```

Each pattern and Zimlet entry has `status: scanned | complete`. The script refreshes `scanned` entries, never edits a `complete` entry, and reports drift (a registration added or removed, a Zimlet missing) instead. New Zimlets are added as `scanned`. Usages of a `complete` pattern are only appended. Finish `scanned` and drifted entries with the [update-registration-patterns](../prompts/update-registration-patterns.prompt.md) prompt.

Related: [authoring.md](./authoring.md) (registration channels), [slot-behavior.md](../../../zm-x-web/.agents/zimlet/reference/slot-behavior.md), [verticals.md](../../../zm-x-web/.agents/zimlet/reference/verticals.md).
