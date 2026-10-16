# Zimlet documentation plan

This file is the working index for the Zimlet developer guide (Antora / AsciiDoc site in `zimlet-cli/documentation/`). It lists every page the finished guide will contain, and it is meant to be used **progressively**: pick the next page, write it, record its status here.

- Section 1 is the single place for each page: its purpose, sections, sources and examples.
- Section 2 explains how to build the guide page by page.
- Sections 3 to 5 hold scope decisions, the sample Zimlet and the known gaps that feed the guide.
- Section 6 is the build order. Section 7 lists open questions.

Writing rules for every page are in [write-doc.md](../rules/write-doc.md). Review rules are in [review-doc.md](../rules/review-doc.md). Rules for the Zimlet code shown in the guide are in [authoring.md](../rules/authoring.md), and for packaging and deployment steps in [packaging-deployment.md](../rules/packaging-deployment.md). Do not repeat them here.

Use the [zimlet-cli reference index](../../AGENTS.md#topic-to-file-map) and the [zm-x-web Zimlet materials index](../../../zm-x-web/.agents/zimlet/AGENTS.md) to find internal reference material while writing. Follow the topic-specific sources they link to, but do not link to these agent files in the published guide.

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
- **Page types** follow [write-doc.md](../rules/write-doc.md) section 3: Concept, Task, Reference, Troubleshooting. A _recipe_ is a Task page that ends in a complete working Zimlet feature.
- **Status values:** `Not started` · `Drafted` · `Reviewed`. Only the `review-doc` prompt sets `Reviewed`, when a review finds no Blocking issue.
- **Page ids** (`P01` …) are permanent labels used for cross references in this file only. They were assigned in reading order. Do not renumber when a page moves or is dropped; add new pages with the next free id. `P02` is retired and not reused. File names refer to `modules/ROOT/pages/`.
- **Each part states its purpose.** A page must match the purpose of the part it is in (rule in `write-doc.md` section 2). The _Brief_ of each page names its sources and examples; the planned sections are a starting point, and the sources decide the final detail.

### Part 0 – Welcome

_Purpose: orient the reader: what a Zimlet is, who the guide is for and where to start. Plain words, no API detail, no step-by-step instructions._

- **P01 `index.adoc` – Zimlets documentation** (Not started)
  - What is a Zimlet – what a Zimlet is and what it adds to the Modern UI, in plain words.
  - Who this guide is for – front-end developers building Zimlets for Modern UI, and the knowledge it assumes.
  - What you will build – the outcome: a working Zimlet that is built, packaged and deployed.
  - How the guide is organised – the parts of the guide and what each is for.
  - Reading paths – the routes of section 1.1: evaluate, try, build a production Zimlet, deploy as an administrator, look something up.
  - Brief: short. Names the audience and the routes. No technical detail. Does not link to P39 (Classic and Modern).

### Part 1 – Get started

_Purpose: take a newcomer from nothing to a working first Zimlet. Give only what the next step needs: a short mental model, requirements, setup and one tutorial. No internals, option catalogues or alternatives._

- **P03 `concepts.adoc` – How Zimlets work** (Drafted)
  - The big picture (diagram) – one diagram and short text from source file to the Modern UI.
  - A bundle and a descriptor – what `zimlet build` and `zimlet package` produce: a single JavaScript file and an XML descriptor in a zip.
  - Factory and `init()` – the entry-file contract: a default-exported factory that receives `context`, and an `init()` that registers everything.
  - Slots and plugins – how a Zimlet adds UI: named slots and the plugin handlers it registers; other registration keys (`settings`, `messageProcessors:<kind>`) exist.
  - Shared libraries – why a Zimlet imports Preact and host libraries instead of bundling copies; link to P10.
  - Try it while you develop – how `zimlet watch` and the sideloader load a Zimlet during development.
  - Brief: about one screen of text, plain language. Sources: `architecture.md`, `runtime.md`. Internals do not belong here: shim mechanism goes to P10, shared iframe, restart on save and dev versus production loading to P26, server bundle and version filtering to P28 and P29. Diagram: build, package, deploy, load, `init()`, slot (simplified from `architecture.md` §1).
- **P04 `prerequisites.adoc` – What you need before you start** (Not started)
  - Get a test environment – what a Zimbra server must provide to develop against: Modern UI, shell or admin console access, a test account, the Modern UI version, the sideloader. Say plainly what to do when you have no server (gap A1).
  - Technology table – each technology needed, why, the level required and a link to its official documentation, so the guide does not re-teach it.
  - Brief: table columns: technology, why you need it, level, official docs. Technologies: JavaScript, Node.js 24 and npm, Git, Preact and JSX, CSS/Less and CSS Modules, Redux (shared state only), `preact-router`, semver ranges, ESLint, an editor, POSIX shell basics, HTTPS and self-signed certificates. This page also replaces the former "Further reading" page. Check that every official link is live.
- **P05 `setup-environment.adoc` – Set up your machine** (Not started)
  - Install Node 24 – install and check the version.
  - Install Git and an editor.
  - Install the `zimlet` CLI – install and check that it runs.
  - Find your Modern UI version – read it from the About dialog; it later sets the `--zimbraXVersion` range.
  - Install and enable the sideloader – install the sideloader Zimlet and enable it for your account.
  - Accept the development HTTPS certificate – trust the development server's self-signed certificate in the browser.
  - Ready check – a checklist that confirms the machine and the server are ready for the quickstart.
  - Brief: ends with the ready-check list. Sources: `cli-commands.md`, `packaging-deployment.md` §5. Commands inline.
- **P06 `quickstart.adoc` – Your first Zimlet** (Not started)
  - Create a Zimlet from the template – scaffold with `zimlet create`; what the template gives you.
  - Apply the template fixes – the changes that make the generated project build with the current CLI and Modern UI (temporary; remove when the template is refreshed, see section 7).
  - Run it with `npm run watch` – start the development server and the output to expect.
  - Load it through the sideloader – load the running Zimlet into Modern UI.
  - See the result and change it (HMR) – confirm the Zimlet appears, edit a file and see the change without a reload.
  - Build and package – produce `build/index.js` and the zip, with the exact commands and expected output.
  - Brief: task layout from `write-doc.md`. Applies the template fixes from `needs-attention.md` B1. Ends with a working zip. Sources: `authoring.md`, `cli-commands.md`. Examples from the sample Zimlet. Next step: P07.

### Part 2 – Fundamentals

_Purpose: teach what every Zimlet author must understand, one topic per page. Give the depth needed to build correctly, and explain a mechanism only where it changes what the author writes. Complete working results for a goal belong in Part 3; option lists and lookup tables belong in Parts 4 and 6._

- **P07 `project-structure.adoc` – Project structure** (Not started)
  - Minimum package – the smallest set of files a Zimlet needs.
  - `package.json` field by field – each field and script, what it does and what to set; `dependencies` versus `devDependencies`; repository-specific scripts such as `security:audit` (purpose, availability, how to verify and run it). Link to P31 for the dependency inventory.
  - `src/index.js` – the entry file and what the host expects from its default export.
  - `src/intl/en_US.json` – the strings file, including the `zimlet.label` and `zimlet.description` block.
  - `config_template.xml` (optional) – when to add it for administrator-edited settings.
  - `zimlet.config.js` (optional) – when to add it to change the build.
  - Naming rules – Zimlet name, folder name, slug and i18n namespace.
  - Brief: sources `authoring.md` §1, `packaging-deployment.md` §1 and §2, and active Zimlet `package.json` manifests and scripts in both monorepos. Inspect the definition of `security:audit` and run it in a relevant Zimlet when writing. Examples: `package.json` and folder tree.
- **P08 `factory-and-lifecycle.adoc` – Factory and lifecycle** (Not started)
  - The default export factory – the entry point, with a minimal example.
  - The `context` argument – what it is and how the factory receives it (fields are in P11).
  - `init()` – what it is for, when it runs and what to put in it.
  - Async setup – asynchronous work, such as a lookup, then registering plugins when it finishes.
  - Register and unregister conditionally – register only when a condition holds and remove with the same function reference.
  - Headless Zimlets – a Zimlet with no UI that only reacts to events or processes data (link to P16 and P18).
  - Brief: sources `authoring.md` §2, `runtime.md`. Include that the host calls the factory with `new` when it is constructible and as a plain call otherwise, and that for a Zimlet disabled for the account the factory still runs but `init()` is skipped, so keep factories free of side effects. Examples: factory example; lifecycle diagram.
- **P09 `extending-the-ui.adoc` – Extend the UI with slots** (Not started)
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
  - Brief: sources `slot-behavior.md`, `authoring.md` §3, `verticals.md`, `zimlet-slots.yml`. Confirm slot choices against the catalog. This page owns slot mechanics only; complete examples are the recipes P13 to P16, and the full list is P34. Examples: minimal registration; slot rendering diagram.
- **P10 `shared-libraries.adoc` – Shared libraries and imports** (Not started)
  - What you may import – the libraries a Zimlet imports from the host.
  - What gets bundled – what a build puts in `index.js`: your code and every import that is not shared; how shimmed imports are replaced with the host's own copies and what that means for bundle size.
  - Libraries you must not add – libraries the host provides that must not be in `package.json`.
  - JSX and `createElement` – why JSX needs `createElement` from `preact` and how to import it.
  - Icons – pass a component as an icon instead of a string name.
  - The `Export … was not found` error – what it means and how to fix it.
  - Brief: sources `context-and-shims.md` §2, `authoring.md` §4, trimmed to what authors use. The full module table is P32. Examples: short import examples.
- **P11 `host-context.adoc` – The context object** (Not started)
  - What the host hands to a Zimlet – open with what the Modern UI passes through `context`.
  - Fields and what they are for – one table of the `context` fields an author uses, each with purpose and a short example. This is the only full `context` table in the guide.
  - What is not in the context – things authors expect there and where to get them instead (for example `context.config` is normally `undefined`; use `useClientConfig`).
  - Brief: source `context-and-shims.md` §1. Examples inline, one or two lines each.

### Part 3 – Build by goal

_Purpose: give complete, working, reusable recipes that combine the fundamentals into a Zimlet feature a partner actually wants. Each recipe is a task: goal, steps, expected result, how to verify. Explain mechanics by linking to the Part 2 and Part 4 page that owns them._

- **P12 `recipes.adoc` – Build by goal: choose a recipe** (Not started)
  - Recipe chooser – a table from goal to recipe.
  - Recipe list – links to P13 to P19.
  - Confirm before you build – the slot or registration key must be confirmed against P34 and the feature page.
  - Brief: entry point for Part 3. Map reader goals to the recipes and link to the concept, feature and reference pages; do not repeat implementations. Example: chooser table.
- **P13 `recipe-existing-screen-content.adoc` – Add content to an existing screen** (Not started)
  - Complete recipe: select a content slot, register a handler, render a small component.
  - Explain the slot choice, relevant props and how to verify the result.
  - Brief: sources `slot-behavior.md`, `authoring.md` §3, P11, and the real `slot::message-body-top` example in personal-notes. Links P09 and P34 for mechanics. Example: complete recipe with a verification checklist.
- **P14 `recipe-tab-and-route.adoc` – Add a tab and a screen** (Not started)
  - Add a screen and its route – register the route for the screen's URL.
  - Add a tab item – the menu item that opens the screen.
  - Read the route slug – build links with `useClientConfig`.
  - Verticals – what the built-in top-level areas (video, chat, cloud, integrations) are for, and a table of which slot activates which vertical.
  - Verify the result.
  - Brief: replaces the former "Tabs, routes and verticals" page. Sources `verticals.md`, `authoring.md` §3, and the template's `slot::email-tab-item` and `slot::routes` example. Example: complete recipe with a verification checklist; slot activation table.
- **P15 `recipe-settings-page.adoc` – Add a settings page** (Not started)
  - Complete recipe: register under the `settings` key and render the page.
  - Explain where settings fit in the host UI; link to P20 for administrator configuration.
  - Brief: sources `authoring.md` §3, P09 and the verified settings implementation. Verify the registration key and behaviour before documenting. Example: complete recipe with a verification checklist.
- **P16 `recipe-message-processing.adoc` – Process messages without UI** (Not started)
  - Complete recipe: register a message processor under `messageProcessors:<kind>` and handle its payload.
  - When this pattern is appropriate and how to verify it. It is not the same mechanism as app events (P21).
  - Brief: sources `authoring.md` §2–3, P09 and the verified message-processor implementation. Example: complete recipe with a verification checklist.
- **P17 `recipe-server-data.adoc` – Show data from the server** (Not started)
  - Complete recipe: a small `fetch` helper (origin, credentials, CSRF header) and one call that uses it, plus a ready-made hook such as `useAccountInfo`, rendered in a component.
  - How to verify, and what fails when the session or token is wrong.
  - Brief: sources `context-and-shims.md` §3, `authoring.md` §7, `zimbra-zimlet-chat/src/api/fetch-request.js` (`FetchRequest`). Links P20 for the options. No GraphQL. Example: helper and component from the sample.
- **P18 `recipe-app-events.adoc` – React to app events** (Not started)
  - Two examples: delay sending a message and delay logout, with `zimletEventEmitter`.
  - Remove the listener correctly; verify the behaviour.
  - Brief: source `context-and-shims.md` §4. Links P21 for the event table. Example: listener examples from the sample.
- **P19 `sample-zimlet.adoc` – The sample Zimlet** (Not started)
  - What it demonstrates – its features and which pages each supports.
  - File by file – a walk through each file with its purpose.
  - Run it – install, lint, test and start.
  - Build and package it – build and make the zip.
  - Deploy it and what to expect – deploy the zip and what you should see in the Modern UI.
  - Brief: written to the same standard as the guide. Source: the sample Zimlet (section 4). Presents the sample as the integrated whole and links to the recipes. Files taken from the sample.

### Part 4 – Go deeper

_Purpose: cover the options and details of one feature area per page, for authors who already built a first Zimlet. Do not repeat complete recipes from Part 3._

- **P20 `data-and-state.adoc` – Data and state** (Not started)
  - Call a server API with `fetch` – the helper and its origin, credentials, CSRF header and the optional proxy (the worked call is P17).
  - Ready-made data hooks (`useAccountInfo`, `usePreferences`, …) – the host hooks for common data; no direct GraphQL.
  - Batch client – when and how to use it.
  - Redux (`store.zimletRedux`) – shared state.
  - Administrator configuration with `config_template.xml` – how a setting is declared and how the Zimlet reads it.
  - Mailbox metadata – read and write.
  - Platform checks – check the platform (desktop or browser) before using a feature.
  - Brief: sources `context-and-shims.md` §3, `authoring.md` §7, `packaging-deployment.md` §2. The guide documents ready-made hooks only, never GraphQL (rule in `write-doc.md`). To investigate: the proxy path option and which hooks to list. Examples: short snippets per topic; hook, Redux and config examples.
- **P21 `app-events.adoc` – App events** (Not started)
  - `zimletEventEmitter` and `ZIMBRA_ZIMLET_EVENTS` – the event bus and the full event table (the only full event table in the guide).
  - Synchronous and asynchronous listeners – how to choose.
  - Removing listeners (`off` throws) – how to remove one and why a wrong call throws.
  - Brief: source `context-and-shims.md` §4. Use cases are in P18. Examples: listener example; event table.
- **P22 `styling.adoc` – Styling** (Not started)
  - Less and CSS – how to write styles and where to put them.
  - CSS Modules and global styles – when styles are scoped and when they are global.
  - Host-injected styles – what the host adds that your styles interact with.
  - Host style variables – the shared variables (primary colour and similar) and how to use them instead of fixed values.
  - Custom properties – define your own.
  - Brief: sources `authoring.md` §5; `zm-x-ui` files `css-variables.css`, `variables.less`, `palette.css`. Recommend host variables over hard-coded values, at least the common ones. To investigate: which variables are stable and public, and how a Zimlet gets them at build time and runtime. Example: `.less` using a host variable.
- **P23 `localization.adoc` – Localization** (Not started)
  - `src/intl/*.json` – structure and naming of locale files.
  - `withIntl` and `<Text id>` – load and show strings.
  - `zimlet.label` and `zimlet.description` – define the label and description for the admin console and the UI.
  - Add a locale.
  - Brief: sources `authoring.md` §6, repo `AGENTS.md` (translation pointer). Examples: `en_US.json` and `enhancers.js`.
- **P24 `security-and-best-practices.adoc` – Security and best practices** (Not started)
  - What the browser sandbox does not give you – the shared same-origin iframe is not a security boundary (shared `window`).
  - Sanitise HTML – use the shimmed `dompurify` before rendering untrusted content.
  - Secrets and tokens – the bundle is served to every user, so keep secrets out of it and never log tokens.
  - Calls to external services – use the server proxy; what to check before sending user data out.
  - Brief: new page for partners (gap A8). No source file covers this; research from `runtime.md`, `context-and-shims.md` (the `dompurify` shim) and the host code, mark what cannot be confirmed as unverified, and ask Engineering to review.
- **P25 `advanced.adoc` – Advanced topics** (Not started)
  - Customise webpack (`zimlet.config.js`) – change the build, with a small example.
  - Non-Preact UI – write a Zimlet in another framework and what is lost.
  - Call external services through `/service/proxy`.
  - Assets and `publicPath` – load images and fonts correctly in a deployed Zimlet.
  - OAuth client – use it for services that need a login.
  - Brief: sources `cli-commands.md` (webpack), `authoring.md` §8, `packaging-deployment.md` §3. Signatures live in P33. Example: `zimlet.config.js`.

### Part 5 – Test, package, deploy

_Purpose: tasks for running, testing, packaging and deploying a Zimlet, each with a way to check the result. Explain internals only when they explain a failure._

- **P26 `run-and-debug.adoc` – Run and debug** (Not started)
  - `zimlet watch` options – each option and when to use it.
  - Sideloader steps and "persist" – load the development URL and keep it with the persist option.
  - Development versus production loading – a comparison, the shared same-origin iframe and what it means (shared `window`; see P24), and the soft restart on save.
  - Hot reload behaviour – what happens in the browser on save.
  - Browser console messages – what to look for and what they mean.
  - Debug slots (`?zimletSlots=show`) – show every slot in the page.
  - If nothing appears – link to P36.
  - Brief: sources `cli-commands.md`, `runtime.md` (debugging), `packaging-deployment.md` §5.
- **P27 `testing.adoc` – Test your Zimlet** (Not started)
  - Static checks – lint and build before every test.
  - Manual test plan – a repeatable list of things to try in Modern UI.
  - Test accounts and COS – which accounts and class-of-service settings to test with.
  - Regression checklist – checks to repeat before a release.
  - Unit tests with Jest – set up and run.
  - What cannot be automated today – the parts that cannot be tested automatically (gap A7).
  - Brief: unit test pattern from `zimbra-cloud-common` (Jest, `jest-preset-preact`, Enzyme preact adapter, `npm run test:unit`). All commands verified in the sample. Example: test from the sample.
- **P28 `build-and-package.adoc` – Build and package** (Not started)
  - `zimlet build` – what it does and what it writes to `build/`.
  - `zimlet package` and its options – each option, with the exact command.
  - The generated descriptor and `.properties` files – what they contain and the descriptor attributes an author controls, including `zimbraXZimletCompatibleSemVer` as a version range (the full element list is P31).
  - Where the zip is written – and how to change it.
  - Choose the `--zimbraXVersion` range – match the Modern UI version you target; find the host version in Settings, then About.
  - Keep it compatible – what to do when the Modern UI is upgraded (versioning gap A11; flag unverified).
  - `--publicpath` – when to set it and what it changes.
  - Brief: sources `packaging-deployment.md` §1, `cli-commands.md`. Example: descriptor XML written for this page.
- **P29 `deploy.adoc` – Deploy** (Not started)
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

- **P30 `reference-cli.adoc` – CLI reference** (Not started)
  - Every `zimlet` command and option, with defaults.
  - Brief: source `cli-commands.md`.
- **P31 `reference-files.adoc` – File reference** (Not started)
  - `package.json` scripts – the scripts a Zimlet needs.
  - `package.json` dependencies – inventory of packages used by active Zimlets in both monorepos, each with its purpose, distinguishing runtime dependencies, build and test tools, and host-provided shims.
  - Descriptor XML – every element and attribute.
  - `config_template.xml` – structure of the admin settings file.
  - `zimlet.config.js` – shape of the build configuration function.
  - `en_US.json` – structure of the strings file.
  - Brief: sources `packaging-deployment.md`, `authoring.md`, and active Zimlet `package.json` manifests plus their imports in both monorepos. Examples: file examples.
- **P32 `reference-shims.adoc` – Shimmed modules** (Not started)
  - The full module table – every shimmed module, with what it exports.
  - Brief: source `context-and-shims.md` §2 and `shims.js`.
- **P33 `reference-apis-hooks.adoc` – APIs and hooks** (Not started)
  - `fetch`-based API calls, batch client, host hooks by area, utilities and constants, platform and browser helpers, server proxy, OAuth client.
  - Brief: each entry has purpose, signature or usage, and an example only where verified. Verify every export in `shims.js` and the host `src/hooks` folders. Document ready-made hooks, not GraphQL queries. How-to text stays in P20 and P25.
- **P34 `reference-slots.adoc` – Slot and extension-point index** (Not started)
  - How to read an entry – what each column means.
  - Table of all extension points – generated from the slot catalog.
  - Brief: generated from `zimlet-slots.yml` with a script so it can be refreshed. Columns: name, kind, host source file and owner, props or arguments, flags (render-prop, non-updating, wrapper). Only scanner-derived facts; placement and payload meaning say "details pending".
- **P35 `glossary.adoc` – Glossary** (Drafted)
  - One short entry per term, in alphabetical order, each linking to the page that owns the topic: class of service (COS), context, descriptor, factory, HMR, Modern UI, plugin and plugin handler, semver range, shim, sideloader, slot, vertical, Zimlet, `zmzimletctl`.

### Part 7 – Help and migration

_Purpose: help a reader who is stuck, has a question, or is moving from Classic Zimlets. Start from the symptom or question, not from the feature._

- **P36 `troubleshooting.adoc` – Troubleshooting** (Not started)
  - If nothing appears – a checklist of causes, in the order to check (moved from Run and debug).
  - Symptom, cause, fix table – symptoms as the reader sees them.
  - Brief: seed rows: Zimlet silently absent (the server leaves out Zimlets whose version range does not match the Modern UI or that are not enabled for the user), certificate not accepted, `createElement` missing, import not shimmed, missing `zimlet.label`, asset 404 (`publicPath`), disabled for the COS, `off` throws. Source: `needs-attention.md`.
- **P37 `faq-and-getting-help.adoc` – FAQ and getting help** (Not started)
  - FAQ – answers to the questions authors ask most.
  - Report a documentation or template problem.
  - Where to ask for help and what to include.
  - Brief: built from the guide's facts and the Support and Engineering question review (section 6, phase 8). The escalation path comes from the product team (gap A13).
- **P38 `known-limitations-and-gaps.adoc` – Known limitations and gaps** (Not started)
  - Missing information – what is not yet available and who can supply it.
  - Known defects and workarounds.
  - Brief: user-facing form of section 5; each gap with what is missing, impact, workaround, owner or next action.
- **P39 `classic-vs-modern.adoc` – Classic and Modern Zimlets** (Not started)
  - Differences table – what differs between Classic and Modern UI Zimlets.
  - Capability checklist – for each Classic capability: its Modern equivalent, not supported, or unknown.
  - Brief: evidence is thin (gap A12); mark entries with no evidence as unknown, to confirm with Engineering. Sources: `runtime.md` (compat disabled), `context-and-shims.md` (`isCompat`, deprecated `zimbra`), `packaging-deployment.md` §3 (semver filter). The only page where Classic is discussed (rule in `write-doc.md`).

## 2. How to build the guide page by page

For each page, in the order of section 6:

1. Choose a page whose status is `Not started` and whose dependencies (section 6) are `Done` in the phase status column, or are listed as waived there.
2. Read the page's entry in section 1: its part purpose, sections, brief and the sources it names. Follow [write-doc.md](../rules/write-doc.md) for structure, examples, diagrams and images. Apply the "one home per topic" convention (section 1.2): link to the page that owns a topic instead of repeating it.
3. Write the page in `modules/ROOT/pages/`. Put examples in `modules/ROOT/examples/`, images in `modules/ROOT/images/` and diagrams in `modules/ROOT/images/diagrams/`.
4. Add the page to `modules/ROOT/nav.adoc`, grouped by the parts of section 1.
5. Verify each claim while you write, section by section, and keep the claim ledger ([write-doc.md](../rules/write-doc.md) section 7). Record what cannot be run or confirmed in [unverified-claims.md](./unverified-claims.md), one row per claim mapped to a section id; do not put verification notes in the page.
6. Update the page's status in section 1 to `Drafted`.
7. Optionally run the independent `review-doc` prompt. Only a review that finds no Blocking issue sets `Reviewed`.

## 3. Scope decisions

| Topic                   | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Format and location     | Antora / AsciiDoc in `zimlet-cli/documentation/` (`antora-playbook.yml`, `antora.yml`, `modules/ROOT/`). Pages in `modules/ROOT/pages/`, navigation in `modules/ROOT/nav.adoc`. Build: `npm run build:docs`. Preview: `npm run preview:docs`.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Audience                | Zimbra partners and developers: front-end developers new to Zimbra, Preact, the Zimlet CLI and the Zimbra server. No Zimbra-internal knowledge is assumed. Administrators who only deploy a Zimlet are served by P29 and P36.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Coverage                | Modern UI Zimlets only, not Classic Zimlets or Java extensions. P39 explains how Classic capabilities map to or differ from Modern.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Slots                   | In scope end to end: the mechanism and contract, how to find and choose a slot, worked examples, and an index of all extension points (P34). Detailed per-slot documentation (placement and payload meaning for each extension point, all `unclassified` today) is a later phase. P29 is structured so those details can be added per slot without restructuring.                                                                                                                                                                                                                                                                                                        |
| Recipes (Build by goal) | Part 3 gives complete recipes, one page per goal, placed right after the fundamentals so partners reach a working result early. P09 and the feature pages (Part 4) teach the underlying concepts; recipes apply them without repeating API reference material. Confirm every registration key and slot from the catalog and available real code before documenting it. P19 is the integrated sample, not a replacement for focused recipes.                                                                                                                                                                                                                              |
| Left out                | Webpack and esbuild internals, `postMessage`, Redux `removeModal` bug details, CI and OS-package build scripts, translation tooling for Zimbra staff, the Lerna release flow. Only facts a Zimlet author needs. Zimbra-staff monorepo notes are not part of the published guide; they stay in the agent reference `zimlet-repositories.md`.                                                                                                                                                                                                                                                                                                                              |
| Source material         | Index: `zimlet-cli/AGENTS.md`. Reference files in `zimlet-cli/.agents/reference/` and `zm-x-web/.agents/zimlet/reference/`; rules in the `rules/` folders; the generated catalog `zm-x-web/.agents/zimlet/context/zimlet-slots.yml`; combined repo guide `zimlet-cli/.agents/reference/zimlet-repositories.md` (local `zimlet-repo.md` files point to its sections). Real code: `zm-x-zimlet-template-default` (scaffold), `zm-x-oauth-client` README, `zm-modern-zimlets/zimlets/zimbra-zimlet-personal-notes` (smallest real example), `zm-x-web/README.md` (dev server and version lookup; it contains a dev hostname and CI badge tokens, which must not be copied). |
| Old Zimlet wiki         | `zimlet-cli.wiki` is excluded: it is not a source and is not linked or mined for topics.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

## 4. Working sample Zimlet

Location: `zimlet-cli/examples/zimbra-zimlet-sample/` (new; the old `examples/dropbox` stays untouched and is called out as stale). Built on `@zimbra/zimlet-cli ^19.0.0` and Node 24, free of the template defects in gap B1. It stays small but exercises every major capability, so the guide can point at real, buildable code. Example files in the guide are copies of its files (see [write-doc.md](../rules/write-doc.md)).

| Capability                                           | Demonstrated by                                                                                                       |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Factory, `init()`, `plugins.register`                | `src/index.js`                                                                                                        |
| Content slot (UI inside an existing screen)          | a slot such as `slot::message-body-top` (pattern from personal-notes)                                                 |
| New tab and route                                    | `slot::email-tab-item` and `slot::routes`, slug read through `useClientConfig`                                        |
| Shared libraries, hooks, `@zimbra-client/components` | `MenuItem`, a `lucide-preact` icon component                                                                          |
| Data access                                          | one `fetch`-based API call through a small helper, and one ready-made hook such as `useAccountInfo` (verified export) |
| App events                                           | one `zimletEventEmitter` listener                                                                                     |
| Styling                                              | a `.less` CSS Module in `src/components` using host style variables                                                   |
| Localization                                         | `src/intl/en_US.json`, a second locale, `withIntl`, `zimlet.label` and `zimlet.description`                           |
| Admin configuration                                  | `config_template.xml` read through `useAccountInfo`                                                                   |
| Settings page                                        | a `settings` registration with a small page component (for P15)                                                       |
| Headless message processing                          | a `messageProcessors:<kind>` registration (for P16)                                                                   |
| Testing                                              | a Jest and Enzyme unit test (pattern from `zimbra-cloud-common`) and a lint script                                    |
| Packaging                                            | `npm run package` producing `pkg/<name>.zip`                                                                          |

Acceptance: from a fresh clone, `npm install`, `npm run lint`, `npm test`, `npm run build` and `npm run package` succeed on Node 24, and `zimlet watch` serves `index.js`. Behaviour inside Modern UI and server deployment stay **unverified** until a test server is available (gap A1) and are labelled so in the guide.

## 5. Known gaps that feed the guide

Published in P38 in user-friendly form.

**A. Missing information (nothing in the source files)**

1. No instructions for obtaining a Modern UI test environment: which edition and version, a test account or COS, shell access. The same applies to external developers without a Zimbra server.
2. The Zimbra release to `zm-x-web` version mapping is not documented, though it is needed to choose `--zimbraXVersion`. The template uses `^4.0.0`, real Zimlets `^4.42.0`, the host is 4.50.0. Only the About-dialog lookup is documented.
3. Sideloader: how to obtain, build and deploy it, whether it is pre-installed, and which COS or users need it are not documented.
4. Admin console deployment is only referenced ("see the Zimbra admin guide"); there is no link or screenshot.
5. Update, redeploy, undeploy and rollback behaviour of `zmzimletctl` for a deployed Zimlet is not described.
6. Windows: package scripts use `$npm_package_name` (POSIX shell syntax); behaviour on cmd or PowerShell is untested (inferred, to confirm).
7. Testing: there is no end-to-end approach for Zimlets; only `zimbra-cloud-common` has unit tests (Jest). The guide documents lint, build, manual and unit testing (P27).
8. Security guidance for authors (sanitising with the shimmed `dompurify`, the same-origin shared iframe giving no isolation, secrets handling) is not in the source files.
9. Per-slot details for each extension point are not researched (all `unclassified`). P34 ships a factual index now. Security guidance (P24) is researched from code and reviewed by Engineering.
10. Distribution for non-Zimbra developers (publishing, signing, licensing) is not documented.
11. There is no versioning policy for Zimlets (Zimlet semver against the host compatibility range).
12. The Classic to Modern capability list is incomplete. The sources say the Classic compat bridge is disabled and list a few differences, but there is no authoritative inventory. Engineering must review P39; comparing the Classic Zimlet repositories with the Modern slot catalog could help.
13. The support and escalation path for partners (where to ask, report bugs, request new slots) is not defined.
14. API reference depth: the available server API endpoints and the `zimbraBatchClient` operations are not described; the guide shows the `fetch` pattern and points to host source folders. Hooks and exports are documented only as far as verified in `shims.js` and the host source.
15. Existing sample material is stale: `zimlet-cli/examples/dropbox` is "an old sample, not the live Dropbox zimlet" and the default template is outdated, so the new sample is the only maintained example until the template is refreshed.

**B. Known defects and staleness (from `needs-attention.md`, described with workarounds)**

1. Default template (last commit 2022): pins `@zimbra/zimlet-cli ^14` (the build breaks on CLI 19 because of `preact-i18n`), uses the unsupported string icon `question-circle`, ESLint 8 with `eslint-config-synacor`, lacks `zimlet.label` and `zimlet.description` in `en_US.json`, README typo. P06 documents the manual fixes until the template is refreshed.
2. `unload()` and `destroy()` appear not to run on a hot-reload restart (unconfirmed).
3. Shared context name `serverConsolidatedZimlets`: `resourceUrl`, `cache` and the style tag id are not unique per Zimlet (unconfirmed).
4. `preact/jsx-runtime` is aliased but not provided by the host (work around with the `createElement` import).
5. Legacy slot names registered by cloud Zimlets that no host callsite renders.
6. `zimlet package` crashes when `src/intl` is missing; descriptor values are not XML-escaped; `.properties` files are always written to `./build`.
7. The server contract (bundle filtering, `zmzimletctl`) was never exercised against a live server; those statements are flagged unverified.
8. The `zm-x-oauth-client` README (HTTPS and tag 1.2.2) conflicts with its usage (git+ssh and tag 2.0.0); the server OAuth extension is not in the workspace.
9. Monorepo README drift (`cd packages/...`, an old release flow); the `@zimbra/cloud-common` link needs a root `npm install`.
10. `context.config` is normally `undefined`; use `useClientConfig`.

**C. Documentation risks**

- The source rule files were verified on Node 18 but the repositories require Node 24, so the quickstart must be re-run on Node 24.
- The slot catalog is generated per commit; regenerate it when the host changes.

## 6. Build order

Each phase produces files under `zimlet-cli/documentation/modules/ROOT/` (or `zimlet-cli/examples/` for the sample) and updates `nav.adoc` and the statuses in section 1. The build order differs from the reading order: reference and verified inventories come before the recipes that depend on them.

| Phase                        | Work                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Pages                                       | Depends on    | Status      |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------- | ----------- |
| 1. Foundation                | Finalise the navigation skeleton (grouped by the parts of section 1), a page template for the task layout (Goal, Before you start, Steps, Expected result, If it didn't work, Next step), admonition conventions and a glossary stub.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | P35 (stub)                                  | None          | In progress |
| 2. Groundwork                | Spike the tutorial path in a scratch folder outside the repo (install Node 24, `npm i -g @zimbra/zimlet-cli`, `zimlet create`, apply the template fixes, `build`, `package`), recording exact commands, outputs and errors; anything needing a server or Modern UI is marked unverified. Build the sample Zimlet (section 4) and lint, test, build and package it on Node 24. Compile the APIs and hooks inventory from `shims.js`, the host `src/hooks`, and the catalog, verifying each export. Start the Classic-versus-Modern evidence list and record open questions for Engineering.                                                                                                                                                                                                                                                            | P19 (code), P33 (inventory), P39 (evidence) | 1             | Not started |
| 3. Getting started           | Welcome and Part 1 pages. Check that every official link in P04 is live.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | P01, P03–P06                                | 2             | In progress |
| 4. Fundamentals and features | Part 2 and Part 4 pages.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | P07–P11, P20–P25                            | 2, 3          | Not started |
| 5. Test, package, deploy     | Part 5 pages and troubleshooting.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | P26–P29, P36                                | 2             | Not started |
| 6. Reference and migration   | Reference pages, including the scripted slot index, and the Classic-versus-Modern page.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | P30–P35, P39                                | 2             | Not started |
| 7. Build by goal             | Write the recipe index, the recipes and the sample page. Reuse the sample where appropriate, verify example code with the documentation verification workflow, and confirm each slot or registration key against P34 and real code. Mark behaviour that needs a live Modern UI environment as unverified; do not present a stub-host check as proof of UI rendering.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | P12–P19                                     | 2, 3, 4, 6    | Not started |
| 8. Quality and release       | Help pages P37 and P38. Verify that every example file matches the sample or builds in a scratch Zimlet. Re-verify each claim against current source (`src/commands/*.js`, `zm-x-web/src/lib/zimlet-manager/*`, `package.json` versions) and check the quoted versions (CLI 19.0.0, Node ^24.18.0, zm-x-web 4.50.0). Point `AGENTS.md` and the `zimlet-cli` README at the published guide (confirm with the team before editing README links). Ask Support and Engineering for the most frequent Zimlet development questions and confirm each is answered or listed as a gap; send P39 and P24 to Engineering for review. Cold-read the whole guide as a newcomer (or with a reviewer agent) and fix every unexplained term, tool or command. Run `npm run build:docs`, fix Antora warnings, and check navigation, `xref:` links and external links. | P37, P38 and all pages                      | 3, 4, 5, 6, 7 | Not started |

Phase status values: `Not started` · `In progress` · `Done`. A phase is `Done` when every page it lists is at least `Drafted` and its other work (spike, sample Zimlet, template, inventories) is finished. Update the status in the same change that finishes the work. To check a page, find its phase in the "Pages" column; its dependencies are the phases in that row's "Depends on" column, and they are satisfied only when those phases are `Done`.

If you decide to write a page before its dependencies are `Done`, record the waiver here so the next reader knows why. Remove the entry when the dependency is `Done`. An agent that finds unmet dependencies stops and asks, and adds the waiver only after approval. An agent sets a phase to `Done` only when the page work and the non-page work are both finished.

| Page | Waived dependency | Reason                                                           | Consequence                                                                                                             |
| ---- | ----------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| P03  | Phases 1 and 2    | Concept page that needs only `architecture.md` and `runtime.md`. | Glossary and other link targets are placeholder pages. Facts that depend on the phase 2 spike are flagged `Unverified`. |

## 7. Open questions

- Is `https://zimbra.github.io/zimlet-cli` (from the playbook) still the publishing target?
- Does the sample Zimlet stay in `zimlet-cli/examples/` (recommended) or move to its own repository?
- Who reviews P39 and P24, and who owns the support and escalation path (gaps A12, A13)?
- Who owns the glossary and the future per-slot detail pages?
- Can partners without a Zimbra server get a test environment (gap A1)? P04 needs a concrete answer, not only a list of requirements.
- Should the default template be refreshed so the quickstart needs no "apply the template fixes" step (gap B1)? Recommended: yes, then remove that section from P06.
- Which `zm-x-ui` style variables are public and stable enough to recommend (P22), and how does a Zimlet consume them?
- Which server API endpoints should the `fetch` examples call (P17, P20), and is the proxy path option needed?
- Can we get access to a Modern UI server to validate the deployment and sideloader parts, so they can move from "unverified"?
