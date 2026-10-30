# Zimlet documentation plan

This file is the working index for the Zimlet developer guide (Antora / AsciiDoc site in `zimlet-cli/documentation/`). It lists every page the finished guide will contain, and it is meant to be used **progressively**: pick the next page, write it, record its status here.

- Section 1 is the single place for each page: its purpose, sections, sources and examples.
- Section 2 explains how to build the guide page by page.
- [zimlet-documentation-claims.md](./zimlet-documentation-claims.md) lists the open claims: claims that could not be run or confirmed yet, and their status.

Writing rules for every page are in [write-doc.md](../rules/write-doc.md). Review rules are in [review-doc.md](../rules/review-doc.md). Rules for the Zimlet code shown in the guide are in [authoring.md](../rules/authoring.md), and for packaging and deployment steps in [packaging-deployment.md](../rules/packaging-deployment.md). Do not repeat them here.

Use the [zimlet-cli reference index](../../AGENTS.md#topic-to-file-map) and the [zm-x-web Zimlet materials index](../../../zm-x-web/.agents/zimlet/reference/zimlet.md) to find internal reference material while writing. Follow the topic-specific sources they link to, but do not link to these agent files in the published guide.

## 1. Guide structure and page index

### 1.1 Who reads the guide and how they move through it

The guide is organised around what a partner does, in the order they do it: understand, set up, build a first Zimlet, build real features, ship, look things up, get unstuck.

| Reader goal                                        | Route through the guide                                                                   |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Decide whether a Zimlet fits my need               | P01, P03                                                                                  |
| Try one quickly                                    | P03 to P06                                                                                |
| Build a production Zimlet                          | Part 1, then Part 2, then pick recipes from Part 3, add features from Part 4, then Part 5 |
| Deploy a Zimlet someone else built (administrator) | P29, then P36                                                                             |
| Look something up                                  | Part 6                                                                                    |
| Something does not work                            | P36, then P26 and P37                                                                     |

### 1.2 Conventions

- **One home per topic.** Every fact lives on one page. Other pages link to it. Where two pages touch the same topic, the split is: _concept and fundamentals pages_ explain how something works, _recipes_ (Part 3) show a complete working result for a goal, _feature guides_ (Part 4) cover the options of one area, and _reference_ (Part 6) holds the complete lookup tables. A page does not repeat a table or example that another page owns.
- **Page types** follow [doc-guide/types.md](../rules/doc-guide/types.md) section 3: Concept, Task, Reference, Troubleshooting. A _recipe_ is a Task page that ends in a complete working Zimlet feature.
- **Status values:** `Not started` · `Drafted` · `Reviewed`. Only the `review-doc` prompt sets `Reviewed`, when a review finds no Blocking issue.
- **Page ids** (`P01` …) are permanent labels used for cross references in this file only. They were assigned in reading order. Do not renumber when a page moves or is dropped, except for the pages of a group that has not been reviewed yet, whose ids may be reassigned to match the order; add new pages with the next free id. A group of pages keeps one plan entry and one status for each page, and the entry page of the group is the parent. `P43.2` (a styles page) and `P43.3` (a cache page) and `P43.7` (a utilities page) are retired and not reused. A child id is `<parent id>.<n>`, such as `P43.1`, numbered in reading order from 1. Add a new child with the next free number under its parent. `P12.1.6` (a message header button recipe) is retired and not reused: its follow up use case moved to P12.1.5. `P02` and `P19` are retired and not reused (P19, a sample Zimlet page, was dropped: examples come from existing Zimlets in `zm-modern-zimlets`). `P13` to `P18` are retired and not reused: their recipe pages became the children `P12.1` to `P12.6` of P12. File names refer to `modules/ROOT/pages/`.
- **Each part states its purpose.** A page must match the purpose of the part it is in (rule in `write-doc.md` section 2). The _Brief_ of each page names its sources and examples; the planned sections are a starting point, and the sources decide the final detail.

### Part 0 – Welcome

_Purpose: orient the reader: what a Zimlet is, who the guide is for and where to start. Plain words, no API detail, no step-by-step instructions._

- **P01 `index.adoc` – Zimlet developer guide** (Drafted)
  - What is a Zimlet – what a Zimlet is and what it adds to the Modern UI, in plain words.
  - Who this guide is for – anyone who wants to extend the Modern UI with a feature, whether a Zimbra developer or not, and the knowledge it assumes.
  - What you will build – the outcome: a working Zimlet that is built, packaged and deployed.
  - How the guide is organised – the parts of the guide and what each is for.
  - Reading paths – the routes of section 1.1: evaluate, try, build a production Zimlet, deploy as an administrator, look something up.
  - Brief: short. Names the audience and the routes. No technical detail. Does not link to P39 (Classic and Modern).

### Part 1 – Get started

_Purpose: take a newcomer from nothing to a working first Zimlet. Give only what the next step needs: a short mental model, requirements, setup and one tutorial. No internals, option catalogues or alternatives._

- **P03 `getting-started/concepts.adoc` – How Zimlets work** (Drafted)
  - The big picture (diagram) – one diagram and short text from source file to the Modern UI.
  - How a Zimlet is built and packaged – how `zimlet build` and `zimlet package` turn the project into a single JavaScript file and an XML descriptor in a zip.
  - Factory and `init()` – the entry-file contract: a default-exported factory that receives `context`, and an `init()` that registers everything.
  - Slots and plugins – how a Zimlet adds UI: named slots and the plugin handlers it registers; other registration keys (`settings`, `messageProcessors:<kind>`) exist.
  - How a Zimlet communicates with the Modern UI – four short points, each with a link: the context that the factory receives (P08, P11), shared libraries, so that a Zimlet imports Preact and host libraries instead of bundling copies (P10), events (P21) and data, meaning the store and server requests (P20). Plain language, no API names.
  - Try it while you develop – how `zimlet watch` and the sideloader load a Zimlet during development.
  - Brief: about one screen of text, plain language. Sources: `architecture.md`, `runtime.md`. Internals do not belong here: shim mechanism goes to P10, shared iframe, reload after a save and dev versus production loading to P26, server bundle and version filtering to P28 and P29. Diagram: build, package, deploy, load, `init()`, slot (simplified from `architecture.md` §1).
- **P04 `getting-started/prerequisites.adoc` – Prerequisites** (Drafted)
  - Get a Zimbra server – what a Zimbra server must provide to develop against: Modern UI, shell or admin console access, a test account, the Modern UI version, the sideloader. State plainly that a Modern UI server is required, either a test or a production server, and that it must have the sideloader Zimlet available. There is no stand-alone or hosted environment for partners without a server.
  - Find the Modern UI version – the About-dialog steps and the `--zimbraXVersion` default. Other pages link to this section (`getting-started/prerequisites.adoc#find-modern-ui-version`) and do not repeat it.
  - Technology table – each technology needed, why, the level required and a link to its official documentation, so the guide does not re-teach it.
  - Brief: table columns: technology, why you need it, requirement and level (it starts with Required, Recommended, When needed or Optional, defined above the table), official docs. Technologies: JavaScript, Node.js 24 and npm, Git, Preact and JSX, CSS/Less and CSS Modules, Redux (shared state only), `preact-router`, semver ranges, ESLint, an editor, POSIX shell basics, HTTPS and self-signed certificates. This page also replaces the former "Further reading" page. Check that every official link is live.
- **P05 `getting-started/setup-environment.adoc` – Set up your machine** (Drafted)
  - Install Node 24 – install and check the version.
  - Install Git and an editor.
  - Install the `zimlet` CLI – install and check that it runs.
  - Find your Modern UI version – link to `getting-started/prerequisites.adoc#find-modern-ui-version` and do not repeat the steps; the version later sets the `--zimbraXVersion` range.
  - Install and enable the sideloader – check for the Integrations view and its Zimlets Sideloader tab; if missing, deploy the sideloader Zimlet and grant it on a class of service or an account, then reload the Modern UI. Give no commands: link to P29 for how to deploy, the Admin Console, other classes of service and the restart note.
  - Accept the development HTTPS certificate – trust the development server's self-signed certificate in the browser. The steps are given here, and the reader does them the first time the development server runs in P06, because the server needs a project.
  - Ready check – a checklist that confirms the machine and the server are ready for the quickstart.
  - Brief: ends with the ready-check list. Sources: `cli-commands.md` (development loading), `packaging-deployment.md`. Commands inline.
- **P06 `getting-started/quickstart.adoc` – Your first Zimlet** (Drafted)
  - Create a Zimlet from the template – scaffold with `zimlet create`; what the template gives you.
  - Run it with `npm start` – start the development server and the output to expect.
  - Load it through the sideloader – load the running Zimlet into Modern UI.
  - See the result and change it – confirm the Zimlet appears, edit a file and reload the Modern UI page to see the change (the development server does not push updates to an open page).
  - Build and package – produce `build/index.js` and the zip, with the exact commands and expected output.
  - Brief: task layout from `doc-guide/types.md`. Written for the refreshed default template: the team will fix the template, so there is no "apply the template fixes" step. Before writing, check that the template is refreshed and builds with the current CLI. Ends with a working zip. Sources: `authoring.md`, `cli-commands.md`, the template. Next step: P07.

### Part 2 – Fundamentals

_Purpose: teach what every Zimlet author must understand, one topic per page. Give the depth needed to build correctly, and explain a mechanism only where it changes what the author writes. Complete working results for a goal belong in Part 3; option lists and lookup tables belong in Parts 4 and 6._

- **P07 `fundamentals/project-structure.adoc` – Project structure** (Drafted)
  - Minimum package – the smallest set of files a Zimlet needs.
  - Folders and files of the default template – what each folder under `src/` and each file in the project root is for, where your own code goes, how styles in `components`, `screens` and `pages` differ from other styles, and the folders that the build generates.
  - Folders you can add – the optional folders that active Zimlets use beyond the template (`hooks`, `utils`, `api`, `store`, `screens`, `pages`, `assets`), what each is for, and that the names are a convention because the build bundles what `index.js` imports. Source: the folders in `zm-modern-zimlets/zimlets/*/src`.
  - `package.json` – a short pointer to P31.1, which owns the fields and scripts.
  - `src/index.js` – the entry file and what the host expects from its default export.
  - `src/intl/en_US.json` – the strings file, including the `zimlet.label` and `zimlet.description` block.
  - `config_template.xml` (optional) – when to add it for administrator-edited settings.
  - `zimlet.config.js` (optional) – when to add it to change the build.
  - Zimlet naming rules – Zimlet name, folder name, slug and i18n namespace.
  - Brief: sources `authoring.md` §1, `packaging-deployment.md` §1 and §2, and the default template. The folder tree and lint setup come only from the template (`doc-guide/examples.md` section 4); do not take them from the monorepo Zimlets. Examples: the minimum package files and the template's folder tree.
- **P41** (moved: the page is now P31.1 `reference/files/package-json.adoc`; the number is kept so that no page is renumbered)
- **P08 `fundamentals/factory-and-lifecycle.adoc` – Factory and lifecycle** (Drafted)
  - The default export factory – the entry point, with a minimal example.
  - The `context` argument – what it is and how the factory receives it (fields are in P11).
  - `init()` – what it is for, when it runs and what to put in it.
  - Async setup – asynchronous work, such as a lookup, then registering plugins when it finishes.
  - Register and unregister conditionally – register only when a condition holds and remove with the same function reference.
  - Headless Zimlets – a Zimlet with no UI that only reacts to events or processes data (link to P12.4 and P12.6).
  - Brief: sources `authoring.md` §2, `runtime.md`. Include that the host calls the factory with `new` when it is constructible and as a plain call otherwise, and that for a Zimlet disabled for the account the factory still runs but `init()` is skipped, so keep factories free of side effects. Examples: factory example; lifecycle diagram.
- **P11 `fundamentals/host-context.adoc` – The context object** (Drafted)
  - What the host hands to a Zimlet – open with what the Modern UI passes through `context`.
  - Fields by job – only the `context` fields that have a page in the reference, other than the Deprecated page, grouped by what they are for. Each job gets a short explanation of what the field is for, when to pick it and how it relates to the other fields of that job, with a link to the concept page that teaches it (`plugins` and `zimlets` to P09, `store`, `zimbraBatchClient` and `zimbraOrigin` to P20), and to its page in P43 to P43.9 only when no concept page is planned (`meta`, `hostName`, `keyBindings`, `shortcutCommandHandler`). No deprecated fields. No types, arguments or examples here.
  - Zimlets that load from the server share one name – the effect on `plugins.unregisterAll()`.
  - Brief: concept page, source `context-and-shims.md` §1. The field detail is in P43 and P43.1 to P43.10, which are the only full `context` inventory in the guide.
- **P09 `fundamentals/extending-the-ui.adoc` – Slots and handlers** (Not started)
  - How slots work – where slots render and how handlers are called.
  - Register a handler – `plugins.register` for a slot, with a minimal example.
  - Handler return types – an element, a function, a component or a plain value.
  - Props and payload – what a slot passes to your handler and how to read it.
  - Hooks in handlers – using hooks without breaking the render.
  - Error isolation – a failing handler does not affect other handlers.
  - Find a slot – locate a slot in the running UI (`?zimletSlots=show`, see P26) and in the slot index (P34).
  - Handlers that return data – every key is collected with `invokePlugin`; a `slot::` key is drawn by the slot, and a key with no prefix gives data to the Modern UI code. A Zimlet can define a data key of its own.
  - Render-prop slots and `RemovableSectionZimlet` slots – slots that give your handler a function to call, and the slots of that component.
  - Other registration keys – one short paragraph each for `settings` (see P12.3 and its children) and `messageProcessors:*` (see P12.4).
  - Choose a slot – a short checklist of questions, and a table by goal (add content, add an action, add a settings page, add a tab and screen) with the slot to use and the recipe that applies it.
  - Brief: sources `slot-behavior.md`, `authoring.md` §3, `verticals.md`, `zimlet-slots.yml`. Confirm slot choices against the catalog. Slots are in scope end to end here, but per-slot placement and payload detail (all `unclassified` today) is a later phase: keep the structure open so it can be added per slot. This page owns slot mechanics only; complete examples are the recipes P12.1 to P12.4, and the full list is P34. Examples: minimal registration; slot rendering diagram.
- **P10 `fundamentals/shared-libraries.adoc` – Shared libraries** (Drafted)
  - How shims work – a two-to-three-sentence overview, no internals: a shim is the host's own copy of a library that the Modern UI shares with Zimlets. At build time the CLI replaces an import of a shimmed module with a small stub that, at run time, takes the module from the host (the `shims` map). The Zimlet therefore uses the same Preact, components and hooks as the host and does not bundle its own copy. Anything that is neither shimmed nor bundled fails at run time with the `Export … was not found` error. No aliases, generated files or `shims.js` details (the full list is P32).
  - What you may import – the modules a Zimlet imports from the host: libraries, components, hooks and helper functions.
  - What gets bundled – what a build puts in `index.js`: your code and every import that is not shared; how shimmed imports are replaced with the host's own copies and what that means for bundle size.
  - Packages you must not add – packages the host provides that must not be in `package.json`.
  - JSX and `createElement` – why JSX needs `createElement` from `preact` and how to import it.
  - Icons – pass a component as an icon instead of a string name.
  - The `Export … was not found` error – what it means and how to fix it.
  - Brief: sources `context-and-shims.md` §2, `authoring.md` §4, trimmed to what authors use; the "How shims work" overview is the only mechanism text, kept to a few sentences and checked against `cli-commands.md` (compile-time aliases) and `context-and-shims.md`. The full list of shimmed modules is P32. Examples: short import examples.

### Part 3 – Build by goal

_Purpose: give complete, working, reusable recipes that combine the fundamentals into a Zimlet feature a partner actually wants. Each recipe is a task: goal, steps, expected result, how to verify. Explain mechanics by linking to the Part 2 and Part 4 page that owns them. Confirm every registration key and slot against the catalog and real code before documenting it._

- **Host components and actions the recipes must cover.** The recipes teach the Zimbra components and host actions that active Zimlets use most, so a reader sees how they are used in a real feature. The list below comes from a count of the imports and calls in the active sources of `zm-modern-zimlets` and `zm-cloudsuite-zimlets` (the number is the count of Zimlets that use the item). Do not follow it blindly: confirm each item in the host before you use it, and replace one that no longer fits.
  - Components: `ActionMenuItem` (18), `Button` (19), `Icon` (19), `ModalDialog` (11), `TextInput` (10), `MenuItem` (8), `ChoiceInput` (8), `ActionMenuGroup` (7), `Spinner` (6), `ActionButton` (5), `NakedButton` (4), `ConfirmModalDialog` (4), `WarningBanner` (2), `Popover` (2).
  - Actions of the Modern UI: `notifications.notify` (15) and `zimlets.addModal` with `zimlets.removeModal` (11). They are documented on the `actions` reference page (P43.4.1.6); link to its entries (`notify`, `add-modal`, `remove-modal`) instead of repeating them.
  - Coverage rule: across the recipes of Part 3 (the slot recipes P12.1.x, P12.2, P12.3 with its children, and P12.4 to P12.6), every item above appears in at least one example. An example uses only the items that its use case needs; do not add an item to an example to meet the list.
  - Explanation rule: the recipe page that first uses an item (in the order of the pages in this plan) explains it in its own subsection, with a heading that names the item (for example `== The ModalDialog component`): what it is for, when to choose it, the props or arguments that the example uses (checked in the host source) and a link to its entry in the shared components inventory (P32; a link to a page that is not written yet has no anchor). A later recipe that uses the item links to that subsection and does not explain it again.
  - Planned owners (a starting point; change it when a use case does not fit): P12.1.1 none of the listed items (its use case needs only a component, a listener and a shortcut; `ConfirmModalDialog`, `addModal` and `removeModal` are explained in P12.6, and `notify` moves to P12.1.5); P12.1.2 `ActionMenuItem`; P12.1.3 `ActionButton`; P12.3.1 `ChoiceInput`, `TextInput` (moved from P12.1.2 and P12.1.3 when P12.3 was written first); P12.1.4 `WarningBanner`, `NakedButton`, `Button`, `Icon`; P12.1.5 `notify` (`ModalDialog` is explained in P12.6); P12.1.7 `ActionMenuGroup`; `MenuItem` in P12.1.2 or P12.1.7 and `Popover` in P12.4, where a use case fits (P12.1.10 does not need it). P12.6 was written first and explains `ConfirmModalDialog`, `ModalDialog` and `Spinner` in its own subsections; an earlier recipe that uses one of them links there instead.
- **P12 `build-by-goal.adoc` – Build by goal** (Drafted)
  - The entry page of the group, at `build-by-goal`; the recipes P12.2 to P12.6 and the slot recipes P12.1.1 to P12.1.12, except the retired P12.1.6, are its child pages in the navigation, and P12.3.1 and P12.3.2 are the children of P12.3. P12.1 has no page of its own; its content is the `Add content to a screen that exists` section of this page.
  - Introduction – states the use cases the recipes teach, by area, and that the reader meets the host components and actions that real Zimlets use most. Keep it in step with the recipes: when a recipe or a slot recipe (P12.1.x) is added or dropped, update the list.
  - Choose a recipe – at `build-by-goal.adoc#choose-a-recipe`: description lists from goal to recipe, with a link to each recipe as the term, then the goal and the mechanism that delivers it. Three groups: `Add content to a screen that exists` (the slot recipes P12.1.x, grouped under App shell, Mail, Calendar, Contacts and Briefcase headings, and holding the `#choose-a-slot` guidance that P12.1 had: where the content must appear and what the user does with it), `Add a screen or settings` (P12.2, P12.3) and `Work with messages, data and events` (P12.4 to P12.6).
  - Set up the project – the setup that every recipe shares, at `build-by-goal.adoc#set-up-the-project`: create the project with `zimlet create default my-zimlet` (link P05 for the command), remove the generated files that the recipe does not use (`src/components/app/` and `src/components/EmailTabItem/` for every recipe), keep `src/enhancers/index.js` (it provides `withIntl`), copy the example files into `src/` and merge the texts into `src/intl/en_US.json`. A recipe links to this section and lists only its own differences (files to remove, the texts to merge) in its own `Set up the project` section, and has no `Add the texts` section. Every recipe names the Zimlet `my-zimlet`.
  - Confirm before you build – the slot or registration key must be confirmed against P34 and the feature page.
  - Brief: entry point for Part 3. Map reader goals to the recipes and link to the concept, feature and reference pages; do not repeat implementations. Example: the description list of recipes.
- **P12.1 (no page) – Add content to a screen that exists** (Dropped as a page)
  - The page `build-by-goal/recipe-existing-screen-content.adoc` was dropped, because its title did not fit: Settings and the tab recipe also extend a built-in screen. Its guidance moved to P12 (`build-by-goal.adoc#choose-a-slot`): where the content must appear, what the user does with it, and the recipes by area, each with a link and when to choose it. The shared steps section was dropped because P09, P11 and each recipe own those steps. P12.1 stays as a label for the ids below: P12.1.1 to P12.1.12 keep their ids, and their pages are children of P12 in the navigation, at `build-by-goal/recipe-<name>.adoc`.
  - Components and actions: Follow the rule "Host components and actions the recipes must cover" at the start of Part 3: use and explain the items assigned to each child, link to the page that owns any other item, and tell the writer which items remain uncovered.
  - Brief for the children: sources `slot-behavior.md`, `authoring.md` §3, P11 and the registration patterns `slot-ui`, `slot-behavior` and `conditional-registration` in `zimlet-patterns.yml`. Link P09 and P34 for mechanics. Confirm every slot against the catalog. Placement and props of each slot stay `unclassified` in the catalog until P34, so confirm them in the host call site and in a Zimlet that fills the slot, and say in the page only what was checked. Each child page owns one complete multi-file use case, as the "Build by goal recipes" rules in `doc-guide/examples.md` require, with a verification checklist. The children are siblings: none depends on another. A new slot recipe is also added to the `Add content to a screen that exists` section of P12, under its area.
  - **P12.1.1 `build-by-goal/recipe-app-content.adoc` – Run an app-wide feature** (Drafted)
    - Complete recipe: a component with no layout of its own that starts once the app has loaded, shows nothing until a condition holds, and removes its listeners when it goes away. The example is a privacy blur: a full-window overlay when the browser tab or window loses the focus, which stays until the user presses a keyboard shortcut (`keyBindings` and `shortcutCommandHandler`) to show the screen again.
    - Covers no item of the list of host components and actions: the use case needs none of them. The earlier plan of a dialog or notification example was dropped; `ConfirmModalDialog`, `addModal` and `removeModal` are explained in P12.6, and `notify` moves to P12.1.5.
    - Brief: slot `app` (host `app.js`). The use case follows the pattern of the Zimlets that fill the app slot (`modern-welcometour`, `disable-screen-capture`, `desktop-auto-update`) and of the privacy protector Zimlet, without a dialog. A Zimlet runs in a hidden frame, so the example listens on `window.parent`. Link P12.4 for work that needs no UI at all. Confirmed in the Modern UI: blur stays after a tab or window switch, mouse and click do not show it, the shortcut shows it, keys typed while blurred do not reach the composer, dialogs covered.
  - **P12.1.2 `build-by-goal/recipe-gear-and-settings-menu.adoc` – Add menu items to the app** (Drafted)
    - Complete recipe: a menu item that opens a link or runs an action, with the choice between the gear menu, the settings dropdown and the header menu.
    - Covers, each explained in its own subsection on this page: `ActionMenuItem`. The use case does not need `ChoiceInput`; P12.3.1 owns it.
    - Brief: slots `gear-menu`, `settings-dropdown-item-end` and `header-menu-item`. Take the use case from `external-setting-links`, `install-pwa`, `set-default-client` or `user-feedback`.
  - **P12.1.3 `build-by-goal/recipe-search-bar.adoc` – Extend the search bar** (Not started)
    - Complete recipe: add a control to the search bar and react to it, including the removal of the handler when it no longer applies.
    - Covers, each explained in its own subsection on this page: `ActionButton`. Links to P12.3.1 for `TextInput`.
    - Brief: slots `web-search` (a render-prop slot) and `web-search-toggle`. Take the use case from `web-search` and `org-chart`. Link P09 for render-prop slots.
  - **P12.1.4 `build-by-goal/recipe-message-banner.adoc` – Show a banner above the message text** (Not started)
    - Complete recipe: a block in the message viewer that reads the message and shows a note or a warning, with the props the slot passes (`emailData`, `viewerRef`).
    - Covers, each explained in its own subsection on this page: `WarningBanner`, `NakedButton`, `Button`, `Icon`.
    - Brief: slot `message-body-top` (host `responsive-viewer`). Take the use case from `personal-notes` (stored note), `email-defanger` or `spy-blocker` (warning banner). The base example of the former P12.1.
  - **P12.1.5 `build-by-goal/recipe-mail-action-menu.adoc` – Add a mail menu item** (Drafted)
    - Complete recipe: a Follow up item for the open or selected message. It creates a listed tag when the account has none, tags the open message or every selected message with one request (a list of ids joined with commas), disables itself when no message is selected or when every selected message already has the tag, and reports the result in a notification.
    - Covers, explained in its own subsection on this page: `notify` (moved from P12.1.1). Links to P12.6 for `ModalDialog`, `addModal`, `removeModal` and `ConfirmModalDialog`, and to P12.1.2 for `ActionMenuItem`.
    - Brief: slots `action-menu-mail-more` (the More menu of an open message, the More Options menu of the toolbar and the right-click menu; the toolbar and right-click menus also pass `selectedMails`, and the right-click menu passes `isContextMenuSlot`) and `mail-overflow-menu-option` (the toolbar menu only, for one or no selected message). Take the pattern from `download-email` and `email-reminder`. The use case replaced the earlier copy subject example and the header button recipe (P12.1.6, retired), because few Zimlets fill the message header slot and it has little room. Confirmed in the Modern UI: the item is in all three menus, works in message and conversation lists, tags several selected messages (single, conversation and mixed selections), is disabled for tagged messages, and the new tag shows in the tag list only after a reload the first time.
  - **P12.1.7 `build-by-goal/recipe-composer.adoc` – Add to the composer** (Not started)
    - Complete recipe: one addition to the message composer, chosen from the composer toolbar, the sender options menu or the editor, with the reason for the choice.
    - Covers, explained in its own subsection on this page: `ActionMenuGroup`, and `MenuItem` if the use case needs it.
    - Brief: slots `composer-toolbar-end`, `compose-sender-options-menu` and `composer`. Take the use case from `voice-composer`, `email-templates`, `signature-template` or `tlp`. Pick one use case and one slot.
  - **P12.1.8 `build-by-goal/recipe-calendar-event-menu.adoc` – Add an action to a calendar event menu** (Not started)
    - Complete recipe: an item in the more menu and the context menu of an event, using the event the slot passes (`eventToDisplay`).
    - Brief: slots `action-menu-event-more` and `action-menu-event-context-menu`. Take the use case from `import-export-ics`. Calendar menus are rendered by the event action group.
  - **P12.1.9 `build-by-goal/recipe-appointment-field.adoc` – Enhance the event location field** (Drafted)
    - Complete recipe: a control in the appointment form, such as a video call link, that writes to the location of the event through the props the slot passes. The slot passes `notes` for reading only; it gives no function to change them.
    - Covers: the `text` style of `Button` (`styleType="text"` and `alignLeft`), explained in its own subsection on this page; it links to the `Button` subsection of the recipe `recipe-server-data` for the component.
    - Brief: slot `calendar-appointment-edit-video-call` (resource chooser and quick add form). Take the use case from `jitsi`, `zoom` or `video-call-preferences` in `zm-cloudsuite-zimlets`, written as a neutral example. Confirm that the props can change the event in the Modern UI before you document it.
  - **P12.1.10 `build-by-goal/recipe-contact-hover-card.adoc` – Enhance contact cards** (Drafted)
    - Complete recipe: a personal VIP list. A star next to every VIP address in a message and in the composer (`address-pill`), and a link in the card that opens over an address and in the details of a contact in Contacts (`contact-hover-card-details` and `contact-card-item`) that adds the address to the list or removes it. The list is shared between the handlers in Redux state and saved in mailbox metadata through the batch client. A short section says why metadata was chosen and that Zimlet configuration (a `ModifyProperties` request) can hold the list too.
    - Covers no item of the list of host components and actions: the use case needs none that is unowned. It links to P12.6 for `Button`, to P12.1.9 for its `text` style and to P12.1.5 for `notify`. `Popover` stays with P12.4.
    - Brief: slots `contact-hover-card-details`, `contact-card-item`, `address-pill` and `contact-input-token:button-inner-content`. Take the use case from `preventive-ooo`, `chat` or `slack`. The two card slots pass `email` and `contact`; `contact-card-item` passes `email` only from the plain Email field.
  - **P12.1.11 `build-by-goal/recipe-briefcase-file-actions.adoc` – Add a Briefcase action** (Drafted)
    - Complete recipe: one action that works on the selected file, offered in the file context menu and in the toolbar, with the props the slots pass (`selectedList`).
    - Brief: slots `briefcase-document-context-menu`, `briefcase-document-header-action` and `action-menu-briefcase-more`. Take the use case from `document-editor`, the only Zimlet that fills the Briefcase slots. Mention `briefcase-upload-button` only as a one-line pointer. Confirm each slot in the host call site, because the catalog has no placement for it.
  - **P12.1.12 `build-by-goal/recipe-sidebar-widget.adoc` – Add a sidebar widget** (Drafted)
    - Complete recipe: a second time zone clock for teams that work across time zones. A small widget in the panel at the right of the screen that shows the current time and date at a fixed place, such as the head office, and updates while the user stays on the screen. It needs no request to the server and stores nothing. A basic recipe: one slot, one component, one timer with its cleanup, and a note that more widgets can use the same slot.
    - Covers no item of the list of host components and actions: the use case needs none of them. It links to P12.1.1 for the way a handler returns a component and to P11 for `withIntl` and the texts.
    - Brief: slot `rightside-zimlet-slot` (host `right-side-zimlet-slot`), which the Mail, Calendar, Contacts, Briefcase and calendar search screens render. The slot passes the handler no props that the example needs. The panel is at most 250 px wide, shows only at the width `screenMd` (1025 px) and up, and is shared with other Zimlets (the chat Zimlet fills it). Mention the 50 px bar of `rightbar-50px` in one sentence only. Confirm in the Modern UI: the screens that show the panel, how a second handler or another Zimlet stacks with the clock, how the panel looks when only the clock fills it, and the narrow window. Take the pattern from `zimbra-zimlet-chat` (the only active Zimlet that fills the slot) and write a neutral, much smaller example. Chosen use case (of eight offered): the clock. The left sidebar ad slots (`adSlot-left-300-250`, `adSlot-left-180-150`, `adSlot-left-120-90`) were tried first and dropped: they do not show in Briefcase, need 1300 px, and are designed for advertisements.
- **P12.2 `build-by-goal/recipe-tab-and-route.adoc` – Add a tab and a screen** (Not started)
  - Add a screen and its route – register the route for the screen's URL.
  - Add a tab item – the menu item that opens the screen.
  - Read the route slug – build links with `useClientConfig`.
  - Verticals – what the built-in top-level areas (video, chat, cloud, integrations) are for, and a table of which slot activates which vertical.
  - Verify the result.
  - Components and actions: Follow the rule "Host components and actions the recipes must cover" at the start of Part 3: use and explain the items assigned to this page, link to the page that owns any other item, and tell the writer which items remain uncovered.
  - Brief: replaces the former "Tabs, routes and verticals" page. Sources `verticals.md`, `authoring.md` §3, and the template's `slot::email-tab-item` and `slot::routes` example. Example: complete recipe with a verification checklist; slot activation table.
- **P12.3 `build-by-goal/recipe-settings.adoc` – Add a settings** (Drafted)
  - The entry page of the group, with the two recipes as its children P12.3.1 and P12.3.2. It holds what both recipes share, so that no child repeats it.
  - Choose a goal – a new section of your own in the Settings dialog (P12.3.1), or a control in a built-in settings page (P12.3.2), each with a link and when to choose it.
  - Where a settings section fits – how the dialog lists and shows sections, and the keys of the object that a Zimlet registers under `settings` (`id`, `title`, `component`, `fields`, `afterSave`). Link to P34.7 for the full reference of the key.
  - Fields – `type`, `key` and `defaultValue` of a field, the `modifyProperties` value (`zimlet`, `name`, `_content`) and that a value is text. Link to P20.5 for the values that a settings section stores and to P20.6 for state that needs no section.
  - What the dialog passes – `value` and `onFieldChange`, which the component of a section receives. P12.3.2 states what a built-in page passes to its companion slot, after it is confirmed in the host call site.
  - Components and actions: Follow the rule "Host components and actions the recipes must cover" at the start of Part 3: link to the child page that owns an item, and tell the writer which items remain uncovered.
  - Brief: sources `authoring.md` §3, P09 and the verified settings implementation. Short; no example and no steps, like P12.1. Each child is a complete recipe that does not need this page to be followed, and links here for the shared facts.
  - **P12.3.1 `build-by-goal/recipe-settings/new-section.adoc` – Add a section to the Settings dialog** (Drafted)
    - Complete recipe: register under the `settings` key a section of your own, with a title, a component and fields, and keep _Save_ disabled while a value is wrong (`handleValidityOfTabs`).
    - Covers, each explained in its own subsection on this page: `ChoiceInput`, `TextInput`. This page is written before P12.1.2 and P12.1.3, so it owns them; those pages link to its subsections.
    - Brief: sources `authoring.md` §3, P09 and the verified settings implementation. Verify the registration key and behaviour before documenting. Example: complete recipe with a verification checklist (the Reply reminders section), kept in `examples/settings-new-section/`.
  - **P12.3.2 `build-by-goal/recipe-settings/existing-section.adoc` – Add a control to a built-in settings page** (Drafted)
    - Complete recipe: add a control to a section that the Modern UI already has, such as Writing Email. Register `settings` with the `id` of that section and only `fields`, and fill the companion slot of the section, which draws the control and receives `value` and `onFieldChange`.
    - Brief: slots `writting-email-additional-settings`, `writing-email-post-composer-settings`, `general-setting-bottom`, `calendar-and-reminders-video-call-preferences` and `additional-signature-settings` (the registration pattern `settings-companion-slot` and `extend-host-section` in `zimlet-patterns.yml`). Take the use case from `attachment-missing-alert` (a keyword field in Writing Email) or `video-call-preferences`. Pick one use case and one slot. Only the first three slots pass `value` and `onFieldChange` (`general-setting-bottom` passes `matchesScreenMd` and `additional-signature-settings` passes signature props), which the page states in a table. Confirm the slot, its props and the merge of the fields in the host call site, and that the control shows and saves in a running Modern UI before documenting it. Use `ChoiceInput` and `TextInput` from P12.3.1 by link. Example: complete recipe with a verification checklist, kept in `examples/settings-existing-section/`.
- **P12.4 `build-by-goal/recipe-message-processing.adoc` – Process messages without UI** (Not started)
  - Complete recipe: register a message processor under `messageProcessors:<kind>` and handle its payload.
  - When this pattern is appropriate and how to verify it. It is not the same mechanism as app events (P21).
  - Components and actions: Follow the rule "Host components and actions the recipes must cover" at the start of Part 3: use and explain the items assigned to this page, link to the page that owns any other item, and tell the writer which items remain uncovered.
  - Brief: sources `authoring.md` §2–3, P09 and the verified message-processor implementation. Example: complete recipe with a verification checklist.
- **P12.5 `build-by-goal/recipe-server-data.adoc` – Manage server data** (Drafted)
  - Complete recipe: use context.zimbraBatchClient.jsonRequest to read, create and remove records.
  - Components and actions: Follow the rule "Host components and actions the recipes must cover" at the start of Part 3: use and explain the items assigned to this page, link to the page that owns any other item, and tell the writer which items remain uncovered.
  - Brief: sources `context-and-shims.md` §1, `authoring.md` §7 and `batch-client/index.ts` of the API client (the wire shape of the requests). The example is a Partners tab in the Contacts area (`slot::contacts-tab-item` and `slot::routes`) that keeps contacts in an address book of its own: `CreateFolder` with `fie`, `Search` with `types: 'contact'`, `CreateContact` and `ContactAction` with `op: 'trash'`, all through `zimbraBatchClient.jsonRequest`. The screen has an inline field that adds a partner from an email address, and a button in each row that moves it to the Trash, so it needs no dialog. It explains `Button`, `ActionButton` and `WarningBanner`, and links to the subsections of `TextInput` (P12.3.1), `Spinner` (P12.6) and `MenuItem` (P12.2). The `fetch` helper is the topic of P20 (`go-deeper/server-data/fetch.adoc`), and the guide uses no GraphQL. Not covered here: `notifications.notify`, `addModal`, `removeModal`, `ModalDialog`, `ConfirmModalDialog`, `NakedButton`, `Icon`, `ActionMenuItem`, `ActionMenuGroup`, `ChoiceInput` and `Popover`.
- **P12.6 `build-by-goal/recipe-app-events.adoc` – React to app events** (Drafted)
  - Two examples: delay sending a message and delay logout, with `zimletEventEmitter`.
  - Remove the listener correctly; verify the behaviour.
  - Components and actions: Follow the rule "Host components and actions the recipes must cover" at the start of Part 3: use and explain the items assigned to this page, link to the page that owns any other item, and tell the writer which items remain uncovered.
  - Brief: source `context-and-shims.md` §4. Links P21 for the event table. Example: listener examples written for the page and built in a scratch Zimlet.

### Part 4 – Go deeper

_Purpose: cover the options and details of one feature area per page, for authors who already built a first Zimlet. Do not repeat complete recipes from Part 3._

- **P20 `go-deeper/server-data.adoc` – Server data** (Drafted)
  - The entry page of the group: one short entry for each topic below, with a link to its child page and when to choose it.
  - Brief: sources `context-and-shims.md` §2–3, `authoring.md` §7, `packaging-deployment.md` §2. The guide documents ready-made hooks only, never GraphQL (rule in `write-doc.md` section 2). The topics are the child pages P20.1 to P20.3, P20.5 and P20.6, which were split out on request because each is a large topic. They sit in the navigation as a sub-list of P20. The page groups the ways by the reader's question: use data that Zimbra already has (P20.1 to P20.3), or keep a value that belongs to the Zimlet (P20.5 and P20.6). It also has the subsection `show-a-change` (Keep the Modern UI up to date), under the group for data that Zimbra already has: make a change that the Zimlet made show in the Modern UI. Use a hook, then send a request with `jsonRequest` and check the screen, then offer a reload in a `notify` notification with an `action` that calls `window.parent.location.reload()`. The host handles server notifications for most kinds of data and ignores a created tag (read from the host's notification handlers; a tag that the Zimlet created was missing from the Tags list until a reload, as the user saw in the Modern UI; KI-65). A Zimlet runs in a hidden frame, so the reload targets `window.parent`. The recipe P12.1.5 owns the code. No GraphQL or Apollo. P20.4 (Redux) and P20.7 (Platform checks) moved out to `go-deeper/redux.adoc` and `go-deeper/platform-checks.adoc` as top-level pages of Part 4, and keep their ids.
