# Zimlet documentation plan

This file is the working index for the Zimlet developer guide (Antora / AsciiDoc site in `zimlet-cli/documentation/`). It lists every page and section the finished guide will contain, and it is meant to be used **progressively**: pick the next page, write it, record its status here.

- Section 1 is the index of the final documentation (pages and their sections).
- Section 2 explains how to build the guide page by page.
- Sections 3 to 6 hold scope decisions, sources, the sample Zimlet and the known gaps that feed the guide.
- Section 7 is the build order.

Writing rules for every page are in [write-doc.md](../rules/write-doc.md). Review rules are in [review-doc.md](../rules/review-doc.md). Rules for the Zimlet code shown in the guide are in [authoring.md](../rules/authoring.md), and for packaging and deployment steps in [packaging-deployment.md](../rules/packaging-deployment.md). Do not repeat them here.

Use the [zimlet-cli reference index](../../AGENTS.md#topic-to-file-map) and the [zm-x-web Zimlet materials index](../../../zm-x-web/.agents/zimlet/AGENTS.md) to find internal reference material while writing. Follow the topic-specific sources they link to, but do not link to these agent files in the published guide.

## 1. Documentation index

Each part states its purpose. A page must match the purpose of the part it is in (rule in `write-doc.md` section 2). Each section after the dash says what it covers and should include. These are the planned content; the page brief in section 3 and the sources decide the final detail.

Status values: `Not started` · `Drafted` · `Reviewed`. Only the `review-doc` prompt sets `Reviewed`, when a review finds no Blocking issue. Pages are numbered in reading order (`P01` …), except P03, which moved to Part 4 and kept its id. The id is used for cross references in this file only. File names refer to `modules/ROOT/pages/`.

### Part 0 – Welcome
*Purpose: orient the reader. Say what a Zimlet is, who the guide is for and where to start. No technical detail.*
- **P01 `index.adoc` – Zimlets documentation** (Not started)
  - What is a Zimlet – what a Zimlet is and what it can add to the Modern UI, in plain words.
  - What a Zimlet can do – a short list of what Zimlets add (screens, menu items, settings pages, event handling, data), with no API detail and a link to the full capabilities reference.
  - Who this guide is for – the readers it is written for (front-end developers building Zimlets) and the knowledge it assumes.
  - What you will build – the outcome of the guide: a working Zimlet that is built, packaged and deployed.
  - How the guide is organised – a map of the parts of the guide and what each one is for.
  - Reading paths: "I just want to try" and "I'm building a real Zimlet" – two short routes through the guide: a quick try-out, and the full route for a production Zimlet.

### Part 1 – Getting started
*Purpose: take a newcomer from nothing to a working first Zimlet. Give only what the next step needs: a short mental model, requirements, setup and one tutorial. No internals, option catalogues or alternatives.*
- **P02 `concepts.adoc` – How Zimlets work** (Drafted)
  - The big picture (diagram) – one diagram and a short text that follow a Zimlet from source file to the Modern UI.
  - A bundle and a descriptor – what `zimlet build` and `zimlet package` produce: a single JavaScript file and an XML descriptor in a zip.
  - Factory and `init()` – the entry-file contract: a default-exported factory that receives `context`, and an `init()` that registers everything.
  - Slots and plugins – how a Zimlet adds UI: named slots in Modern UI screens and the plugin handlers a Zimlet registers for them, and that other registration keys (`settings`, `messageProcessors:<kind>`) exist.
  - Shared libraries – why a Zimlet imports Preact and host libraries instead of bundling its own copies; links to the import rules.
  - Try it while you develop – how `zimlet watch` and the sideloader load a Zimlet while you develop.
- **P04 `prerequisites.adoc` – Knowledge and tools you need** (Not started)
  - Technology table – a table of each technology needed, why, the level required and its official documentation.
  - Learn just enough (official links) – short links to the official learning material for each technology, so the guide does not re-teach it.
  - Zimbra-side prerequisites – what the Zimbra server must provide: a server with Modern UI, shell or admin console access, a test account, the Modern UI version and the sideloader.
- **P05 `setup-environment.adoc` – Set up your machine** (Not started)
  - Install Node 24 – install Node 24 and check the version.
  - Install Git and an editor – install Git and choose an editor.
  - Install the `zimlet` CLI – install the `zimlet` command-line tool and check that it runs.
  - Find your Modern UI version – how to read the Modern UI version from the About dialog, which later sets the `--zimbraXVersion` range.
  - Install and enable the sideloader – how to install the sideloader Zimlet and enable it for your account.
  - Accept the development HTTPS certificate – how to trust the self-signed certificate of the development server in your browser.
  - Ready check – a checklist that confirms the machine and the server are ready for the quickstart.
- **P06 `quickstart.adoc` – Your first Zimlet** (Not started)
  - Create a Zimlet from the template – scaffold a project with `zimlet create` and what the template gives you.
  - Fix the known template issues – the changes to make to the generated project so it builds with the current CLI and Modern UI.
  - Run it with `npm run watch` – start the development server and the output to expect.
  - Load it through the sideloader – load the running Zimlet into Modern UI with the sideloader.
  - See the result and change it (HMR) – confirm the Zimlet appears, edit a file and see the change without a page reload.
  - Build – produce the production `build/index.js`.
  - Package – produce the zip, with the exact command and the expected output.

### Part 2 – Build your Zimlet
*Purpose: teach each thing an author builds, one topic per page. Give the depth needed to build it correctly, and explain a mechanism only where it changes what the author writes.*
- **P07 `project-structure.adoc` – Project structure** (Not started)
  - Minimum package – the smallest set of files a Zimlet needs.
  - `package.json` field by field – each `package.json` field and script, what it does and what to set; explain `dependencies` versus `devDependencies`, link to P25 for the dependency inventory, and cover repository-specific scripts such as `security:audit` (purpose, availability, and how to verify and run it).
  - `src/index.js` – the entry file and what the host expects from its default export.
  - `src/intl/en_US.json` – the strings file, including the `zimlet.label` and `zimlet.description` block.
  - `config_template.xml` (optional) – when to add `config_template.xml` for settings that an administrator edits.
  - `zimlet.config.js` (optional) – when to add `zimlet.config.js` to change the build.
  - Naming rules – rules for the Zimlet name, folder name, slug and i18n namespace.
- **P08 `factory-and-lifecycle.adoc` – Factory and lifecycle** (Not started)
  - The default export factory – the factory function as the Zimlet's entry point, with a minimal example.
  - The `context` argument – what `context` is and how a factory receives it (details of its fields are in P12).
  - `init()` – what `init()` is for, when it runs and what to put in it.
  - Async setup – how to do asynchronous work, such as a lookup, and register plugins when it finishes.
  - Register and unregister conditionally – how to register a handler only when a condition holds and remove it with the same function reference.
  - Headless Zimlets – a Zimlet that adds no UI and only reacts to events or processes data.
- **P09 `extending-the-ui.adoc` – Extend the UI with slots** (Not started)
  - How slots work – the slot model: where slots are rendered and how handlers fill them.
  - Register a handler – how to call `plugins.register` for a slot, with a minimal example.
  - Handler return types – what a handler may return: an element, a function, a component or a plain value.
  - Props and payload – what a slot passes to your handler and how to read it.
  - Error isolation – how a failing handler affects other handlers (it does not).
  - Hooks in handlers – how to use hooks in a handler without breaking the render.
  - Find a slot – how to locate a slot in the running UI and in the slot index.
  - Slots and `invokePlugin` extension points – the difference between rendering slots and `invokePlugin` extension points, and when each applies.
  - Render-prop slots – slots that give your handler a function to call instead of rendering output.
  - `RemovableSectionZimlet` slots – slots exposed by the `RemovableSectionZimlet` component.
  - Settings page channel – how a Zimlet adds a settings page by registering under the `settings` key.
  - Message processors – how a Zimlet processes messages through `messageProcessors:*` keys.
  - Choose a slot (checklist) – a short list of questions to pick the right slot for a goal.
  - Common patterns by use case (slot to use, registration example) – a table by goal (add content, add an action, add a settings page, add a tab and screen) with the slot to use and a registration example for each.
  - Worked example 1: content slot – a complete example that adds content to an existing screen.
  - Worked example 2: tab item and route – a complete example that adds a tab item and its route.
- **P10 `tabs-and-routes.adoc` – Tabs, routes and verticals** (Not started)
  - New screen and route – how to add a screen with a URL and register its route.
  - Tab item – how to add a menu item for the screen to a tab.
  - Verticals (video, chat, cloud, integrations) – the built-in top-level areas (video, chat, cloud, integrations) and what they are for.
  - Read slugs with `useClientConfig` – how to build links from the route slugs configured in Modern UI.
  - Which slot activates a vertical – a table of which slot adds a Zimlet to which vertical.
- **P11 `shared-libraries.adoc` – Shared libraries and imports** (Not started)
  - What you may import – the list of libraries a Zimlet imports from the host.
  - What gets bundled – what a build puts in `index.js`: your code and every import that is not shared.
  - Libraries you must not add – libraries that must not be added to `package.json` because the host provides them.
  - JSX and `createElement` – why JSX needs `createElement` from `preact` and how to import it.
  - Icons – how to pass a component as an icon instead of a string name.
  - The `Export … was not found` error – what this build error means and how to fix it.
- **P12 `host-context.adoc` – The context object** (Not started)
  - Fields and what they are for, each with a short example – a table of the `context` fields an author uses. Each has its purpose and a short example.
  - What is not in the context – things authors expect in `context` that are not there, and where to get them instead.
- **P13 `data-and-state.adoc` – Data and state** (Not started)
  - Call a server API with `fetch` (CSRF token, credentials, origin, optional proxy) – a `fetch` helper that sets the origin, credentials and CSRF header, with one call that uses it; the optional proxy.
  - Ready-made data hooks (`useAccountInfo`, `usePreferences`, …); no direct GraphQL – the host's data hooks for common data such as account info and preferences; no direct GraphQL.
  - Batch client – when and how to use the batch client for server requests.
  - Redux (`store.zimletRedux`) – how a Zimlet keeps shared state with `store.zimletRedux`.
  - Admin configuration with `config_template.xml` – how an administrator-editable setting is declared and how the Zimlet reads it.
  - Mailbox metadata – how to read and write mailbox metadata.
  - Platform checks – how to check the platform (for example desktop or browser) before using a feature.
- **P14 `app-events.adoc` – Reacting to app events** (Not started)
  - `zimletEventEmitter` and `ZIMBRA_ZIMLET_EVENTS` – the host event bus and the list of events a Zimlet can listen for.
  - Synchronous and asynchronous listeners – how to choose between a synchronous and an asynchronous listener.
  - Removing listeners (`off` throws) – how to remove a listener and why a wrong call throws.
  - Use cases: delay send, delay logout – two examples: delay sending a message and delay logout.
- **P15 `styling.adoc` – Styling** (Not started)
  - Less and CSS – how to write styles in Less and CSS and where to put them.
  - CSS Modules and global styles – when styles are scoped to a component and when they apply globally.
  - Host-injected styles – what the host adds to the page that your styles interact with.
  - Host style variables from `zm-x-ui` (primary colour and the other common variables) – the shared style variables from `zm-x-ui` (primary colour and similar) and how to use them instead of fixed values.
  - Custom properties – how to define your own custom properties.
- **P16 `localization.adoc` – Localization** (Not started)
  - `src/intl/*.json` – how locale files in `src/intl/` are structured and named.
  - `withIntl` and `<Text id>` – how to load strings with `withIntl` and show them with `<Text id>`.
  - `zimlet.label` and `zimlet.description` – how the Zimlet's label and description are defined for the admin console and the UI.
  - Add a locale – how to add another language.
- **P17 `advanced.adoc` – Advanced topics** (Not started)
  - Customise webpack (`zimlet.config.js`) – how to change the build with `zimlet.config.js`, with a small example.
  - Non-Preact UI – how to write a Zimlet in a framework other than Preact and what is lost.
  - Call external services through `/service/proxy` – how to reach an external service from the browser through the server proxy.
  - Assets and `publicPath` – how to load images and fonts correctly in a deployed Zimlet.
  - OAuth client – how to use the OAuth client for services that need a login.
- **P18 `sample-zimlet.adoc` – The sample Zimlet** (Not started)
  - What it demonstrates – the features of the sample Zimlet and which pages of the guide each one supports.
  - File by file – a walk through each file with its purpose.
  - Run it – commands to install, lint, test and start the sample.
  - Build and package it – commands to build the sample and make its zip.
  - Deploy it and what to expect – how to deploy the zip and what you should see in the Modern UI.

### Part 3 – Test, package, deploy
*Purpose: tasks for running, testing, packaging and deploying a Zimlet, each with a way to check the result. Explain internals only when they explain a failure.*
- **P19 `run-and-debug.adoc` – Run and debug** (Not started)
  - `zimlet watch` options – each option of `zimlet watch` and when to use it.
  - Sideloader steps and "persist" – how to load the development URL in the sideloader and keep it with the persist option.
  - Hot reload behaviour – what happens in the browser when you save a file.
  - Browser console messages – the messages to look for in the browser console and what they mean.
  - Debug slots (`?zimletSlots=show`) – how to show every slot in the page with `?zimletSlots=show`.
  - Nothing appears: common causes – a checklist of why a Zimlet does not appear, in the order to check.
- **P20 `testing.adoc` – Test your Zimlet** (Not started)
  - Static checks – checks to run before every test: lint and build.
  - Manual test plan – a repeatable list of things to try in Modern UI.
  - Test accounts and COS – which accounts and class-of-service (COS) settings to test with.
  - Regression checklist – a list of checks to repeat before a release.
  - Unit tests with Jest – how to set up and run unit tests with Jest.
  - What cannot be automated today – the parts of a Zimlet that cannot be tested automatically today.
- **P21 `build-and-package.adoc` – Build and package** (Not started)
  - `zimlet build` – what `zimlet build` does and what it writes to `build/`.
  - `zimlet package` and its options – each option of `zimlet package`, with the exact command.
  - The generated descriptor and `.properties` files – what the generated descriptor and `.properties` files contain.
  - Where the zip is written – where the zip is written and how to change it.
  - Choose the `--zimbraXVersion` range – how to pick the version range that matches the Modern UI version you target.
  - `--publicpath` – when to set the public path and what it changes.
- **P22 `deploy.adoc` – Deploy** (Not started)
  - Deploy with `zmzimletctl` – the commands to deploy a zip and the expected output.
  - Flush the Zimlet cache – how to refresh the server cache so users get the Zimlet.
  - Enable per COS and per user – how to switch the Zimlet on for a class of service or one user.
  - Enable or disable from Modern UI user settings – how an end user manages a deployed Zimlet from their Modern UI settings; confirm the exact UI labels and behavior in a live session.
  - Admin console – how to do the same steps in the admin console.
  - Configure with `zmzimletctl configure` – how to set a Zimlet's settings with `zmzimletctl configure`.
  - Restart note – whether a restart is needed after each action.
  - Verification checklist – a short list of checks that confirm a deploy worked.
  - Update, redeploy, undeploy, roll back – how to deploy a new version, remove a Zimlet and go back to an earlier one.
- **P23 `troubleshooting.adoc` – Troubleshooting** (Not started)
  - Symptom, cause, fix table – a table of symptoms as the reader sees them, with the cause and the fix for each.

### Part 4 – Reference
*Purpose: complete facts for lookup. Tables and entries only, no tutorial text.*
- **P03 `reference-capabilities.adoc` – Capabilities and limits** (Not started)
  - Capability matrix – a table of what a Zimlet can do. Columns: capability, how, API used, link to the page, and support status (supported, unverified, limitation).
  - What a Zimlet cannot do – the limits of a Zimlet: shared iframe, shimmed libraries only, a single `index.js`, and server filtering by version.
- **P24 `reference-cli.adoc` – CLI reference** (Not started)
  - Every `zimlet` command and option – every command and option of the `zimlet` tool, with defaults.
- **P25 `reference-files.adoc` – File reference** (Not started)
  - `package.json` scripts – the scripts a Zimlet's `package.json` needs.
  - `package.json` dependencies – inventory packages used by active Zimlets in both monorepos, explain each package's purpose, and distinguish runtime dependencies, build/test tools and host-provided shims.
  - Descriptor XML – every element and attribute of the generated descriptor.
  - `config_template.xml` – the structure of the admin settings file.
  - `zimlet.config.js` – the shape of the build configuration function.
  - `en_US.json` – the structure of the strings file.
- **P26 `reference-shims.adoc` – Shimmed modules** (Not started)
  - The full module table – every shimmed module, with what it exports.
- **P27 `reference-context-events.adoc` – Context and events** (Not started)
  - Full `zimletContext` table – every `context` field in one table.
  - Full event table – every host event in one table.
  - Fold into P12 and P14 if it would only duplicate them – merge this page into P12 and P14 if it would only repeat them.
- **P28 `reference-apis-hooks.adoc` – APIs and hooks** (Not started)
  - `fetch`-based API calls – how to call server APIs with `fetch`.
  - Batch client – the batch client and its calls.
  - Host hooks by area – the ready-made hooks, grouped by area.
  - Utilities, constants, platform and browser helpers – shared utilities, constants and platform helpers.
  - Server proxy – how the server proxy works and how to call it.
  - OAuth client – the OAuth client and its methods.
- **P29 `reference-slots.adoc` – Slot and extension-point index** (Not started)
  - How to read an entry – how to read an entry: what each column means.
  - Table of all extension points – a table of every slot and extension point, generated from the slot catalog.
- **P30 `classic-vs-modern.adoc` – Classic and Modern Zimlets** (Not started)
  - Differences table – a table of what differs between Classic and Modern UI Zimlets.
  - Capability checklist: Classic capability, Modern equivalent, not supported, or unknown – for each Classic capability: its Modern equivalent, not supported, or unknown.
- **P31 `glossary.adoc` – Glossary** (Not started)
- **P32 `known-limitations-and-gaps.adoc` – Known limitations and gaps** (Not started)
  - Missing information – information that is not yet available, and who can supply it.
  - Known defects and workarounds – known defects, with the workaround for each.
- **P33 `faq-and-getting-help.adoc` – FAQ and getting help** (Not started)
  - FAQ – answers to the questions authors ask most.
  - Report a documentation or template problem – where to report a problem with the guide or the template.
  - Where to ask for help – where to ask for help and what to include.
- **P34 `further-reading.adoc` – Further reading** (Not started)
  - Official documentation per technology – a link to the official documentation of each technology the guide uses.
- **P35 `appendix-zimbra-monorepos.adoc` – Appendix: Zimbra monorepos** (Not started, optional)
  - Layout and commands of `zm-modern-zimlets` and `zm-cloudsuite-zimlets` – how the two Zimbra Zimlet repositories are laid out and the commands used there.

### Part 5 – Common Zimlet patterns
*Purpose: provide goal-oriented recipes that combine the concepts and APIs from Parts 2–4 into complete, reusable Zimlet patterns. Keep API explanations in their topic pages and link to them rather than repeating them.*
- **P36 `zimlet-registration-patterns.adoc` – Common Zimlet patterns** (Not started)
  - Pattern chooser – a short guide from a goal to the matching recipe.
  - Pattern list – links to recipes for adding content to an existing screen, adding a tab and route, adding a settings page, and processing messages without UI.
  - Choosing a pattern – explain that the slot or registration key must be confirmed against P29 and the relevant feature page.
- **P37 `pattern-existing-screen-content.adoc` – Add content to an existing screen** (Not started)
  - Complete recipe from selecting a content slot through registering and rendering a small component.
  - Explain the slot choice, relevant props, and how to verify the result.
- **P38 `pattern-tab-and-route.adoc` – Add a tab and route** (Not started)
  - Complete recipe for registering a tab item and route, including reading the route slug through `useClientConfig`.
  - Explain how the tab and route registrations work together and how to verify the result.
- **P39 `pattern-settings-page.adoc` – Add a settings page** (Not started)
  - Complete recipe for registering and rendering a Zimlet settings page.
  - Explain where settings fit in the host UI and link to P13 for admin configuration where relevant.
- **P40 `pattern-message-processing.adoc` – Process messages without UI** (Not started)
  - Complete recipe for registering a message processor and handling its payload.
  - Explain when this pattern is appropriate and how to verify the registration and handler.

## 2. How to build the guide page by page

For each page, in the order of section 7:

1. Choose a page whose status is `Not started` and whose dependencies (section 7) are `Done` in the phase status column, or are listed as waived there.
2. Read the page brief in section 3 and the sources it names. Follow [write-doc.md](../rules/write-doc.md) for structure, examples, diagrams and images.
3. Write the page in `modules/ROOT/pages/`. Put examples in `modules/ROOT/examples/`, images in `modules/ROOT/images/` and diagrams in `modules/ROOT/images/diagrams/`.
4. Add the page to `modules/ROOT/nav.adoc`.
5. Verify each claim while you write, section by section, and keep the claim ledger ([write-doc.md](../rules/write-doc.md) section 7). Flag what cannot be run as unverified.
6. Update the page's status in section 1 to `Drafted`.
7. Optionally run the independent `review-doc` prompt. Only a review that finds no Blocking issue sets `Reviewed`.

## 3. Page briefs

What each page needs beyond its section list. Sources are in `zimlet-cli/.agents/reference/` and `zm-x-web/.agents/zimlet/reference/` unless stated otherwise.

| Page | Brief and sources | Examples and diagrams |
|---|---|---|
| P01 | Short. Names the audience and the reading paths. Gives a short list of what a Zimlet can do (the capability rows of P03 as plain phrases, without the API column) and links to P03. | None. |
| P02 | Short mental model, about one screen of text. Plain language. Sources: `architecture.md`, `runtime.md`. Internals do not belong here: they go to P11 (shim mechanism), P19 (shared iframe, restart on save, dev versus production loading), P22 and P23 (server bundle and version filtering). | Diagram: build, package, deploy, load, `init()`, slot (simplified from `architecture.md` §1). |
| P03 | Lives in Part 4 (reference). Matrix columns: capability, how, API used, page link, support status (supported, unverified, limitation). Rows: UI in existing screens (slots), new tabs and screens, settings pages, message and event processing (`messageProcessors:*`), app events, data (`fetch` API calls, ready-made hooks, batch client, mailbox metadata, Redux), modals and notifications, per-Zimlet admin config, localization, styles. Limitations: shared iframe, shimmed libraries only, single `index.js`, server filtering by version. | None. |
| P04 | Table columns: technology, why you need it, level, official docs. Technologies: JavaScript, Node.js 24 and npm, Git, Preact and JSX, CSS/Less and CSS Modules, Redux (shared state only), `preact-router`, semver ranges, ESLint, an editor, POSIX shell basics, HTTPS and self-signed certificates. Zimbra side: a server running Modern UI, shell access as `zimbra` or the admin console, a test account, the Modern UI version, the sideloader. | None. |
| P05 | Ends with a ready-check list. Sources: `cli-commands.md`, `packaging-deployment.md` §5. | Commands inline. |
| P06 | Task layout from `write-doc.md`. Applies the template fixes from `needs-attention.md` B1. Ends with a working zip. Sources: `authoring.md`, `cli-commands.md`. | Examples from the sample Zimlet. |
| P07 | Sources: `authoring.md` §1, `packaging-deployment.md` §1 and §2, and active Zimlet `package.json` manifests/scripts in both monorepos. Explain the purpose and availability of repository-specific scripts such as `security:audit`; inspect their definitions and run them in a relevant Zimlet when writing this page. | `package.json` and folder tree examples. |
| P08 | Sources: `authoring.md` §2, `runtime.md`. Include that the host calls the factory with `new` when it is constructible and as a plain call otherwise, and that for a Zimlet disabled for the account the factory still runs but `init()` is skipped, so keep factories free of side effects (moved from P02). | Factory example; diagram of the lifecycle. |
| P09 | Sources: `slot-behavior.md`, `authoring.md` §3, `verticals.md`, `zimlet-slots.yml`. Cover slot behavior, a short chooser/checklist and minimal registration examples; confirm slot choices against the catalog. Link to P29 for the full list and P36–P40 for complete recipes. | Minimal registration example; diagram of slot rendering. |
| P10 | Sources: `verticals.md`. Explain route and tab fundamentals and slot activation; link to P38 for the complete tab-and-route recipe. | Short route and tab item examples; slot activation table. |
| P11 | Sources: `context-and-shims.md` §2, `authoring.md` §4. Trimmed to what authors use. Include how the shimmed imports are replaced with the host's own copies and what that means for bundle size (moved from P02). | Short import examples. |
| P12 | Only fields an author uses, each with a short example. Source: `context-and-shims.md` §1. Open with what the Modern UI hands to a Zimlet through `context` (moved from P02). | Inline for one or two lines. |
| P13 | Sources: `context-and-shims.md` §3, `authoring.md` §7, `packaging-deployment.md` §2, `zimbra-zimlet-chat/src/api/fetch-request.js` (`FetchRequest` helper). The guide does not use GraphQL or list it as a dependency; it documents ready-made hooks only (rule in [write-doc.md](../rules/write-doc.md)). To investigate later: the proxy path option and which hooks to list. | Example: the `fetch` helper and one call that uses it; hook, Redux and config examples. |
| P14 | Source: `context-and-shims.md` §4. | Listener example; event table. |
| P15 | Sources: `authoring.md` §5; `zm-x-ui` files `css-variables.css`, `variables.less`, `palette.css`. Recommend host variables over hard-coded values, at least the common ones (primary colour and similar). To investigate later: which variables are stable and public, and how a Zimlet gets them at build time and runtime. | `.less` example using a host variable. |
| P16 | Sources: `authoring.md` §6, repo `AGENTS.md` (translation pointer). | `en_US.json` and `enhancers.js` examples. |
| P17 | Sources: `cli-commands.md` (webpack), `authoring.md` §8, `packaging-deployment.md` §3. | `zimlet.config.js` example. |
| P18 | Written to the same standard as the guide. Source: the sample Zimlet (section 5). Present it as an integrated sample and link to the focused recipes in Part 5. | Files taken from the sample. |
| P19 | Sources: `cli-commands.md`, `runtime.md` (debugging), `packaging-deployment.md` §5. Include the development versus production loading comparison, the shared same-origin iframe and what it means (shared `window`, not a security boundary), and the soft restart on save (moved from P02). | None. |
| P20 | Unit test pattern from `zimbra-cloud-common` (Jest, `jest-preset-preact`, Enzyme preact adapter, `npm run test:unit`). All commands verified in the sample. Cannot be automated today: gap A7. | Test example from the sample. |
| P21 | Sources: `packaging-deployment.md` §1, `cli-commands.md`. How to find the host version: Settings, then About. Explain the descriptor attributes, including `zimbraXZimletCompatibleSemVer` and that it is a version range (moved from P02). | Descriptor XML example, written for this page. |
| P22 | Source: `packaging-deployment.md` §3 and §4, trimmed to author consequences. Include how the server builds one bundle from the enabled Zimlets and filters it by version range (moved from P02), and how an end user enables or disables a deployed Zimlet from Modern UI user settings; confirm the exact UI labels and behavior in a live session. Redeploy, undeploy and rollback are gap A5: flag as unverified. | Commands inline. |
| P23 | Seed rows: Zimlet silently absent (the server leaves out Zimlets whose version range does not match the Modern UI, or that are not enabled for the user; moved from P02), certificate not accepted, `createElement` missing, import not shimmed, missing `zimlet.label`, asset 404 (`publicPath`), disabled for the COS, `off` throws. Source: `needs-attention.md`. | None. |
| P24 | Source: `cli-commands.md`. | None. |
| P25 | Sources: `packaging-deployment.md`, `authoring.md`, and active Zimlet `package.json` manifests plus their imports in both monorepos. Inventory each distinct dependency and its purpose; distinguish dependencies from development tools and host-provided shims. | File examples. |
| P26 | Source: `context-and-shims.md` §2 and `shims.js`. | None. |
| P27 | Only if not folded into P12 and P14. | None. |
| P28 | Each entry: purpose, signature or usage, example only where verified. Verify every export in `shims.js` and the host `src/hooks` folders. Document ready-made hooks, not GraphQL queries. | Examples only where verified. |
| P29 | Generated from `zimlet-slots.yml` with a script, so it can be refreshed. Columns: name, kind, host source file and owner, props or arguments, flags (render-prop, non-updating, wrapper). Only scanner-derived facts; placement and payload meaning say "details pending". | None. |
| P30 | Evidence is thin (gap A12); mark entries with no evidence as unknown, to confirm with Engineering. Sources: `runtime.md` (compat disabled), `context-and-shims.md` (`isCompat`, deprecated `zimbra`), `packaging-deployment.md` §3 (semver filter). | None. |
| P31 | Terms: Zimlet, Modern UI, slot, plugin, vertical, COS, `zmzimletctl`, sideloader, shim, HMR, factory, semver range. Start a stub early. | None. |
| P32 | User-facing form of section 6, each gap with: what is missing, impact, workaround, owner or next action. | None. |
| P33 | Built from the guide's own facts and the Support and Engineering question review (section 7, phase 8). Escalation path comes from the product team (gap A13). | None. |
| P34 | Official documentation index for all technologies. | None. |
| P35 | Optional and short. Source: `zimlet-repositories.md`, which compares the two Zimlet monorepos. | None. |
| P36 | Entry point for the cookbook. Map reader goals to the P37–P40 recipes and link back to the relevant concept, API and reference pages. Confirm each pattern's registration key or slot against P29; do not repeat its implementation. | Pattern chooser table. |
| P37 | Sources: `slot-behavior.md`, `authoring.md` §3, P12, and the real `slot::message-body-top` example in personal-notes. Walk through selecting a content slot, registering a handler and rendering a small component. Link to P09 and P29 for slot mechanics and catalog details. | Complete content-slot recipe, with a verification checklist. |
| P38 | Sources: `verticals.md`, `authoring.md` §3, P10, and the template's `slot::email-tab-item` and `slot::routes` example. Walk through registering a tab item and route together, including `useClientConfig` for the slug. | Complete tab-and-route recipe, with a verification checklist. |
| P39 | Sources: `authoring.md` §3, P09, and the verified settings registration implementation. Walk through registering and rendering a settings page; link to P13 for administrator configuration rather than duplicating it. Verify the registration key and behavior before documenting. | Complete settings-page recipe, with a verification checklist. |
| P40 | Sources: `authoring.md` §2–3, P09, and the verified message-processor implementation. Walk through a headless message-processing Zimlet, its registration key and payload handling. Link to P14 for app-event listeners; do not imply that those are the same mechanism. | Complete message-processing recipe, with a verification checklist. |

## 4. Scope decisions

| Topic | Decision |
|---|---|
| Format and location | Antora / AsciiDoc in `zimlet-cli/documentation/` (`antora-playbook.yml`, `antora.yml`, `modules/ROOT/`). Pages in `modules/ROOT/pages/`, navigation in `modules/ROOT/nav.adoc`. Build: `npm run build:docs`. Preview: `npm run preview:docs`. |
| Audience | Zimbra developers and partners: front-end developers new to Zimbra, Preact, the Zimlet CLI and the Zimbra server. No Zimbra-internal knowledge is assumed. |
| Coverage | Modern UI Zimlets only, not Classic Zimlets or Java extensions. P30 explains how Classic capabilities map to or differ from Modern. |
| Slots | In scope end to end: the mechanism and contract, how to find and choose a slot, worked examples, and an index of all extension points (P29). Detailed per-slot documentation (placement and payload meaning for each extension point, all `unclassified` today) is a later phase. P29 is structured so those details can be added per slot without restructuring. |
| Common patterns | A separate Part 5 cookbook provides an index and one page per substantial pattern. P09 and the feature pages teach the underlying concepts; cookbook pages apply them without repeating API reference material. Confirm every registration key and slot from the catalog and available real code before documenting it. P18 remains the integrated sample, not a replacement for focused recipes. |
| Left out | Webpack and esbuild internals, `postMessage`, Redux `removeModal` bug details, CI and OS-package build scripts, translation tooling for Zimbra staff, the Lerna release flow. Only facts a Zimlet author needs. Zimbra-staff monorepo notes go into the optional P35. |
| Source material | Index: `zimlet-cli/AGENTS.md`. Reference files in `zimlet-cli/.agents/reference/` and `zm-x-web/.agents/zimlet/reference/`; rules in the `rules/` folders; the generated catalog `zm-x-web/.agents/zimlet/context/zimlet-slots.yml`; combined repo guide `zimlet-cli/.agents/reference/zimlet-repositories.md` (local `zimlet-repo.md` files point to its sections). Real code: `zm-x-zimlet-template-default` (scaffold), `zm-x-oauth-client` README, `zm-modern-zimlets/zimlets/zimbra-zimlet-personal-notes` (smallest real example), `zm-x-web/README.md` (dev server and version lookup; it contains a dev hostname and CI badge tokens, which must not be copied). |
| Old Zimlet wiki | `zimlet-cli.wiki` is excluded: it is not a source and is not linked or mined for topics. |

## 5. Working sample Zimlet

Location: `zimlet-cli/examples/zimbra-zimlet-sample/` (new; the old `examples/dropbox` stays untouched and is called out as stale). Built on `@zimbra/zimlet-cli ^19.0.0` and Node 24, free of the template defects in gap B1. It stays small but exercises every major capability, so the guide can point at real, buildable code. Example files in the guide are copies of its files (see [write-doc.md](../rules/write-doc.md)).

| Capability | Demonstrated by |
|---|---|
| Factory, `init()`, `plugins.register` | `src/index.js` |
| Content slot (UI inside an existing screen) | a slot such as `slot::message-body-top` (pattern from personal-notes) |
| New tab and route | `slot::email-tab-item` and `slot::routes`, slug read through `useClientConfig` |
| Shared libraries, hooks, `@zimbra-client/components` | `MenuItem`, a `lucide-preact` icon component |
| Data access | one `fetch`-based API call through a small helper, and one ready-made hook such as `useAccountInfo` (verified export) |
| App events | one `zimletEventEmitter` listener |
| Styling | a `.less` CSS Module in `src/components` using host style variables |
| Localization | `src/intl/en_US.json`, a second locale, `withIntl`, `zimlet.label` and `zimlet.description` |
| Admin configuration | `config_template.xml` read through `useAccountInfo` |
| Testing | a Jest and Enzyme unit test (pattern from `zimbra-cloud-common`) and a lint script |
| Packaging | `npm run package` producing `pkg/<name>.zip` |

Acceptance: from a fresh clone, `npm install`, `npm run lint`, `npm test`, `npm run build` and `npm run package` succeed on Node 24, and `zimlet watch` serves `index.js`. Behaviour inside Modern UI and server deployment stay **unverified** until a test server is available (gap A1) and are labelled so in the guide.

## 6. Known gaps that feed the guide

Published in P32 in user-friendly form.

**A. Missing information (nothing in the source files)**
1. No instructions for obtaining a Modern UI test environment: which edition and version, a test account or COS, shell access. The same applies to external developers without a Zimbra server.
2. The Zimbra release to `zm-x-web` version mapping is not documented, though it is needed to choose `--zimbraXVersion`. The template uses `^4.0.0`, real Zimlets `^4.42.0`, the host is 4.50.0. Only the About-dialog lookup is documented.
3. Sideloader: how to obtain, build and deploy it, whether it is pre-installed, and which COS or users need it are not documented.
4. Admin console deployment is only referenced ("see the Zimbra admin guide"); there is no link or screenshot.
5. Update, redeploy, undeploy and rollback behaviour of `zmzimletctl` for a deployed Zimlet is not described.
6. Windows: package scripts use `$npm_package_name` (POSIX shell syntax); behaviour on cmd or PowerShell is untested (inferred, to confirm).
7. Testing: there is no end-to-end approach for Zimlets; only `zimbra-cloud-common` has unit tests (Jest). The guide documents lint, build, manual and unit testing (P20).
8. Security guidance for authors (sanitising with the shimmed `dompurify`, the same-origin shared iframe giving no isolation, secrets handling) is not in the source files.
9. Per-slot details for each extension point are not researched (all `unclassified`). P29 ships a factual index now.
10. Distribution for non-Zimbra developers (publishing, signing, licensing) is not documented.
11. There is no versioning policy for Zimlets (Zimlet semver against the host compatibility range).
12. The Classic to Modern capability list is incomplete. The sources say the Classic compat bridge is disabled and list a few differences, but there is no authoritative inventory. Engineering must review P30; comparing the Classic Zimlet repositories with the Modern slot catalog could help.
13. The support and escalation path for partners (where to ask, report bugs, request new slots) is not defined.
14. API reference depth: the available server API endpoints and the `zimbraBatchClient` operations are not described; the guide shows the `fetch` pattern and points to host source folders. Hooks and exports are documented only as far as verified in `shims.js` and the host source.
15. Existing sample material is stale: `zimlet-cli/examples/dropbox` is "an old sample, not the live Dropbox zimlet" and the default template is outdated, so the new sample is the only maintained example until the template is refreshed.

**B. Known defects and staleness (from `needs-attention.md`, described with workarounds)**
1. Default template (last commit 2022): pins `@zimbra/zimlet-cli ^14` (the build breaks on CLI 19 because of `preact-i18n`), uses the unsupported string icon `question-circle`, ESLint 8 with `eslint-config-synacor`, lacks `zimlet.label` and `zimlet.description` in `en_US.json`, README typo. P06 documents the manual fixes.
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

## 7. Build order

Each phase produces files under `zimlet-cli/documentation/modules/ROOT/` (or `zimlet-cli/examples/` for the sample) and updates `nav.adoc` and the statuses in section 1.

| Phase | Work | Pages | Depends on | Status |
|---|---|---|---|---|
| 1. Foundation | Finalise the navigation skeleton, a page template for the task layout (Goal, Before you start, Steps, Expected result, If it didn't work, Next step), admonition conventions and a glossary stub. | P31 (stub) | None | In progress |
| 2. Groundwork | Spike the tutorial path in a scratch folder outside the repo (install Node 24, `npm i -g @zimbra/zimlet-cli`, `zimlet create`, apply the template fixes, `build`, `package`), recording exact commands, outputs and errors; anything needing a server or Modern UI is marked unverified. Build the sample Zimlet (section 5) and lint, test, build and package it on Node 24. Compile the capability matrix and the APIs and hooks inventory from `shims.js`, the host `src/hooks`, and the catalog, verifying each export. Start the Classic-versus-Modern evidence list and record open questions for Engineering. | P18 (code), P03, P28, P30 (evidence) | 1 | Not started |
| 3. Getting started | Welcome and Part 1 pages. Check that every official link in P04 is live. | P01, P02, P04–P06 | 2 | In progress |
| 4. Build your Zimlet | Part 2 pages. | P07–P17, P18 (page) | 2, 3 | Not started |
| 5. Test, package, deploy | Part 3 pages. | P19–P23 | 2 | Not started |
| 6. Reference | Reference pages, including the scripted slot index. | P03, P24–P30, P34, P35 | 2 | Not started |
| 7. Common patterns | Write the cookbook index and focused recipes. Reuse the sample where appropriate, verify example code with the documentation verification workflow, and confirm each slot or registration key against P29 and real code. Mark behavior that needs a live Modern UI environment as unverified; do not present a stub-host check as proof of UI rendering. | P36–P40 | 2, 3, 4, 6 | Not started |
| 8. Quality and release | Gaps page (P32) and FAQ (P33). Verify that every example file matches the sample or builds in a scratch Zimlet. Re-verify each claim against current source (`src/commands/*.js`, `zm-x-web/src/lib/zimlet-manager/*`, `package.json` versions) and check the quoted versions (CLI 19.0.0, Node ^24.18.0, zm-x-web 4.50.0). Point `AGENTS.md` and the `zimlet-cli` README at the published guide (confirm with the team before editing README links). Ask Support and Engineering for the most frequent Zimlet development questions and confirm each is answered or listed as a gap; send P30 to Engineering for review. Cold-read the whole guide as a newcomer (or with a reviewer agent) and fix every unexplained term, tool or command. Run `npm run build:docs`, fix Antora warnings, and check navigation, `xref:` links and external links. | P32, P33 and all pages | 3, 4, 5, 6, 7 | Not started |

Phase status values: `Not started` · `In progress` · `Done`. A phase is `Done` when every page it lists is at least `Drafted` and its other work (spike, sample Zimlet, template, inventories) is finished. Update the status in the same change that finishes the work. To check a page, find its phase in the "Pages" column; its dependencies are the phases in that row's "Depends on" column, and they are satisfied only when those phases are `Done`.

If you decide to write a page before its dependencies are `Done`, record the waiver here so the next reader knows why. Remove the entry when the dependency is `Done`. An agent that finds unmet dependencies stops and asks, and adds the waiver only after approval. An agent sets a phase to `Done` only when the page work and the non-page work are both finished.

| Page | Waived dependency | Reason | Consequence |
|---|---|---|---|
| P02 | Phases 1 and 2 | Concept page that needs only `architecture.md` and `runtime.md`. | Glossary and other link targets are placeholder pages. Facts that depend on the phase 2 spike are flagged `Unverified`. |

## 8. Open questions

- Is `https://zimbra.github.io/zimlet-cli` (from the playbook) still the publishing target?
- Does the sample Zimlet stay in `zimlet-cli/examples/` (recommended) or move to its own repository?
- Who reviews P30 and owns the support and escalation path (gaps A12, A13)?
- Who owns the glossary and the future per-slot detail pages?
- Which `zm-x-ui` style variables are public and stable enough to recommend (P15), and how does a Zimlet consume them?
- Which server API endpoints should the `fetch` examples call (P13), and is the proxy path option needed?
- Can we get access to a Modern UI server to validate the deployment and sideloader parts, so they can move from "unverified"?
