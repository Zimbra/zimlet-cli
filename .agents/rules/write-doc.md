# Rules for writing Zimlet documentation

Source material for the guide is indexed in the root [AGENTS.md](../../AGENTS.md#topic-to-file-map). Cite the instruction files and the source paths they reference; do not copy absolute paths. Verify statements against code.

These rules apply to every page under [documentation/](../../documentation) (Antora site, AsciiDoc). The guide is technical documentation for Zimlet developers: it must be accurate, task-oriented and reproducible. This file holds the core rules. Sections 3, 4, 5, 6, 7, 8 and 9 have their own files, named in the section pointers below, and they keep the same section numbers.

## 0. Check the length before you write

Before writing, estimate how long the page will be. If the page lists many items (for example every export of a module, every slot, every command or every option) and a full entry for each would make it very long, stop the write operation, tell the user how large it would be and ask how to handle it (shorter entries, splitting the page, or a generated table). Do not start writing a very long page first and trim it later.

## 1. Where files go

| Content | Location | Used with |
|---|---|---|
| Pages | `documentation/modules/ROOT/pages/<folder>/<topic>.adoc`, listed in `modules/ROOT/nav.adoc` | `xref:<folder>/<topic>.adoc[...]` |
| Code and config examples | `documentation/modules/ROOT/examples/<topic>/<path>` (a multi-file example keeps the file's relative path, for example `components/Button/index.js`) | `include::example$<topic>/<path>[]` |
| Images (screenshots) | `documentation/modules/ROOT/images/<topic>-<name>.png` | `image::<topic>-<name>.png[alt text]` |
| Diagrams | source `documentation/modules/ROOT/images/diagrams/<name>.mmd` and its rendered `<name>.svg` in the same folder | `image::diagrams/<name>.svg[alt text]` |

- Nest pages in folders that follow the navigation, so that the URL follows it too. Each navigation group is a folder of `pages/`, named in lowercase kebab case after the group: `getting-started/`, `fundamentals/`, `build-by-goal/`, `go-deeper/`, `test-package-deploy/`, `reference/` (the API reference) and `help-and-migration/`. A group that has no page of its own is still a folder. Only `index.adoc` (Home) sits in `pages/` itself. A page that has child pages sits beside its folder (`reference/context/plugins.adoc` beside `reference/context/plugins/`), and a child page uses a short name without the names of its parents (`reference/context/plugins/register.adoc`). Every page in the plan section 1 lists its path, for example `fundamentals/project-structure.adoc`. Write every xref from the pages root, with the folder: `xref:fundamentals/project-structure.adoc[Project structure]`. When you add a page, put it in the folder of its part, and keep the folder names in the plan, the navigation and the xrefs the same.
- Use lowercase kebab-case names. A file name says what it shows, not where it is used (`register-slot.js`, not `figure1.js`).
- Do not store examples or images next to pages or outside `modules/ROOT`; Antora resolves them only from there.

## 2. How every page is written

- Start with `= Title`, then an introduction that gives three things: a summary of the page (what it covers or what the reader gets), when to read it, and why it matters to a Zimlet author. Write it as one paragraph when that is enough, and as more than one when the page needs it. There is no sentence limit. Do not walk through the sections that follow, do not repeat what a section says, and do not pad. Lead with the outcome. Say when and why in a plain, varied way, as a fact about where the page sits or what it is useful for. Do not use the same formula on every page, such as "Read this before X so that Y" or "Do this after X and before Y". One `=` title per page; do not skip heading levels. Headings are sentence case and name the topic or task (`Register a slot`, not `Introduction`).
- Write in second person and present tense, with active voice. Steps are imperative (`Run`, `Open`, `Add`). One idea per paragraph, short sentences, plain words.
- One concept per page. Do not repeat generic text; link to the page that owns it with `xref:`.
- Before you write steps, commands or a procedure, check section 1 of [zimlet-documentation-plan.md](../plans/zimlet-documentation-plan.md) for a page that owns the topic (for example deploy, build and package, run and debug). If one exists, write one sentence of what the reader needs and link to it; do not copy its steps, commands or variants, even when the page is not written yet. Give the commands inline only when the page's own entry in section 1 asks for them.
- Write for anyone who wants to extend the Modern UI with a feature, whether a Zimbra developer or not, and who may be new to Zimbra, Preact, the Zimlet CLI and the Zimbra server. Assume no Zimbra-internal knowledge. Administrators who only deploy a Zimlet are served by the deploy and troubleshooting pages.
- Leave out webpack and esbuild internals, `postMessage`, Redux `removeModal` bug details, CI and OS-package build scripts, translation tooling for Zimbra staff and the Lerna release flow. Include only facts a Zimlet author needs.
- Leave GraphQL and Apollo out of the guide. Do not document or use `getApolloClient()`, `@apollo/client` (`useQuery`, `useMutation`, `gql`), GraphQL queries or mutations, or the queries and `with*` wrappers of `@zimbra-client/graphql`, in text, examples, diagrams or reference entries. Show a ready-made hook (`@zimbra-client/hooks`, `@zimbra-client/hooks/graphql`) or `zimbraBatchClient` instead. The module inventory lists these modules by name only, with no usage. This limits the guide, not a Zimlet's own code. Do not add a GraphQL or Apollo dependency to an example.
- Do not create a page unless you will write its content now. Link to a page that is planned but not written yet: take its path from the page's entry in [zimlet-documentation-plan.md](../plans/zimlet-documentation-plan.md) section 1 and write `xref:<path>[...]`, for example `xref:fundamentals/extending-the-ui.adoc[...]`, with no section anchor (`#...`), because the section ids do not exist yet. Do not guess a file name that is not in the plan. Antora logs `target of xref not found` for these links until the target page exists. That message is expected for a planned page and is not a reason to remove the link or to write the page early. Any other `target of xref not found`, for example a path that is not in the plan or a typo, is a defect: fix it. When you create a page, check that no earlier page in `pages/` still lacks a link to it that now fits, and add the link.
- Explain a term the first time it appears, and link it to the page that owns it. If the plan has a concept page that teaches the thing, link to that page, even when it is not written yet, and never to the glossary or to a reference page. This covers concepts (the context, the factory, slots, plugin handlers, shims, the descriptor, the sideloader, verticals) and the API names or context fields that the page teaches (`plugins` and `zimlets` go to the slots page, `store`, `zimbraBatchClient`, `zimbraOrigin` and `csrfToken` to the data and state page). A field name is not a reason to link to its reference page. Link to a reference page only when the sentence sends the reader to look up the exact signature, arguments or return value, or when the plan has no concept page for that API (for example `meta` and `keyBindings`). A short, stable term with no concept page (Modern UI, Zimlet, class of service, semver range, HMR, `zmzimletctl`) links to its glossary entry. When you add a concept page for a term that is in the glossary, remove the glossary entry. Do not re-teach Preact, Node or GraphQL; link to their official documentation.
- Use one term for one thing: *Zimlet*, *Modern UI*, *slot*, *plugin handler*. Put code identifiers, file names, commands and keys in backticks.
- Use `NOTE` for information and `WARNING` for things that can break a Zimlet or a server.
- Run what you can run, and record only what you could not confirm in the [open claims](../plans/zimlet-documentation-claims.md). The rules for running, recording and closing claims are in section 2 of [claims.md](./doc-guide/claims.md). Read that file in full together with this one. Do not put an `Unverified` admonition or any other verification note in the page.
- Do not use `zimlet-cli.wiki` as a source. Do not link to source code or name private repositories (such as `zm-x-web`) in the pages. Source repositories are not public. External links point only to authoritative documentation relevant to the topic, such as official documentation for Preact, Node.js, Antora or Zimbra.
- Open every external link in a new tab: end the link text with a caret, for example `https://preactjs.com/guide/v10/getting-started[Preact guide^]`. Do not add the caret to `xref:` links. The site adds an icon after every link that opens in a new tab, so do not write one in the text.
- When relevant information is unavailable in accessible repositories and you rely on an external source, give only a brief overview and link directly to that source. Do not reproduce detailed instructions or commands from a source you cannot inspect.
- Keep AsciiDoc simple: tables, admonitions, `xref:` and `include::`. Use `:page-` attributes only when needed.
- Never include credentials, tokens (including CI badge tokens), keys, internal hostnames or customer data in text, examples, screenshots or diagrams. Use placeholders such as `<your-zimbra-server>`.
- The guide covers Modern UI only. Do not mention Classic UI, compare with it, or add a "not covered here" note on any page. Classic UI appears only on the dedicated Classic and Modern page and in places where the reader would otherwise do something that fails on a Modern UI server. Do not link to that page from other pages unless the reader needs it for the task at hand.
- Match the page to its part. Each part of the guide has a stated purpose in section 1 of [zimlet-documentation-plan.md](../plans/zimlet-documentation-plan.md). Before you write, read the purpose of the part the page is in. Include only what that purpose calls for, and leave out detail that belongs to a later part, such as mechanisms, option lists and edge cases in Getting started. If a page needs content that does not fit its part, put that content on the page where it fits and link to it.
- Do not give time or effort estimates.
- End each page with a link to the next logical step.

### Updating an existing page

- For a scoped update, inspect only the named sections and the plan and reference material relevant to them. Do not scan or re-audit unrelated sections.
- Where a changed plan or reference alters a fact, search the whole page for every place that states it: section text, diagram sources and rendered diagrams, alt text, captions, tables and example files. Update each one, or say in the summary why it stays. If the scope names a changed plan or reference, use it to update only the affected sections. When the user adds new reference material, also correct the wording and practical examples that it now changes.
- For a non-scoped update, verify each section being updated against the current plan and the code behind it, as section 7 of [claims.md](./doc-guide/claims.md) describes. Revise wording or examples as needed, and update the plan if the code or references show its section list or brief is out of date.

## 3. Page types and what each must contain

The four page types (Concept, Task, Reference, Troubleshooting), what each must contain, and the rules for inventory pages and for deployment pages are in [types.md](./doc-guide/types.md). Read that file in full before you write.

## 4. Examples

The rules for examples, slot patterns and API calls are in [examples.md](./doc-guide/examples.md). Read that file in full before you write an example.

## 5. Diagrams and images

The rules for diagrams and screenshots are in section 5 of [media.md](./doc-guide/media.md). The same file says when to ask the user for screenshots of UI steps, when to add one, and that a screenshot is never enlarged.

## 6. Accessibility

The accessibility rules for text, tables, code, diagrams and images are in [accessibility.md](./doc-guide/accessibility.md). Every page must meet them.

## 7. Verify as you write

The rules for checking claims while you write, the ledger and confirming claims with the user are in section 7 of [claims.md](./doc-guide/claims.md). Read that file in full together with this one. They apply to every change to the guide, however it was requested, and the confirmation with the user comes before any claim is recorded.

## 8. Finishing a page

The rules check, the build and preview checks and the recording of gaps are in [finish.md](./doc-guide/finish.md). The conditions for a finished page and the claim ledger are in section 8 of [claims.md](./doc-guide/claims.md).

## 9. Style

The style rules are in [style.md](./doc-guide/style.md). Read that file in full together with this one.