- **P20.1 `go-deeper/server-data/data-hooks.adoc` – Data hooks** (Drafted)
  - Ready-made hooks for common data (`useAccountInfo`, `usePreferences`, `useClientConfig`, …), what they return and how to read the result. No direct GraphQL. Link to P32.7 for the full list.
  - Brief: sources `context-and-shims.md` §2, the hook definitions in the host `src/hooks`. List only the hooks that Zimlets use. Example: a component that reads data with a hook.
- **P20.2 `go-deeper/server-data/batch-client.adoc` – Batch client** (Drafted)
  - How to send a request with `jsonRequest`. The choice between a hook, `zimbraBatchClient` and `fetch` is in P20, section `when-to-use-which`. Link to P43.5 for each member.
  - Brief: sources `context-and-shims.md` §1, `authoring.md` §7. Example: a request sent with `jsonRequest`.
- **P20.3 `go-deeper/server-data/fetch.adoc` – Call a server API with fetch** (Drafted)
  - A `fetch` helper – origin, credentials, CSRF header and the response.
  - Brief: sources `context-and-shims.md` §1 (`zimbraOrigin`, `csrfToken`) and `authoring.md` §7. The `fetch` example follows the existing Zimlets: Zimbra SOAP over `POST /service/soap/<Request>` as in `zimbra-zimlet-org-chart`. A proxy path is not a general option: `zimbra-zimlet-chat` uses its own extension path, so mention it only as a product-specific case. Example: helper and a call written for the page.
