# Zimlet documentation plan

This file is the working index for the Zimlet developer guide (Antora / AsciiDoc site in `zimlet-cli/documentation/`). It lists every page the finished guide will contain, and it is meant to be used **progressively**: pick the next page, write it, record its status here.

- Section 1 is the single place for each page: its purpose, sections, sources and examples.
- Section 2 explains how to build the guide page by page.
- [zimlet-documentation-build.md](./zimlet-documentation-build.md) holds the known gaps that feed the guide and the build order with its phase status.
- [zimlet-documentation-claims.md](./zimlet-documentation-claims.md) lists the open claims: claims that could not be run or confirmed yet, and their status.

Writing rules for every page are in [write-doc.md](../rules/write-doc.md). Review rules are in [review-doc.md](../rules/review-doc.md). Rules for the Zimlet code shown in the guide are in [authoring.md](../rules/authoring.md), and for packaging and deployment steps in [packaging-deployment.md](../rules/packaging-deployment.md). Do not repeat them here.

Use the [zimlet-cli reference index](../../AGENTS.md#topic-to-file-map) and the [zm-x-web Zimlet materials index](../../../zm-x-web/.agents/zimlet/reference/zimlet.md) to find internal reference material while writing. Follow the topic-specific sources they link to, but do not link to these agent files in the published guide.

## 1. Guide structure and page index

### 1.1 Who reads the guide and how they move through it

The guide is organised around what a partner does, in the order they do it: understand, set up, build a first Zimlet, build real features, ship, look things up, get unstuck.

| Reader goal | Route through the guide |
|---|---|
| Decide whether a Zimlet fits my need | P01, P03 |
| Try one quickly | P03 to P06 |
| Build a production Zimlet | Part 1, then Part 2, then pick recipes from Part 3, add features from Part 4, then Part 5 |
| Deploy a Zimlet someone else built (administrator) | P29, then P36 |
| Look something up | Part 6 |
| Something does not work | P36, then P26 and P37 |

### 1.2 Conventions

- **One home per topic.** Every fact lives on one page. Other pages link to it. Where two pages touch the same topic, the split is: _concept and fundamentals pages_ explain how something works, _recipes_ (Part 3) show a complete working result for a goal, _feature guides_ (Part 4) cover the options of one area, and _reference_ (Part 6) holds the complete lookup tables. A page does not repeat a table or example that another page owns.
- **Page types** follow [doc-guide/types.md](../rules/doc-guide/types.md) section 3: Concept, Task, Reference, Troubleshooting. A _recipe_ is a Task page that ends in a complete working Zimlet feature.
- **Status values:** `Not started` · `Drafted` · `Reviewed`. Only the `review-doc` prompt sets `Reviewed`, when a review finds no Blocking issue.
- **Page ids** (`P01` …) are permanent labels used for cross references in this file only. They were assigned in reading order. Do not renumber when a page moves or is dropped, except for the pages of a group that has not been reviewed yet, whose ids may be reassigned to match the order; add new pages with the next free id. A group of pages keeps one plan entry and one status for each page, and the entry page of the group is the parent. `P43.2` (a styles page) and `P43.3` (a cache page) and `P43.7` (a utilities page) are retired and not reused. A child id is `<parent id>.<n>`, such as `P43.1`, numbered in reading order from 1. Add a new child with the next free number under its parent. `P02` and `P19` are retired and not reused (P19, a sample Zimlet page, was dropped: examples come from existing Zimlets in `zm-modern-zimlets`). File names refer to `modules/ROOT/pages/`.
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
  - Brief: about one screen of text, plain language. Sources: `architecture.md`, `runtime.md`. Internals do not belong here: shim mechanism goes to P10, shared iframe, restart on save and dev versus production loading to P26, server bundle and version filtering to P28 and P29. Diagram: build, package, deploy, load, `init()`, slot (simplified from `architecture.md` §1).
- **P04 `getting-started/prerequisites.adoc` – What you need before you start** (Drafted)
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
  - `package.json` – a short pointer to P41, which owns the fields and scripts.
  - `src/index.js` – the entry file and what the host expects from its default export.
  - `src/intl/en_US.json` – the strings file, including the `zimlet.label` and `zimlet.description` block.
  - `config_template.xml` (optional) – when to add it for administrator-edited settings.
  - `zimlet.config.js` (optional) – when to add it to change the build.
  - Zimlet naming rules – Zimlet name, folder name, slug and i18n namespace.
  - Brief: sources `authoring.md` §1, `packaging-deployment.md` §1 and §2, and the default template. The folder tree and lint setup come only from the template (`doc-guide/examples.md` section 4); do not take them from the monorepo Zimlets. Examples: the minimum package files and the template's folder tree.
- **P41 `fundamentals/package-json.adoc` – The package.json file** (Drafted)
  - Identity and entry – `name`, `version`, `private`, `module`, `main`, and the fields the build ignores.
  - Scripts – each script of the default template's `package.json`, what it runs and what to set.
  - Dependencies – `dependencies` versus `devDependencies`, and what ends up in the bundle. Link to P31 for the dependency inventory and to P10 for the libraries not to add.
  - Brief: split out of P07 so that P07 can explain the folders. Sources: the default template's `package.json`, `package.js` and the build entry resolution. Reference page: description list entries with anchors, no examples (the minimum `package.json` example is on P07). P31 keeps the complete inventory and links here for the explanation.
- **P08 `fundamentals/factory-and-lifecycle.adoc` – Factory and lifecycle** (Drafted)
  - The default export factory – the entry point, with a minimal example.
  - The `context` argument – what it is and how the factory receives it (fields are in P11).
  - `init()` – what it is for, when it runs and what to put in it.
  - Async setup – asynchronous work, such as a lookup, then registering plugins when it finishes.
  - Register and unregister conditionally – register only when a condition holds and remove with the same function reference.
  - Headless Zimlets – a Zimlet with no UI that only reacts to events or processes data (link to P16 and P18).
  - Brief: sources `authoring.md` §2, `runtime.md`. Include that the host calls the factory with `new` when it is constructible and as a plain call otherwise, and that for a Zimlet disabled for the account the factory still runs but `init()` is skipped, so keep factories free of side effects. Examples: factory example; lifecycle diagram.
- **P09 `fundamentals/extending-the-ui.adoc` – Extend the UI with slots** (Not started)
  - How slots work – where slots render and how handlers are called.
  - Register a handler – `plugins.register` for a slot, with a minimal example.
  - Handler return types – an element, a function, a component or a plain value.
  - Props and payload – what a slot passes to your handler and how to read it.
  - Hooks in handlers – using hooks without breaking the render.
  - Error isolation – a failing handler does not affect other handlers.
  - Find a slot – locate a slot in the running UI (`?zimletSlots=show`, see P26) and in the slot index (P34).
  - Slots and `invokePlugin` extension points – the difference and when each applies.
  - Render-prop slots and `RemovableSectionZimlet` slots – slots that give your handler a function to call, and the slots of that component.
  - Other registration keys – one short paragraph each for `settings` (see P15) and `messageProcessors:*` (see P16).
  - Choose a slot – a short checklist of questions, and a table by goal (add content, add an action, add a settings page, add a tab and screen) with the slot to use and the recipe that applies it.
  - Brief: sources `slot-behavior.md`, `authoring.md` §3, `verticals.md`, `zimlet-slots.yml`. Confirm slot choices against the catalog. Slots are in scope end to end here, but per-slot placement and payload detail (all `unclassified` today) is a later phase: keep the structure open so it can be added per slot. This page owns slot mechanics only; complete examples are the recipes P13 to P16, and the full list is P34. Examples: minimal registration; slot rendering diagram.
- **P10 `fundamentals/shared-libraries.adoc` – Shared libraries and imports** (Not started)
  - What you may import – the libraries a Zimlet imports from the host.
  - What gets bundled – what a build puts in `index.js`: your code and every import that is not shared; how shimmed imports are replaced with the host's own copies and what that means for bundle size.
  - Libraries you must not add – libraries the host provides that must not be in `package.json`.
  - JSX and `createElement` – why JSX needs `createElement` from `preact` and how to import it.
  - Icons – pass a component as an icon instead of a string name.
  - The `Export … was not found` error – what it means and how to fix it.
  - Brief: sources `context-and-shims.md` §2, `authoring.md` §4, trimmed to what authors use. The full module table is P32. Examples: short import examples.
- **P11 `fundamentals/host-context.adoc` – The context object** (Drafted)
  - What the host hands to a Zimlet – open with what the Modern UI passes through `context`.
  - Fields by job – only the `context` fields that have a page in the API reference, other than the Deprecated page, grouped by what they are for. Each job gets a short explanation of what the field is for, when to pick it and how it relates to the other fields of that job, with a link to the concept page that teaches it (`plugins` and `zimlets` to P09, `store`, `zimbraBatchClient` and `zimbraOrigin` to P20), and to its page in P43 to P43.9 only when no concept page is planned (`meta`, `hostName`, `keyBindings`, `shortcutCommandHandler`). No deprecated fields. No types, arguments or examples here.
  - Zimlets that load from the server share one name – the effect on `plugins.unregisterAll()`.
  - Brief: concept page, source `context-and-shims.md` §1. The field detail is in P43 and P43.1 to P43.10, which are the only full `context` inventory in the guide.

### Part 3 – Build by goal

_Purpose: give complete, working, reusable recipes that combine the fundamentals into a Zimlet feature a partner actually wants. Each recipe is a task: goal, steps, expected result, how to verify. Explain mechanics by linking to the Part 2 and Part 4 page that owns them. Confirm every registration key and slot against the catalog and real code before documenting it._

- **P12 `build-by-goal/recipes.adoc` – Build by goal: choose a recipe** (Not started)
  - Recipe chooser – a table from goal to recipe.
  - Recipe list – links to P13 to P18.
  - Confirm before you build – the slot or registration key must be confirmed against P34 and the feature page.
  - Brief: entry point for Part 3. Map reader goals to the recipes and link to the concept, feature and reference pages; do not repeat implementations. Example: chooser table.
- **P13 `build-by-goal/recipe-existing-screen-content.adoc` – Add content to an existing screen** (Not started)
  - Complete recipe: select a content slot, register a handler, render a small component.
  - Explain the slot choice, relevant props and how to verify the result.
  - Brief: sources `slot-behavior.md`, `authoring.md` §3, P11, and the real `slot::message-body-top` example in personal-notes. Links P09 and P34 for mechanics. Example: complete recipe with a verification checklist.
- **P14 `build-by-goal/recipe-tab-and-route.adoc` – Add a tab and a screen** (Not started)
  - Add a screen and its route – register the route for the screen's URL.
  - Add a tab item – the menu item that opens the screen.
  - Read the route slug – build links with `useClientConfig`.
  - Verticals – what the built-in top-level areas (video, chat, cloud, integrations) are for, and a table of which slot activates which vertical.
  - Verify the result.
  - Brief: replaces the former "Tabs, routes and verticals" page. Sources `verticals.md`, `authoring.md` §3, and the template's `slot::email-tab-item` and `slot::routes` example. Example: complete recipe with a verification checklist; slot activation table.
- **P15 `build-by-goal/recipe-settings-page.adoc` – Add a settings page** (Not started)
  - Complete recipe: register under the `settings` key and render the page.
  - Explain where settings fit in the host UI; link to P20 for administrator configuration.
  - Brief: sources `authoring.md` §3, P09 and the verified settings implementation. Verify the registration key and behaviour before documenting. Example: complete recipe with a verification checklist.
- **P16 `build-by-goal/recipe-message-processing.adoc` – Process messages without UI** (Not started)
  - Complete recipe: register a message processor under `messageProcessors:<kind>` and handle its payload.
  - When this pattern is appropriate and how to verify it. It is not the same mechanism as app events (P21).
  - Brief: sources `authoring.md` §2–3, P09 and the verified message-processor implementation. Example: complete recipe with a verification checklist.
- **P17 `build-by-goal/recipe-server-data.adoc` – Show data from the server** (Not started)
  - Complete recipe: a small `fetch` helper (origin, credentials, CSRF header from `csrfStorage.get()`) and one call that uses it, plus a ready-made hook such as `useAccountInfo`, rendered in a component.
  - How to verify, and what fails when the session or token is wrong.
  - Brief: sources `context-and-shims.md` §1, `authoring.md` §7, the `fetch` helper and SOAP call in `zimbra-zimlet-org-chart/src/api` (`FetchRequest` with `zimbraOrigin` from `context`; the Zimlet reads `csrfToken` from `context` too, but the guide uses `csrfStorage.get()` from `@zimbra-client/util` instead, `credentials: 'include'`, header `X-Zimbra-Csrf-Token`, `POST /service/soap/<Request>`). Links P20 for the options. No GraphQL. Example: a helper and component written for the page from that pattern and built in a scratch Zimlet. The proxy variant (`zimbra-zimlet-chat`, an extension path) is product-specific and not needed here.
- **P18 `build-by-goal/recipe-app-events.adoc` – React to app events** (Not started)
  - Two examples: delay sending a message and delay logout, with `zimletEventEmitter`.
  - Remove the listener correctly; verify the behaviour.
  - Brief: source `context-and-shims.md` §4. Links P21 for the event table. Example: listener examples written for the page and built in a scratch Zimlet.

### Part 4 – Go deeper

_Purpose: cover the options and details of one feature area per page, for authors who already built a first Zimlet. Do not repeat complete recipes from Part 3._

- **P20 `go-deeper/data-and-state.adoc` – Data and state** (Not started)
  - Call a server API with `fetch` – the helper and its origin, credentials, CSRF header and the optional proxy (the worked call is P17).
  - Ready-made data hooks (`useAccountInfo`, `usePreferences`, …) – the host hooks for common data; no direct GraphQL.
  - Batch client – when and how to use it.
  - Redux (`store.zimletRedux`) – shared state.
  - Administrator configuration with `config_template.xml` – how a setting is declared and how the Zimlet reads it.
  - Mailbox metadata – read and write.
  - Platform checks – check the platform (desktop or browser) before using a feature.
  - Brief: sources `context-and-shims.md` §2–3, `authoring.md` §7, `packaging-deployment.md` §2. The guide documents ready-made hooks only, never GraphQL (rule in `write-doc.md` section 2). The `fetch` examples follow the existing Zimlets: Zimbra SOAP over `POST /service/soap/<Request>` as in `zimbra-zimlet-org-chart`. A proxy path is not a general option: `zimbra-zimlet-chat` uses its own extension path, so mention it only as a product-specific case. To investigate: which hooks to list. Examples: short snippets per topic; hook, Redux and config examples.
- **P21 `go-deeper/app-events.adoc` – App events** (Not started)
  - `zimletEventEmitter` and `ZIMBRA_ZIMLET_EVENTS` – the event bus and the full event table (the only full event table in the guide).
  - Synchronous and asynchronous listeners – how to choose.
  - Removing listeners (`off` throws) – how to remove one and why a wrong call throws.
  - Brief: source `context-and-shims.md` §4. Use cases are in P18. Examples: listener example; event table.
- **P22 `go-deeper/styling.adoc` – Styling** (Not started)
  - Less and CSS – how to write styles and where to put them.
  - CSS Modules and global styles – when styles are scoped and when they are global.
  - Host-injected styles – what the host adds that your styles interact with.
  - Host style variables – the shared variables (primary colour and similar) and how to use them instead of fixed values.
  - Custom properties – define your own, and set their values at run time on an element with the `style` prop. Switch classes for finite variants.
  - Do not call `context.styles.set`: the build calls it once with all your CSS, and a call of your own replaces that CSS (seen in a built bundle with a stand-in host; not run in the Modern UI). Warn the reader; do not document the field as API.
  - Brief: sources `authoring.md` §5; the public `@zimbra/x-ui` package (npm and GitHub, `zm-x-ui`: `variables.less`, `refs.less`, `helpers.less`, `css-variables.css`, `palette.css`). A Zimlet adds it to `dependencies` (`"@zimbra/x-ui": "^13.1.0"` in the existing Zimlets) and imports it in a `.less` file: `@import '~@zimbra/x-ui/variables.less';` or `refs.less` for variables such as `@brand-primary`, and `helpers.less` for mixins (seen in `zimbra-zimlet-custom-fonts`, `zimbra-zimlet-calendar-subscription` and `zimbra-zimlet-attachment-missing-alert`). Recommend these variables over hard-coded values. To investigate: which variables are common enough to list. Example: `.less` using an x-ui variable.
- **P23 `go-deeper/localization.adoc` – Localization** (Not started)
  - `src/intl/*.json` – structure and naming of locale files.
  - `withIntl` and `<Text id>` – load and show strings.
  - `zimlet.label` and `zimlet.description` – define the label and description for the admin console and the UI.
  - Add a locale.
  - Brief: sources `authoring.md` §6, repo `AGENTS.md` (translation pointer). Examples: `en_US.json` and `enhancers.js`.
- **P24 `go-deeper/security-and-best-practices.adoc` – Security and best practices** (Not started)
  - What the browser sandbox does not give you – the shared same-origin iframe is not a security boundary (shared `window`).
  - Sanitise HTML – use the shimmed `dompurify` before rendering untrusted content.
  - Secrets and tokens – the bundle is served to every user, so keep secrets out of it and never log tokens.
  - Calls to external services – use the server proxy; what to check before sending user data out.
  - Brief: new page for partners. No source file covers this; research from `runtime.md`, `context-and-shims.md` (the `dompurify` shim) and the host code, and mark what cannot be confirmed as unverified. Engineering reviews this page last, after all pages are drafted (see the [build order](zimlet-documentation-build.md#build-order)).
- **P25 `go-deeper/advanced.adoc` – Advanced topics** (Not started)
  - Customise webpack (`zimlet.config.js`) – change the build, with a small example.
  - Non-Preact UI – write a Zimlet in another framework and what is lost.
  - Call external services through `/service/proxy`.
  - Assets and `publicPath` – load images and fonts correctly in a deployed Zimlet.
  - OAuth client – use it for services that need a login.
  - Brief: sources `cli-commands.md` (webpack), `packaging-deployment.md` §3. Signatures live in P33. Example: `zimlet.config.js`, starting from the default template's.

### Part 5 – Test, package, deploy

_Purpose: tasks for running, testing, packaging and deploying a Zimlet, each with a way to check the result. Explain internals only when they explain a failure._

- **P26 `test-package-deploy/run-and-debug.adoc` – Run and debug** (Not started)
  - `zimlet watch` options – each option and when to use it.
  - Sideloader steps and "persist" – load the development URL and keep it with the persist option.
  - Development versus production loading – a comparison, the shared same-origin iframe and what it means (shared `window`; see P24), and the soft restart on save.
  - Hot reload behaviour – what happens in the browser on save.
  - Browser console messages – what to look for and what they mean.
  - Debug slots (`?zimletSlots=show`) – show every slot in the page.
  - If nothing appears – link to P36.
  - Brief: sources `cli-commands.md` (development loading), `runtime.md` (debugging), `packaging-deployment.md`.
- **P27 `test-package-deploy/testing.adoc` – Test your Zimlet** (Not started)
  - Static checks – lint and build before every test. Link to P42 for the lint steps and do not repeat them.
  - Manual test plan – a repeatable list of things to try in Modern UI.
  - Test accounts and COS – which accounts and class-of-service settings to test with.
  - Regression checklist – checks to repeat before a release.
- **P42 `test-package-deploy/lint-your-code.adoc` – Lint** (Drafted)
  - Run the checks – `npm run lint` and its expected output.
  - Fix a reported problem – one worked example: text typed into a component, the `Untranslated text` message and the fix with `Text` and `en_US.json`.
  - Fix formatting automatically – `npm run lint:fix` and what it does not fix.
  - `eslint.config.mjs` – what the template file contains, how to change a rule, how to check specific files and print the active configuration.
  - Lint on every commit – the commit hooks of the template.
  - Brief: task page, split out of P07. Sources: the default template's `eslint.config.mjs`, `package.json` and `.husky/`, and `@zimbra/eslint-config`. P27 links here for static checks.
- **P28 `test-package-deploy/build-and-package.adoc` – Build and package** (Not started)
  - `zimlet build` – what it does and what it writes to `build/`.
  - `zimlet package` and its options – each option, with the exact command.
  - The generated descriptor and `.properties` files – what they contain and the descriptor attributes an author controls, including `zimbraXZimletCompatibleSemVer` as a version range (the full element list is P31).
  - Where the zip is written – and how to change it.
  - Choose the `--zimbraXVersion` range – match the Modern UI version you target; find the host version in Settings, then About.
  - Keep it compatible – what to do when the Modern UI is upgraded (versioning gap A11; flag unverified).
  - `--publicpath` – when to set it and what it changes.
  - Brief: sources `packaging-deployment.md` §1, `cli-commands.md`. Example: descriptor XML written for this page.
- **P29 `test-package-deploy/deploy.adoc` – Deploy** (Not started)
  - Hand over to an administrator – what to give someone who owns the server: the zip, the target version range, the COS to enable, the settings to configure, and the verification list.
  - Deploy with `zmzimletctl` – the commands and expected output.
  - Flush the Zimlet cache – so users get the Zimlet.
  - Enable per COS and per user.
  - Enable or disable from Modern UI user settings – how an end user manages a deployed Zimlet; confirm the exact labels and behaviour in a live session.
  - Admin console – the same steps in the admin console.
  - Configure with `zmzimletctl configure` – set a Zimlet's settings.
  - Restart note – whether a restart is needed after each action.
  - Verification checklist – checks that confirm a deploy worked.
  - Update, redeploy, undeploy, roll back – deploy a new version, remove a Zimlet, go back (gap A5; flag unverified).
  - Brief: source `packaging-deployment.md` §3 and §4, trimmed to author consequences. Include how the server builds one bundle from the enabled Zimlets and filters it by version range. Commands inline.

### Part 6 – Reference

_Purpose: complete facts for lookup. Tables and entries only, no tutorial text._

- **P30 `reference/cli.adoc` – CLI reference** (Not started)
  - Every `zimlet` command and option, with defaults.
  - Brief: source `cli-commands.md`.
- **P31 `reference/files.adoc` – File reference** (Not started)
  - `package.json` scripts – the scripts of the default template's `package.json`.
  - `package.json` dependencies – inventory of packages used by active Zimlets in both monorepos, each with its purpose, distinguishing runtime dependencies, build tools, and host-provided shims.
  - Descriptor XML – every element and attribute.
  - `config_template.xml` – structure of the admin settings file.
  - `zimlet.config.js` – shape of the build configuration function.
  - `en_US.json` – structure of the strings file.
  - Brief: sources `packaging-deployment.md`, `authoring.md`, and the default template for the file shapes, scripts and lint setup (`doc-guide/examples.md` section 4). The dependency inventory is the one part that reads the active Zimlets' `package.json` manifests and their imports in both monorepos. Examples: file examples.
- **P32 `reference/shims.adoc` – Modules, components and enhancers** (Drafted)
  - The full module table – every shimmed import path, with the names it exports.
  - UI components – the components exported from `@zimbra-client/components`, one line each.
  - Brief: source `context-and-shims.md` §2 and `shims.js`. Written as an inventory: every module and export, a short note on when to use it (inventory rules in `doc-guide/types.md` section 3). The only full module table in the guide. GraphQL queries and wrappers are listed by module only. `@zimbra-client/blocks` has one module entry that links to P40; its exports are not listed here. Split from P33 and P40 to keep each page short.
- **P33 `reference/apis-hooks.adoc` – APIs and hooks** (Drafted)
  - `fetch`-based API calls, batch client, host hooks by area, utilities and constants, platform and browser helpers, server proxy, OAuth client.
  - Brief: each entry has its name, signature or usage and a short note on when and why to use it. Verify every export in `shims.js` and the host `src/hooks` folders. Document ready-made hooks, not GraphQL queries. How-to text stays in P20 and P25. List every export (inventory rules in `doc-guide/types.md` section 3). Components and the module table are in P32.
- **P40 `reference/blocks.adoc` – Blocks UI kit** (Not started)
  - The exports of `@zimbra-client/blocks`, grouped by area under headings: buttons and progress, dialogs and overlays, popovers and tooltips, form inputs and choices, layout and lists, focus and click helpers, constants and enhancers.
  - Brief: about 50 exports. Source: the `allBlocks` entry in `shims.js` and the exports of the `@zimbra/blocks` package index; verify each name against them. One entry per export with its name and when to use it in one or two sentences (inventory rules in `doc-guide/types.md` section 3). Check the length before you write (rule 0 in `write-doc.md`). Link the module entry in P32 to this page. This page was added after P33 and keeps the next free number, so no other page is renumbered. It sits in Part 6 after P33.
- **P43 `reference/context.adoc` – Context** (Drafted)
  - The entry page of the context reference: every `context` field with one line and a link to the page or anchor that documents it, in two groups (fields with members, single values and functions).
  - Brief: sources `context-and-shims.md` §1, §3. The overview and the shared-name warning are in P11. The detail pages below are in the navigation as a sub-list of P43 under API reference. They are the child pages P43.1 to P43.10 and were added after P40, so no other page is renumbered.
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
- **P43.4.1.7 `reference/context/store/zimlet-redux/selectors.adoc` – selectors** (Drafted)
  - `selectors` (property).
- **P43.4.2 `reference/context/store/get-state.adoc` – getState** (Drafted)
  - `getState()`.
- **P43.4.3 `reference/context/store/dispatch.adoc` – dispatch** (Drafted)
  - `dispatch(action)`.
- **P43.4.4 `reference/context/store/subscribe.adoc` – subscribe** (Drafted)
  - `subscribe(listener)`.
- **P43.5 `reference/context/batch-client.adoc` – Batch client** (Drafted)
  - Group page for `zimbraBatchClient`. Documents only the members that Zimlets use and links to P33 for the rest.
- **P43.5.1** (removed: `zimbraBatchClient.accountInfo()` is deprecated and has an entry on P43.10; the number is kept so that no page is renumbered)
- **P43.5.2 `reference/context/batch-client/json-request.adoc` – jsonRequest** (Drafted)
  - `jsonRequest(options)`.
- **P43.5.3 `reference/context/batch-client/origin.adoc` – origin** (Drafted)
  - `origin` (property).
- **P43.5.4 `reference/context/batch-client/resolve.adoc` – resolve** (Drafted)
  - `resolve(path)`.
- **P43.6 `reference/context/zimlets.adoc` – Zimlet manager** (Drafted)
  - Group page for `zimlets`.
- **P43.6.1 `reference/context/zimlets/on.adoc` – on** (Drafted)
  - `on(event, handler)`.
- **P43.6.2 `reference/context/zimlets/off.adoc` – off** (Drafted)
  - `off(event, handler)`.
- **P43.6.3 `reference/context/zimlets/emit.adoc` – emit** (Drafted)
  - `emit(event, data)`.
- **P43.6.4 `reference/context/zimlets/zimlets-initialized.adoc` – zimlets-initialized** (Drafted)
  - Event: Zimlets have finished loading.
- **P43.6.5 `reference/context/zimlets/plugins-changed.adoc` – plugins::changed** (Drafted)
  - Event: a handler was added or removed.
- **P43.6.6 `reference/context/zimlets/custom-events.adoc` – Custom events** (Drafted)
  - Events that Zimlets name themselves.
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
  - Brief for P43.1 to P43.10 and all their child pages (`context.getApolloClient()` is deliberately not documented: the guide leaves out GraphQL and Apollo, rule in `write-doc.md` section 2. `context.styles` is deliberately not documented too: the build already calls it for every Zimlet, and a call of your own replaces all the CSS from the `.less` files, so authors use `.less` and CSS Modules instead; see P22): one description-list entry for each field and member, with its type, arguments, return value and limits, with no example for now (the second exception in `doc-guide/types.md` section 3; the example files stay in `examples/reference-context/`, unlinked). Verify each entry in the code. Each page is short (about 30 to 90 lines); the structure follows the one-page-per-API style of API references, but fields with almost nothing to say share P43.9 so that no page is nearly empty.
- **P34 `reference/slots.adoc` – Slot and extension-point index** (Not started)
  - How to read an entry – what each column means.
  - Table of all extension points – generated from the slot catalog.
  - Brief: generated from `zimlet-slots.yml` with a script so it can be refreshed. Columns: name, kind, host source file and owner, props or arguments, flags (render-prop, non-updating, wrapper). Only scanner-derived facts; placement and payload meaning say "details pending".
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
  - Brief: built from the guide's facts and the Support and Engineering question review ([build order](zimlet-documentation-build.md#build-order), phase 8).
- **P38 `help-and-migration/known-limitations-and-gaps.adoc` – Known limitations and gaps** (Not started)
  - Missing information – what is not yet available and who can supply it.
  - Known defects and workarounds.
  - Brief: user-facing form of the [known gaps](zimlet-documentation-build.md#known-gaps-that-feed-the-guide); each gap with what is missing, impact, workaround, owner or next action.
- **P39 `help-and-migration/classic-vs-modern.adoc` – Classic and Modern Zimlets** (Not started)
  - Differences table – what differs between Classic and Modern UI Zimlets.
  - Capability checklist – for each Classic capability: its Modern equivalent, not supported, or unknown.
  - Brief: evidence is thin (gap A12); mark entries with no evidence as unknown. Engineering reviews this page last, after all pages are drafted (see the [build order](zimlet-documentation-build.md#build-order)). Sources: `runtime.md` (compat disabled), `context-and-shims.md` (`isCompat`, deprecated `zimbra`), `packaging-deployment.md` §3 (semver filter). The only page where Classic is discussed (rule in `write-doc.md` section 2).

## 2. How to build the guide page by page

For each page, in the [build order](zimlet-documentation-build.md#build-order):

1. Choose a page whose status is `Not started` and whose dependencies (see the [build order](zimlet-documentation-build.md#build-order)) are `Done` in the phase status column, or that the user confirms you may write before they are `Done`.
2. Read the page's entry in section 1: its part purpose, sections, brief and the sources it names. Follow [write-doc.md](../rules/write-doc.md) for structure, examples, diagrams and images. Apply the "one home per topic" convention (section 1.2): link to the page that owns a topic instead of repeating it.
3. Write the page in `modules/ROOT/pages/`. Put examples in `modules/ROOT/examples/`, images in `modules/ROOT/images/` and diagrams in `modules/ROOT/images/diagrams/`.
4. Add the page to `modules/ROOT/nav.adoc`, grouped by the parts of section 1.
5. Verify each claim while you write, section by section, and keep the claim ledger ([doc-guide/claims.md](../rules/doc-guide/claims.md) section 7). Record what cannot be run or confirmed in the [open claims](zimlet-documentation-claims.md), one row per claim mapped to a section id; do not put verification notes in the page.
6. Update the page's status in section 1 to `Drafted`.
7. Optionally run the independent `review-doc` prompt. Only a review that finds no Blocking issue sets `Reviewed`.