- **P20.4 `go-deeper/redux.adoc` – Shared state with Redux** (Drafted)
  - `store.zimletRedux` – add a reducer, actions and selectors, read the state in components, and the limits (namespace, no persistence). Link to P43.4 for each member.
  - Brief: sources `context-and-shims.md` §3, `authoring.md` §8. Example: a reducer, an action and two components that share state.
- **P20.5 `go-deeper/server-data/zimlet-configuration.adoc` – Zimlet configuration** (Drafted)
  - Where a value lives: an administrator default (`config_template.xml`, changed on the server) and a user value (a `modifyProperties` field of a settings section, saved per account). Declare the default, let the user save their own value, read both with `useAccountInfo` (the user value wins), and change a default. Link to P29 for deployment, to P12.3 for the settings section and to P31.4 for the file.
  - Brief: sources `packaging-deployment.md` §2, the Zimlets that read their configuration and the `zimbra-zimlet-attachment-missing-alert` pattern (default from `config_template.xml`, user override in a settings section), and the host settings dialog and the server `ModifyProperties` request. Example: `config_template.xml` and a Zimlet that shows an announcement text from the administrator at the top of the message list, which each user can hide with a check box in its own settings section.
- **P20.6 `go-deeper/server-data/metadata.adoc` – Mailbox metadata** (Drafted)
  - Store small values on the mailbox of the user: read and write a section with `jsonRequest`, with the limits.
  - Brief: the plan named mailbox metadata, but no ready-made hook for it is exported to Zimlets: the existing Zimlets use GraphQL queries, which the guide leaves out. The page uses `jsonRequest` with `GetMailboxMetadata` and `ModifyMailboxMetadata`. The hooks `useCustomMetaData` and `useCustomMetaDataMutation` cover the metadata of one item (a message or a contact), not the mailbox, and are not on the page. Example: read and write a section.
- **P20.7 `go-deeper/platform-checks.adoc` – Platform checks** (Drafted)
  - `getPlatformType` and `PLATFORM_TYPES` – check the platform (browser, desktop app or mobile app) before using a feature, and `openExternalBrowser`. The conditional registration pattern is owned by P08.
  - Brief: sources `context-and-shims.md` §2 and the Zimlets that check the platform. Example: a platform-dependent action.
- **P21 `go-deeper/app-events.adoc` – App events** (Drafted)
  - `zimletEventEmitter` and `ZIMBRA_ZIMLET_EVENTS` – the event bus and the full event table (the only full event table in the guide).
  - Synchronous and asynchronous listeners – how to choose.
  - Removing listeners (`off` throws) – how to remove one and why a wrong call throws.
  - Brief: source `context-and-shims.md` §4. Use cases are in P12.6. Examples: listener example; event table.
- **P22 `go-deeper/styling.adoc` – Styling** (Drafted)
  - The entry page of the group: one short entry for each child page, with a link and when to choose it.
  - Brief: the topics are the child pages P22.1 and P22.2, which were split out on request because styling covers two halves (where styles live, and which shared values to use). They sit in the navigation as a sub-list of P22.
- **P22.1 `go-deeper/styling/write-and-scope-styles.adoc` – Write and scope styles** (Drafted)
  - Less and CSS – how to write styles and where to put them.
  - Scoped and global styles – when styles are scoped (CSS Modules in `components`, `screens`, `pages`) and when they are global.
  - Host-injected styles – what the host adds that your styles interact with.
  - Custom properties – define your own, and set their values at run time on an element with the `style` prop. Switch classes for finite variants.
  - Do not call `context.styles.set`: the build calls it once with all your CSS, and a call of your own replaces that CSS (the host code of `createStyler` replaces the text of its one `<style>` element; not run in the Modern UI). Warn the reader; do not document the field as API.
  - Brief: sources `authoring.md` §5. Example: a component with a scoped `style.less`, a custom property set with the `style` prop and a class variant.
- **P22.2 `go-deeper/styling/shared-styles.adoc` – Style library** (Drafted)
  - How to use the tokens of the public `@zimbra/x-ui` package (npm and GitHub, `zm-x-ui`): CSS variables (no import) and Less variables and helpers (`refs.less`, `helpers.less` with `(reference)`); do not import `index.less` (bundles the Roboto font files) or `css-variables.css` (the host defines them).
  - One section each, with one example: spacing tokens, font sizes, font styles, colors and screen size helpers.
  - Explore the rest of the library – the page covers only the most used tokens and helpers, so it points to the public `zm-x-ui` repository and the files of the installed package (`variables.less`, `css-variables.css`, `palette.css`, `helpers.less`).
  - Light and dark mode – the tokens switch with the Dark Theme, Light Theme or Device's Theme choice of the user, so use tokens and not fixed colors. Do not recommend `light-dark()` in the own CSS of a Zimlet: in the Modern UI it follows the operating system and not the choice (KI-46). Placed here and not in P22.1 because it is a color topic, and the tokens are defined with it.
  - Brief: sources `authoring.md` §5; `variables.less`, `refs.less`, `helpers.less`, `css-variables.css` and `palette.css` of `zm-x-ui`; the usage count of tokens in the existing Zimlets (`--spacing-sm`, `--spacing-md`, `--spacing-xs`, `--icon-size-md`, `--brand-primary-500`, `--border-color`, `@screen-xs-max`, `@screen-sm-max` are the most used). Examples: one `.less` file for each section.
- **P23 `go-deeper/localization.adoc` – Localization** (Drafted)
  - `src/intl/*.json` – structure and naming of locale files.
  - `withIntl` and `<Text id>` – load and show strings.
  - `zimlet.label` and `zimlet.description` – define the label and description for the admin console and the UI.
  - Add a locale.
  - Brief: sources `authoring.md` §6, repo `AGENTS.md` (translation pointer), and for Add a locale the `Adding other languages` section of the default template's `README.md` (file names are locale codes; the administrator command that lists the codes). Examples: `en_US.json`, `de.json`, `enhancers/index.js` and a component.
- **P24 `go-deeper/security-and-best-practices.adoc` – Security and best practices** (Not started)
  - What the browser sandbox does not give you – the shared same-origin iframe is not a security boundary (shared `window`).
  - Sanitise HTML – use the shimmed `dompurify` before rendering untrusted content.
  - Secrets and tokens – the bundle is served to every user, so keep secrets out of it and never log tokens.
  - Calls to external services – use the server proxy; what to check before sending user data out.
  - Brief: new page for partners. No source file covers this; research from `runtime.md`, `context-and-shims.md` (the `dompurify` shim) and the host code, and mark what cannot be confirmed as unverified. Engineering reviews this page last, after all pages are drafted.
- **P25 `go-deeper/advanced.adoc` – Advanced topics** (Not started)
  - Customise webpack (`zimlet.config.js`) – change the build, with a small example.
  - Non-Preact UI – write a Zimlet in another framework and what is lost.
  - Call external services through `/service/proxy`.
  - Assets and `publicPath` – load images and fonts correctly in a deployed Zimlet.
  - OAuth client – use it for services that need a login.
  - Brief: sources `cli-commands.md` (webpack), `packaging-deployment.md` §3. Signatures live in P32. Example: `zimlet.config.js`, starting from the default template's.

### Part 5 – Run, package, deploy

_Purpose: tasks for running, checking, packaging and deploying a Zimlet, each with a way to check the result. Explain internals only when they explain a failure._

- **P26 `run-package-deploy/run-and-debug.adoc` – Run and debug** (Drafted)
  - `zimlet watch` options – each option and when to use it.
  - Sideloader steps and "persist" – load the development URL and keep it with the persist option.
  - Development versus production loading – a comparison, the shared same-origin iframe and what it means (shared `window`; see P24), and why a saved change needs a page reload (the dev server has no client, so the soft restart is not triggered).
  - Browser console messages – what to look for and what they mean.
  - Debug slots (`?zimletSlots=show`) – show every slot in the page.
  - If nothing appears – link to P36.
  - Brief: sources `cli-commands.md` (development loading), `runtime.md` (debugging), `packaging-deployment.md`.
- **P27** (removed: the testing page is dropped from the guide; the number is kept so that no page is renumbered)
- **P42 `run-package-deploy/lint-your-code.adoc` – Lint** (Drafted)
  - Run the checks – `npm run lint` and its expected output.
  - Fix a reported problem – one worked example: text typed into a component, the `Untranslated text` message and the fix with `Text` and `en_US.json`.
  - Fix formatting automatically – `npm run lint:fix` and what it does not fix.
  - `eslint.config.mjs` – what the template file contains, how to change a rule, how to check specific files and print the active configuration.
  - Lint on every commit – the commit hooks of the template.
  - Brief: task page, split out of P07. Sources: the default template's `eslint.config.mjs`, `package.json` and `.husky/`, and `@zimbra/eslint-config`.
- **P28 `run-package-deploy/build-and-package.adoc` – Build and package** (Drafted)
  - `zimlet build` – what it does and what it writes to `build/`.
  - `zimlet package` and its options – each option, with the exact command.
  - The generated descriptor and `.properties` files – what they contain and the descriptor attributes an author controls, including `zimbraXZimletCompatibleSemVer` as a version range (the full element list is P31.3).
  - Where the zip is written – and how to change it.
  - Choose the `--zimbraXVersion` range – match the Modern UI version you target; find the host version in Settings, then About.
  - Keep it compatible – what to do when the Modern UI is upgraded (versioning gap KI-62; flag unverified).
  - `--publicpath` – when to set it and what it changes.
  - Brief: sources `packaging-deployment.md` §1, `cli-commands.md`. Example: descriptor XML written for this page.
- **P29 `run-package-deploy/deploy.adoc` – Deploy a Zimlet** (Drafted)
  - Hand over to an administrator – what to give someone who owns the server: the zip, the target version range, the COS to enable, the settings to configure, and the verification list.
  - Deploy with the Admin Console – upload the zip, flush the Zimlet cache and finish. The Admin Console comes first on this page, for deploying, enabling per COS or account, and undeploying.
  - Deploy with the command line – `zmzimletctl deploy`, the expected output and `zmprov flushCache zimlet`.
  - Make the Zimlet available to users – per COS and per user in the Admin Console, then `zmzimletctl acl` and `listAcls`; the three states (mandatory, enabled, disabled); turn a Zimlet off for everyone.
  - Let users turn a Zimlet on or off – Modern UI settings, Add-ons (Zimlets); confirmed in a live session.
  - Configure the Zimlet – `zmzimletctl getConfigTemplate` and `configure`.
  - Flush the cache after a change – which `zmprov flushCache` command each action needs, and that none needs a restart.
  - How the server loads deployed Zimlets – the bundle and the three conditions (available, enabled, version range).
  - Check that the deployment worked – the verification checklist.
  - Update, undeploy and roll back – deploy a new version (the `config_template.xml` version rule), remove a Zimlet, go back to an earlier version (flagged unverified).
  - Brief: source `packaging-deployment.md` §3 and §4, trimmed to author consequences. Order of every pair: Admin Console first, then the command line. Commands inline.

### Part 6 – Reference

_Purpose: complete facts for lookup, no tutorial text. Every API, property, option, command, hook, component and constant follows the member template of [doc-guide/types.md](../rules/doc-guide/types.md) section 3 (introduction, signature, parameters or props or options, returns, usage notes, example, next step), under a group page that lists its members. The file references (P31 and its children) are the exception and keep one page for each file. The CLI reference (P30) is the other exception: one group page documents its four commands as sections. A page of this part that has no member pages yet is not finished: add them to this plan first, with the next free ids under their group._

- **P30 `reference/cli.adoc` – CLI reference** (Drafted)
  - Single group page that documents its members itself: the four commands are too small for a page each. Opening paragraph: what the `zimlet` command is for and when to reach for each command. Then a description list of the four commands, each linking to its section by anchor (`[[create]]`, `[[watch]]`, `[[build]]`, `[[package]]`, with the § link in the margin as on headings).
  - Brief: source `cli-commands.md`. Each command is a section with the full CLI member template and no `Next step`: `Signature`, `Arguments`, `Options` (with defaults), `Output` (what it prints or writes, and its exit code), `Usage notes` and an optional `Example`. Do not shorten a command because it shares the page.
  - Sections: `zimlet create [template] [dest]`, `zimlet watch`, `zimlet build`, `zimlet package`. Link to the owning pages for deployment steps (P28, P29) and for `--config` (P31.5) instead of restating them.
- **P30.1 to P30.4** (removed: the four command pages are now sections of P30; the numbers are kept so that no page is renumbered)
- **P31 `reference/files.adoc` – Files** (Drafted)
  - A landing page: a description list with one entry for each file page and a one-line summary. Add an entry when its page is written; do not link a page that does not exist.
  - Brief: the group page of the file reference, written like `reference/context.adoc`. Sources and examples are in the sub-pages.
- **P31.1 `reference/files/package-json.adoc` – The package.json file** (Drafted)
  - Identity and entry – `name`, `version`, `private`, `module`, `main`, and the fields the build ignores.
  - Scripts – each script of the default template's `package.json`, what it runs and what to set.
  - Dependencies – one section: what belongs in `dependencies` and `devDependencies`, and what ends up in the bundle. Under `dependencies`, the template's libraries and an inventory of the other packages that the active Zimlets in both monorepos bundle, in groups (interface and styles, utilities, text and HTML, service integrations), each with its purpose. Under `devDependencies`, the template's tools and `svg-inline-loader`. The section says that the listed packages are recommended and that other libraries can be installed as needed. Link to P10 for the libraries the Modern UI provides and that must not be added; the page does not list them.
  - Brief: moved from Part 2 (formerly P41), which was split out of P07 so that P07 can explain the folders. Sources: the default template's `package.json`, `package.js` and the build entry resolution. Reference page: description list entries with anchors, no examples (the minimum `package.json` example is on P07). The packages inventory is the one part of this page that reads the manifests and imports of the tracked Zimlets in `zm-modern-zimlets/zimlets` and `zm-cloudsuite-zimlets/packages`, written as an inventory (`doc-guide/types.md` section 3). Left out: packages the Modern UI provides (P10 and P32 own them), the test tools of the shared cloud library, GraphQL tooling (write-doc.md section 2), the nested emoji-data script package of the chat Zimlet, and manifest entries that no source or config uses (`clipboard-polyfill`, `sirv-cli`). Two packages are not on the public npm registry (checked with `npm view`). A shimmed package that is listed in `dependencies` is not bundled (checked in a scratch build); P10 owns that fact. Re-check the manifests and imports when the Zimlets change. Keep the anchors, because P07, P28 and P42 link to them.
- **P31.2** (removed: the dependency inventory is now a part of the Dependencies section of P31.1; the number is kept so that no page is renumbered)
- **P31.3 `reference/files/descriptor.adoc` – Descriptor XML** (Not started)
  - Every element and attribute.
  - Brief: source `packaging-deployment.md`. Example: a descriptor file.
- **P31.4 `reference/files/config-template.adoc` – config_template.xml** (Not started)
  - Structure of the admin settings file.
  - Brief: sources `packaging-deployment.md` §2 and `authoring.md`. Example: a `config_template.xml` file.
- **P31.5 `reference/files/zimlet-config.adoc` – zimlet.config.js** (Not started)
  - Shape of the build configuration function.
  - Brief: sources `authoring.md` and the default template. Example: a `zimlet.config.js` file.
- **P31.6 `reference/files/strings.adoc` – en_US.json** (Not started)
  - Structure of the strings file.
  - Brief: sources `authoring.md` and the default template. Example: an `en_US.json` file.
- **P32 `reference/shims.adoc` – Shared modules** (Not started)
  - Landing page, written as a nested list and not as a table. Each item is a group with a link to its page, and the area pages are nested under it as links, so the reader sees every subpage at a glance. Each item names its shimmed modules in a short line. The page does not list exports; they are on the linked pages. Modules that the guide does not document are listed last as "not documented in this guide", without a reason. The groups and links are:
    - Third-party libraries (P32.1): `preact`, `preact/hooks`, `preact/compat`, `preact-render-to-string`, `preact-markup`, `redux-actions`, `moment`, `dompurify`, `react-redux`, `preact-router`, `preact-router/match`.
    - Components (P32.2): `@zimbra-client/components`, with its five area pages (P32.2.1 to P32.2.5).
    - HOCs (P32.3): `@zimbra-client/enhancers` and the HOCs of `@zimbra-client/util`, with three area pages (P32.3.1 to P32.3.3).
    - Localization (P32.4): `@zimbra/preact-i18n`.
    - Blocks (P32.5): `@zimbra-client/blocks`, with five area pages (P32.5.1 to P32.5.5).
    - Utilities (P32.6): `@zimbra-client/util`, with three area pages (P32.6.1 to P32.6.3).
    - Hooks (P32.7): `@zimbra-client/hooks` and `@zimbra-client/hooks/graphql`, with six area pages (P32.7.1 to P32.7.6).
    - Constants (P32.8): `@zimbra-client/constants`.
    - Errors, platform and PWA (P32.9): `@zimbra-client/errors`, `@zimbra-client/platform`, `@zimbra-client/browser`, `@zimbra-client/util/contacts`, `@zimbra-client/pwa-utils`.
    - Not documented: `@zimbra-client/graphql`, `@apollo/client`, `@apollo/client/react/hoc`, `@apollo/client/react/components`.
  - Brief: source `context-and-shims.md` §2 and `shims.js`. The only full list of shimmed modules in the guide. P32.1 to P32.9 are the shim reference pages and follow the shim reference page rule in `doc-guide/types.md` section 3. Export lists below come from `shims.js`; verify each against its source before writing. Left out: `ZimbraProvider`, and the paths that the CLI aliases but the host does not provide (`@zimbra-client/util/redux`, `preact/jsx-runtime`; KI-12, KI-10).
  - **P32.1 `reference/shims/libraries.adoc` – Third-party libraries** (Not started)
    - Whole-module shims, one line each with a link to the upstream docs: `preact`, `preact/hooks`, `preact/compat`, `preact-render-to-string`, `preact-markup`, `redux-actions`, `moment`, `dompurify`.
    - Subsets, listing only what the host exposes: `react-redux` (`Provider`, `connect`, `useSelector`, `useDispatch`, `batch`), `preact-router` (`route`, `Link`), `preact-router/match` (`Match`).
  - **P32.2 `reference/shims/components.adoc` – Components** (Not started)
    - Group page for `@zimbra-client/components` (53 exports).
    - **P32.2.1 `reference/shims/components/layout-and-navigation.adoc` – Layout and navigation** (Not started)
      - 11: `Sidebar`, `MailSidebar`, `FolderList`, `FolderListLight`, `FolderListGroup`, `SmartList`, `GenericMobileUIToolbar`, `GenericMobileUISidebar`, `InfiniteScroll`, `ZimletSlot`, `InfoBar`. `ZimletSlot` links to P09.
    - **P32.2.2 `reference/shims/components/menus-and-actions.adoc` – Menus and actions** (Not started)
      - 14: `MenuItem`, `ActionMenu`, `DropDownWrapper`, `ActionMenuItem`, `ActionMenuGroup`, `ActionMenuMoveFolder`, `NestedActionMenuItem`, `ContextMenu`, `ActionButton`, `NakedButton`, `CloseButton`, `HelpButton`, `SMIMEOperationDropDown`, `DeleteWrapper`.
    - **P32.2.3 `reference/shims/components/dialogs-and-feedback.adoc` – Dialogs and feedback** (Not started)
      - 9: `ModalDialog`, `ConfirmModalDialog`, `ModalDrawer`, `ModalDrawerToolbar`, `ResponsiveModal`, `CaptureBeforeUnload`, `HelpTooltip`, `ErrorAlert`, `CertificateModal`.
    - **P32.2.4 `reference/shims/components/form-inputs.adoc` – Form inputs** (Not started)
      - 10: `Select`, `TextInput`, `FormGroup`, `DateInput`, `CustomTimePicker`, `AddressField`, `AddMore`, `TinyMceComposer`, `Picker`, `CalendarOptionItem`.
    - **P32.2.5 `reference/shims/components/domain-widgets.adoc` – Domain widgets** (Not started)
      - 9: `ContactList`, `ContactEditor`, `ContactHoverCardWrapper`, `Avatar`, `AppointmentEdit`, `SignatureBox`, `PdfjsViewer`, `DraggableCard`, `ClientLogo`.
  - **P32.3 `reference/shims/hocs.adoc` – Higher-order components (HOCs)** (Not started)
    - Group page for the HOCs of `@zimbra-client/enhancers` and `@zimbra-client/util` (8 exports). Each section shows its own module path and, where one exists, links to the hook alternative.
    - **P32.3.1 `reference/shims/hocs/environment-and-ui-behaviour.adoc` – Environment and UI behaviour** (Not started)
      - 4: `withMediaQuery`, `withTabManager`, `withTracking`, `clientConfiguration`.
    - **P32.3.2 `reference/shims/hocs/localization.adoc` – Localization** (Not started)
      - 2: `withIntlWrapper` (alias `withZimletIntlWrapper`), `withIntlConsumer`. Link to P32.4 and P23.
    - **P32.3.3 `reference/shims/hocs/composition.adoc` – Composition** (Not started)
      - 2: `withProps`, `branch`.
  - **P32.4 `reference/shims/localization.adoc` – Localization (`@zimbra/preact-i18n`)** (Not started)
    - One page, 9 exports, in three headings. Show text: `Text`, `MarkupText`, `Localizer`. Read text in code: `useText`, `withText`, `translate`. Provide the dictionary: `IntlContext`, `IntlProvider`, `intl`. `IntlProvider` is for content rendered outside the wrapped component; the usual route is `withIntlWrapper` (P32.3.2). Split along the headings if the page is too long.
  - **P32.5 `reference/shims/blocks.adoc` – Blocks UI kit** (Not started)
    - Group page for `@zimbra-client/blocks` (45 exports, from the index of the `@zimbra/blocks` package).
    - **P32.5.1 `reference/shims/blocks/buttons-and-progress.adoc` – Buttons and progress** (Not started)
      - 7: `Button`, `AnimatedButton`, `ProgressButton`, `ProgressIndicator`, `Spinner`, `LoaderBar`, `Skeleton`.
    - **P32.5.2 `reference/shims/blocks/dialogs-and-overlays.adoc` – Dialogs and overlays** (Not started)
      - 8: `Dialog`, `FixedDialog`, `ModalDialog`, `Scrim`, `Popover`, `FixedPopover`, `Tooltip`, `TooltipManager`.
    - **P32.5.3 `reference/shims/blocks/form-inputs-and-choices.adoc` – Form inputs and choices** (Not started)
      - 12: `Select`, `Option`, `Tabs`, `Tab`, `ChoiceInput`, `StyledChoiceInput`, `ColorPicker`, `TimePicker`, `Label`, `AlignedForm`, `AlignedLabel`, `Selection`.
    - **P32.5.4 `reference/shims/blocks/display-and-layout.adoc` – Display and layout** (Not started)
      - 6: `Card`, `Icon`, `ContactAvatar`, `VerticalList`, `WarningBanner`, `AffixBottom`.
    - **P32.5.5 `reference/shims/blocks/behaviour-helpers-and-constants.adoc` – Behaviour helpers and constants** (Not started)
      - 12: `ClickOutsideDetector`, `CloseOnClickOrKeydown`, `ContainerSize`, `withModalManager`, `withGlobalFocusManager`, `useGlobalFocusManager`, `isElementVisible`, `Manager`, `Reference`, `Popper`, `KeyCodes`, `COLORS`.
  - **P32.6 `reference/shims/utilities.adoc` – Utilities** (Not started)
    - Group page for `@zimbra-client/util` (22 exports).
    - **P32.6.1 `reference/shims/utilities/data-text-and-functions.adoc` – Data, text and functions** (Not started)
      - 9: `array`, `isEmpty`, `pruneEmpty`, `htmlEncode`, `htmlToText`, `getDataTransferJSON`, `setDataTransferJSON`, `callWith`, `debounce`.
    - **P32.6.2 `reference/shims/utilities/browser-and-app.adoc` – Browser and app** (Not started)
      - 9: `PageVisibility`, `clipboard`, `getElectron`, `csrfStorage`, `closeNotification`, `getContext`, `startAttachmentDownloadProcess`, `breakpoints`, `zimletEventEmitter`. `zimletEventEmitter` links to P21.
    - **P32.6.3 `reference/shims/utilities/smime-and-calendar.adoc` – S/MIME and calendar** (Not started)
      - 4: `smimeHandler`, `isServerSMIMEFeatureAvailable`, `filterNonInsertableCalendars`, `closeEventTabThunk`.
  - **P32.7 `reference/shims/hooks.adoc` – Hooks** (Not started)
    - Group page for `@zimbra-client/hooks` and `@zimbra-client/hooks/graphql` (20 exports), grouped by area, not by module.
    - **P32.7.1 `reference/shims/hooks/environment.adoc` – Environment** (Not started)
      - 4, all from `@zimbra-client/hooks`: `useClientConfig`, `useTracking`, `useMediaQuery`, `useZimbraContext`.
    - **P32.7.2 `reference/shims/hooks/account-and-preferences.adoc` – Account and preferences** (Not started)
      - 3: `usePreferences`, `useAccountInfo`, `useAvailableLocalesQuery`.
    - **P32.7.3 `reference/shims/hooks/mail.adoc` – Mail** (Not started)
      - 4, all from `@zimbra-client/hooks`: `useSendMessageMutation`, `useOriginalMsgHeader`, `useItemActionMutation`, `useMessageSearchQuery`.
    - **P32.7.4 `reference/shims/hooks/folders.adoc` – Folders** (Not started)
      - 3: `useFoldersQuery`, `useCreateFolderMutation`, `useFolderActionMutation`.
    - **P32.7.5 `reference/shims/hooks/briefcase.adoc` – Briefcase** (Not started)
      - 3: `useDocumentAction`, `useBriefcaseFoldersQuery`, `useSaveDocumentMutation`.
    - **P32.7.6 `reference/shims/hooks/calendar-and-metadata.adoc` – Calendar and metadata** (Not started)
      - 3: `useCalendarsData`, `useCustomMetaData`, `useCustomMetaDataMutation`.
  - **P32.8 `reference/shims/constants.adoc` – Constants** (Not started)
    - 7, from `@zimbra-client/constants`: `ATTENDEE_ROLE`, `PARTICIPATION_STATUS`, `supportedMimes`, `ZIMBRA_ZIMLET_EVENTS`, `EMAIL_SEPARATOR_TAG_ID`, `USER_FOLDER_IDS`, `FLAGS`.
  - **P32.9 `reference/shims/errors-platform-and-pwa.adoc` – Errors, platform and PWA** (Not started)
    - 8: `errorMessage`, `faultCode` (`@zimbra-client/errors`); `getPlatformType`, `PLATFORM_TYPES` (`@zimbra-client/platform`); `openExternalBrowser` (`@zimbra-client/browser`); `getName` (`@zimbra-client/util/contacts`); `isStandalone`, `awaitInstallPrompt` (`@zimbra-client/pwa-utils`).
- **P33** (removed: its shim areas moved under P32 as P32.6 to P32.9, `fetch` calls and the batch client are in P20.2, P20.3 and P43.5, and the server proxy and OAuth client have no page yet; the number is kept so that no page is renumbered)
- **P40** (removed: the blocks pages moved under P32 as P32.5; the number is kept so that no page is renumbered)
- **P43 `reference/context.adoc` – Context** (Drafted)
  - The entry page of the context reference: every `context` field with one line and a link to the page or anchor that documents it, in two groups (fields with members, single values and functions).
  - Brief: sources `context-and-shims.md` §1, §3. The overview and the shared-name warning are in P11. The detail pages below are in the navigation as a sub-list of P43 under reference. They are the child pages P43.1 to P43.10 and were added after P40, so no other page is renumbered.
- **P43.1 `reference/context/plugins.adoc` – Plugins** (Drafted)
  - The group page for `plugins`: what it is for and a list of its members with links. Its members have their own pages, one for each API (pilot of the one-page-per-API layout).
- **P43.1.1 `reference/context/plugins/register.adoc` – register** (Drafted)
  - `plugins.register(name, handler)`.
- **P43.1.2 `reference/context/plugins/unregister.adoc` – unregister** (Drafted)
  - `plugins.unregister(name, handler)`.
- **P43.1.3 `reference/context/plugins/unregister-all.adoc` – unregisterAll** (Drafted)
  - `plugins.unregisterAll()`.
- **P43.4 `reference/context/store.adoc` – Store** (Drafted)
  - Group page for `store`: the standard Redux methods and `zimletRedux`.
- **P43.4.1 `reference/context/store/zimlet-redux.adoc` – Zimlet state** (Drafted)
  - Group page for `store.zimletRedux`.
- **P43.4.1.1 `reference/context/store/zimlet-redux/inject-async-reducer.adoc` – injectAsyncReducer** (Drafted)
  - `injectAsyncReducer(namespace, reducer)`.
- **P43.4.1.2 `reference/context/store/zimlet-redux/add-actions.adoc` – addActions** (Drafted)
  - `addActions(namespace, actions)`.
- **P43.4.1.3 `reference/context/store/zimlet-redux/remove-actions.adoc` – removeActions** (Drafted)
  - `removeActions(namespace)`.
- **P43.4.1.4 `reference/context/store/zimlet-redux/add-selectors.adoc` – addSelectors** (Drafted)
  - `addSelectors(namespace, selectors)`.
- **P43.4.1.5 `reference/context/store/zimlet-redux/remove-selectors.adoc` – removeSelectors** (Drafted)
  - `removeSelectors(namespace)`.
- **P43.4.1.6 `reference/context/store/zimlet-redux/actions.adoc` – actions** (Drafted)
  - `actions` (property).
  - Actions of the Modern UI that Zimlets call, by namespace: `notifications` (`notify`, `clear`), `zimlets` (`addModal`, `removeModal`, `addSlot`, `removeSlot`) and `settings` (`show`, `hide`, `toggle`, `setActiveId`). The other namespaces have no entries, because no active Zimlet calls them.
- **P43.4.1.7 `reference/context/store/zimlet-redux/selectors.adoc` – selectors** (Drafted)
  - `selectors` (property).
- **P43.4.2 `reference/context/store/get-state.adoc` – getState** (Drafted)
  - `getState()`.
- **P43.4.3 `reference/context/store/dispatch.adoc` – dispatch** (Drafted)
  - `dispatch(action)`.
- **P43.4.4 `reference/context/store/subscribe.adoc` – subscribe** (Drafted)
  - `subscribe(listener)`.
- **P43.5 `reference/context/batch-client.adoc` – Batch client** (Drafted)
  - Group page for `zimbraBatchClient`. Documents only the members that Zimlets use and links to P20.2 for the batch client how-to.
- **P43.5.1** (removed: `zimbraBatchClient.accountInfo()` is deprecated and has an entry on P43.10; the number is kept so that no page is renumbered)
- **P43.5.2 `reference/context/batch-client/json-request.adoc` – jsonRequest** (Drafted)
  - `jsonRequest(options)`.
- **P43.5.3 `reference/context/batch-client/origin.adoc` – origin** (Drafted)
  - `origin` (property).
- **P43.5.4 `reference/context/batch-client/resolve.adoc` – resolve** (Drafted)
  - `resolve(path)`.
- **P43.6 `reference/context/zimlets.adoc` – Zimlet manager** (Drafted)
  - Group page for `zimlets`.
- **P43.6.1 to P43.6.3 and P43.6.6** (dropped: `on`, `off`, `emit` and custom events have no page; the numbers are kept so that no page is renumbered)
- **P43.6.4 `reference/context/zimlets/zimlets-initialized.adoc` – zimlets-initialized** (Drafted)
  - Event: Zimlets have finished loading.
- **P43.6.5 `reference/context/zimlets/plugins-changed.adoc` – plugins::changed** (Drafted)
  - Event: a handler was added or removed.
- **P43.6.7 `reference/context/zimlets/invoke-plugin.adoc` – invokePlugin** (Drafted)
  - `invokePlugin(name, ...args)`.
- **P43.6.8 `reference/context/zimlets/is-slot-active.adoc` – isSlotActive** (Drafted)
  - `isSlotActive(slot)`.
- **P43.8 `reference/context/keyboard-shortcuts.adoc` – Keyboard shortcuts** (Drafted)
  - Group page for `keyBindings` and `shortcutCommandHandler`, with a full example.
- **P43.8.1 `reference/context/keyboard-shortcuts/key-bindings.adoc` – Key bindings** (Drafted)
  - Group page for `keyBindings`.
- **P43.8.1.1 `reference/context/keyboard-shortcuts/key-bindings/get-bindings.adoc` – getBindings** (Drafted)
  - `getBindings()`.
- **P43.8.1.2 `reference/context/keyboard-shortcuts/key-bindings/add-bindings.adoc` – addBindings** (Drafted)
  - `addBindings(newBindings)`.
- **P43.8.1.3 `reference/context/keyboard-shortcuts/key-bindings/remove-bindings.adoc` – removeBindings** (Drafted)
  - `removeBindings(paths)`.
- **P43.8.1.4 `reference/context/keyboard-shortcuts/key-bindings/replace-bindings.adoc` – replaceBindings** (Drafted)
  - `replaceBindings(newBindings)`.
- **P43.8.1.5 `reference/context/keyboard-shortcuts/key-bindings/get-commands-and-sequences.adoc` – getCommandsAndSequences** (Drafted)
  - `getCommandsAndSequences(key)`.
- **P43.8.2 `reference/context/keyboard-shortcuts/command-handler.adoc` – Command handler** (Drafted)
  - Group page for `shortcutCommandHandler`.
- **P43.8.2.1 `reference/context/keyboard-shortcuts/command-handler/add-command-handlers.adoc` – addCommandHandlers** (Drafted)
  - `addCommandHandlers(commandHandlers)`.
- **P43.8.2.2 `reference/context/keyboard-shortcuts/command-handler/remove-command-handlers.adoc` – removeCommandHandlers** (Drafted)
  - `removeCommandHandlers(commandHandlers)`.
- **P43.8.2.3 `reference/context/keyboard-shortcuts/command-handler/get-shortcuts.adoc` – getShortcuts** (Drafted)
  - `getShortcuts()`.
- **P43.9 `reference/context/values.adoc` – Single values** (Drafted)
  - Group page for the single-value fields.
- **P43.9.1 `reference/context/values/zimbra-origin.adoc` – zimbraOrigin** (Drafted)
  - `zimbraOrigin` (property).
- **P43.9.2** (removed: `csrfToken` is deprecated and now has an entry on P43.10; the number is kept so that no page is renumbered)
- **P43.9.3 `reference/context/values/meta.adoc` – meta** (Drafted)
  - `meta` (property).
- **P43.9.4 `reference/context/values/host-name.adoc` – hostName** (Drafted)
  - `hostName` (property).
- **P43.10 `reference/context/deprecated.adoc` – Deprecated** (Drafted)
  - The fields that no active Zimlet uses (including all their members) and that have an alternative: `cache`, `shims`, `config`, `utils`, `resourceUrl` (no replacement: it is not specific to a Zimlet), `zimbra` and `getAccount()` (marked deprecated by the code and by the host reference, and used by few Zimlets), `zimbraBatchClient.accountInfo()` (replaced by the `useAccountInfo` hook, or by `jsonRequest` with `GetInfo` outside a component; no active Zimlet uses it), and `csrfToken` (replaced by `csrfStorage.get()` from `@zimbra-client/util`, which reads the current token; `csrfToken` is a copy taken when the Zimlet loads. The org-chart Zimlet still uses it). One entry for each main field, with no entries for its members. Each entry says not to use it and names what to use instead, or says that no replacement exists yet (`utils`: no shimmed module exports `draftForMessage`, `colorForCalendar`, `newAlarm` and `filterNonEditableCalendars`). Unused items that have no alternative stay on their own pages until they are decided.
  - Brief for P43.1 to P43.10 and all their child pages (`context.getApolloClient()` is deliberately not documented: the guide leaves out GraphQL and Apollo, rule in `write-doc.md` section 2. `context.styles` is deliberately not documented too: the build already calls it for every Zimlet, and a call of your own replaces all the CSS from the `.less` files, so authors use `.less` and CSS Modules instead; see P22): one description-list entry for each field and member, with its type, arguments, return value and limits, with no example for now (these pages were written before the member page template gained its `Example` section, so they keep their current form until the user asks to update them; the example files stay in `examples/reference-context/`, unlinked). Verify each entry in the code. Each page is short (about 30 to 90 lines); the structure follows the one-page-per-API style of API references, but fields with almost nothing to say share P43.9 so that no page is nearly empty.
- **P34 `reference/slots.adoc` – Slots and extension points** (Not started)
  - Landing page, written as a nested list and not as a table. Each group links to its page, with its screen pages nested under it as links. A link to P09 for how slots behave.
  - Brief: source `zimlet-slots.yml` (155 catalog names: 146 `ZimletSlot` slots and 9 data keys, which the host reads with direct `invokePlugin` calls), `slot-behavior.md`, `verticals.md`. The 36 names that repeat for each vertical (`<vertical>-tab-item`, `<vertical>-default-tab`, `<vertical>-landing-page`, `-description`, `-videos`) are documented once for each pattern, with the verticals they apply to, so the guide has **124 entries**. Groups and screens come from the host file that renders the slot (the catalog `usages`), not from the name. All `placementAreas` are `unclassified` (KI-15): write each entry with its name, where it renders and "details pending", then research the payloads (`slots.md`) in the order of the slots that active Zimlets register. Entries follow the slot rule in `doc-guide/types.md` section 3. Re-check the groups when the catalog is regenerated (KI-16).
  - **P34.1 `reference/slots/app-shell.adoc` – App shell** (Not started)
    - Group page, 35 entries.
    - **P34.1.1 `reference/slots/app-shell/navigation-and-tabs.adoc` – Navigation and tabs** (Not started)
      - 5: `<vertical>-tab-item`, `<vertical>-default-tab`, `menu`, `vertical-menu-item`, `header-menu-item`.
    - **P34.1.2 `reference/slots/app-shell/landing-pages.adoc` – Landing pages** (Not started)
      - 3: `<vertical>-landing-page`, `<vertical>-landing-page-description`, `<vertical>-landing-page-videos`.
    - **P34.1.3 `reference/slots/app-shell/app-frame-and-sign-in.adoc` – App frame and sign-in** (Not started)
      - 6: `app`, `routes`, `rightbar-50px`, `rightside-zimlet-slot`, `change-password-description`, `show-details-notification-button`.
    - **P34.1.4 `reference/slots/app-shell/settings-and-gear-menus.adoc` – Settings and gear menus** (Not started)
      - 5: `about-link`, `gear-menu`, `language-link`, `settings-dropdown-item`, `settings-dropdown-item-end`.
    - **P34.1.5 `reference/slots/app-shell/ad-slots.adoc` – Ad slots** (Not started)
      - 12: `adSlot-160-600`, `adSlot-300-250-bottom`, `adSlot-300-250-top`, `adSlot-300-600`, `adSlot-adhesion-320-50`, `adSlot-adhesion-728-90`, `adSlot-left-120-90`, `adSlot-left-180-150`, `adSlot-left-300-250`, `adSlot-news`, `top-mail-ad-item`, `top-mail-generic-slot`.
    - **P34.1.6 `reference/slots/app-shell/search.adoc` – Search** (Not started)
      - 4: `search-tips-link`, `searchInputPlaceholder`, `web-search`, `web-search-toggle`.
  - **P34.2 `reference/slots/mail.adoc` – Mail** (Not started)
    - Group page, 37 entries.
    - **P34.2.1 `reference/slots/mail/message-viewer.adoc` – Message viewer** (Not started)
      - 4: `message-body-top`, `message-header-additional-buttons`, `message-smime-status`, `desktop-viewer-footer`.
    - **P34.2.2 `reference/slots/mail/mail-list-and-sidebar.adoc` – Mail list and sidebar** (Not started)
      - 8: `mail-pane`, `mail-preview-pane`, `mail-sender`, `mail-sidebar-footer`, `folder-group`, `folder-list-end`, `folder-list-middle`, `header-action-menu-item`.
    - **P34.2.3 `reference/slots/mail/mail-menus-and-actions.adoc` – Mail menus and actions** (Not started)
      - 8: `action-menu-mail-more`, `mail-overflow-menu-option`, `mail-recall-menu-option`, `print-link`, `mail-folder-context-menu`, `mail-shared-folder-context-menu`, `empty-folder-option`, `recover-discarded-mails-option`.
    - **P34.2.4 `reference/slots/mail/attachments.adoc` – Attachments** (Not started)
      - 5: `attachment-multi-action`, `attachment-single-action`, `email-attachment-action`, `compose-attachment-action-menu`, `attachment-viewer`.
    - **P34.2.5 `reference/slots/mail/composer.adoc` – Composer** (Not started)
      - 12: `composer`, `composer-toolbar-start`, `composer-toolbar-end`, `mail-composer-toolbar-send`, `mail-composer-smime-dropdown`, `mail-header-wrapper`, `from-options`, `compose-sender-options-menu`, `custom-fonts`, `address-pill`, `sender-list-item`, `contact-input-token:button-inner-content`.
  - **P34.3 `reference/slots/calendar.adoc` – Calendar** (Not started)
    - Group page, 13 entries.
    - **P34.3.1 `reference/slots/calendar/calendar-view.adoc` – Calendar view** (Not started)
      - 7: `calendar-body-end`, `calendar-folder-list-end`, `calendar-subscription-list`, `calendar-subscription-menu`, `calendar-subscription-modal-flow`, `calendar-context-add-holiday`, `recover-discarded-appointments-option`.
    - **P34.3.2 `reference/slots/calendar/events-and-appointments.adoc` – Events and appointments** (Not started)
      - 6: `action-menu-event-context-menu`, `action-menu-event-more`, `attendees-chooser-attendees`, `calendar-appointment-edit-location`, `calendar-appointment-edit-video-call`, `private-event-label`.
  - **P34.4 `reference/slots/contacts.adoc` – Contacts** (Not started)
    - 8: `action-menu-contact-list`, `action-menu-contacts-more`, `action-menu-restore-contacts`, `recover-discarded-contacts-option`, `contact-add-server-smime-cert`, `contact-card-item`, `contact-card-messages-and-files`, `contact-hover-card-details`.
  - **P34.5 `reference/slots/briefcase.adoc` – Briefcase** (Not started)
    - 5: `action-menu-briefcase-more`, `briefcase-document-context-menu`, `briefcase-document-header-action`, `briefcase-upload-button`, `recover-discarded-briefcase-option`.
  - **P34.6 `reference/slots/settings.adoc` – Settings** (Not started)
    - Group page, 17 entries.
    - **P34.6.1 `reference/slots/settings/general-and-writing.adoc` – General and writing** (Not started)
      - 10: `dynamic-settings`, `general-setting-bottom`, `set-default-client`, `compose-direction-setting`, `delegates-setting`, `writing-email-post-composer-settings`, `writting-email-additional-settings`, `additional-signature-settings`, `filter-options`, `additional-filter-settings`.
    - **P34.6.2 `reference/slots/settings/calendar-and-reminders.adoc` – Calendar and reminders** (Not started)
      - 7: `browser-calendar-notification-setting`, `calendar-and-reminders-video-call-preferences`, `declined-event-setting`, `default-calendar-setting`, `free-busy-permission-setting`, `show-event-timezone-setting`, `workday-time-zone-setting`.
  - **P34.7 `reference/slots/data-keys.adoc` – Data keys** (Not started)
    - 9, documented apart from the slots (`slots.md`): `messageProcessors:attachPopover`, `messageProcessors:composerProcessor`, `messageProcessors:dateInfoPopover`, `messageProcessors:emailProcessor`, `messageProcessors:eventExcerptProcessor`, `messageProcessors:eventLocationProcessor`, `messageProcessors:eventNotesProcessor`, `messageProcessors:mailPrintProcessor`, `settings`.
      - The `settings` entry lists the keys of the object that a Zimlet registers: `id`, `title`, `component`, `fields` and the optional `afterSave`, each with its type, whether it is required and what it does. It names the props that the dialog passes to `component` (`value`, `onFieldChange`, `activeId`, `handleValidityOfTabs`) and the keys of a field (`type`, `key`, `defaultValue`, and the optional `toJS` and `fromJS`). Check each against `settings-modal.js` (`loadSettingsFromZimlets`, `addSettings`, `handleSave`) and `settings/constants.js`, because the usage comment in the host omits `afterSave`. Link to P12.3.1 and P12.3.2 for the recipes.
  - **P34.8 `reference/slots/all-slots.adoc` – All slots A to Z** (Not started)
    - A description list of every catalog name with a link to its entry, generated from `zimlet-slots.yml` with a script so it can be refreshed. A name that is a vertical pattern links to its pattern entry.
- **P35 `reference/glossary.adoc` – Glossary** (Drafted)
  - One short entry per term, in alphabetical order, each linking to the page that owns the topic. Only short, stable terms that have no concept page of their own: class of service (COS), HMR, Modern UI, semver range, Zimlet, `zmzimletctl`. A concept that has its own page (context, factory, plugin handler, shim, descriptor, sideloader, slot, vertical) is not in the glossary; pages link to the concept page (rule in `write-doc.md` section 2). Remove a term from the glossary when its concept page is planned.

### Part 7 – Help and migration

_Purpose: help a reader who is stuck, has a question, or is moving from Classic Zimlets. Start from the symptom or question, not from the feature._

- **P36 `help-and-migration/troubleshooting.adoc` – Troubleshooting** (Not started)
  - If nothing appears – a checklist of causes, in the order to check (moved from Run and debug).
  - Symptom, cause, fix table – symptoms as the reader sees them.
  - Brief: seed rows: Zimlet silently absent (the server leaves out Zimlets whose version range does not match the Modern UI or that are not enabled for the user), certificate not accepted, `createElement` missing, import not shimmed, missing `zimlet.label`, asset 404 (`publicPath`), disabled for the COS, `off` throws. Source: [zimlet-known-issues.md](../../../zm-modern-zimlets/.agents/reference/zimlet-known-issues.md).
- **P37 `help-and-migration/faq-and-getting-help.adoc` – FAQ and getting help** (Not started)
  - FAQ – answers to the questions authors ask most.
  - Report a documentation or template problem.
  - Where to ask for help and what to include.
  - Brief: built from the guide's facts and the Support and Engineering question review.
- **P38 `help-and-migration/known-limitations-and-gaps.adoc` – Known limitations and gaps** (Not started)
  - Missing information – what is not yet available and who can supply it.
  - Known defects and workarounds.
  - Brief: user-facing form of the [known issues](../../../zm-modern-zimlets/.agents/reference/zimlet-known-issues.md); each gap with what is missing, impact, workaround, owner or next action.
- **P39 `help-and-migration/classic-vs-modern.adoc` – Classic and Modern Zimlets** (Not started)
  - Differences table – what differs between Classic and Modern UI Zimlets.
  - Capability checklist – for each Classic capability: its Modern equivalent, not supported, or unknown.
  - Brief: evidence is thin (gap KI-63); mark entries with no evidence as unknown. Engineering reviews this page last, after all pages are drafted. Sources: `runtime.md` (compat disabled), `context-and-shims.md` (`isCompat`, deprecated `zimbra`), `packaging-deployment.md` §3 (semver filter). The only page where Classic is discussed (rule in `write-doc.md` section 2).

## 2. How to build the guide page by page

For each page:

1. Choose a page whose status is `Not started`.
2. Read the page's entry in section 1: its part purpose, sections, brief and the sources it names. Follow [write-doc.md](../rules/write-doc.md) for structure, examples, diagrams and images. Apply the "one home per topic" convention (section 1.2): link to the page that owns a topic instead of repeating it.
3. Write the page in `modules/ROOT/pages/`. Put examples in `modules/ROOT/examples/`, images in `modules/ROOT/images/` and diagrams in `modules/ROOT/images/diagrams/`.
4. Add the page to `modules/ROOT/nav.adoc`, grouped by the parts of section 1.
5. Verify each claim while you write, section by section, and keep the claim ledger ([doc-guide/claims.md](../rules/doc-guide/claims.md) section 7). Record what cannot be run or confirmed in the [open claims](zimlet-documentation-claims.md), one row per claim mapped to a section id; do not put verification notes in the page.
6. Update the page's status in section 1 to `Drafted`.
7. Optionally run the independent `review-doc` prompt. Only a review that finds no Blocking issue sets `Reviewed`.
