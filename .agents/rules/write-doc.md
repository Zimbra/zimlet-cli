---
applyTo: 'documentation/**'
---

# Rules for writing Zimlet documentation

Source material for the guide is indexed in the root [AGENTS.md](../../AGENTS.md#topic-to-file-map). Cite the instruction files and the source paths they reference; do not copy absolute paths. Verify statements against code.

These rules apply to every page under [documentation/](../../documentation) (Antora site, AsciiDoc). The guide is technical documentation for Zimlet developers: it must be accurate, task-oriented and reproducible.

## 1. Where files go

| Content | Location | Used with |
|---|---|---|
| Pages | `documentation/modules/ROOT/pages/<topic>.adoc`, listed in `modules/ROOT/nav.adoc` | `xref:<topic>.adoc[...]` |
| Code and config examples | `documentation/modules/ROOT/examples/<topic>/<name>.<ext>` | `include::example$<topic>/<name>.<ext>[]` |
| Images (screenshots) | `documentation/modules/ROOT/images/<topic>-<name>.png` | `image::<topic>-<name>.png[alt text]` |
| Diagrams | source `documentation/modules/ROOT/images/diagrams/<name>.mmd` and its rendered `<name>.svg` in the same folder | `image::diagrams/<name>.svg[alt text]` |

- Use lowercase kebab-case names. A file name says what it shows, not where it is used (`register-slot.js`, not `figure1.js`).
- Do not store examples or images next to pages or outside `modules/ROOT`; Antora resolves them only from there.

## 2. How every page is written

- Start with `= Title`, then one or two sentences saying what the reader gets from the page. One `=` title per page; do not skip heading levels. Headings are sentence case and name the topic or task (`Register a slot`, not `Introduction`).
- Write in second person and present tense, with active voice. Steps are imperative (`Run`, `Open`, `Add`). One idea per paragraph, short sentences, plain words.
- One concept per page. Do not repeat generic text; link to the page that owns it with `xref:`.
- Explain a term the first time it appears and link to the glossary. Do not re-teach Preact, Node or GraphQL; link to their official documentation.
- Use one term for one thing: *Zimlet*, *Modern UI*, *slot*, *plugin handler*. Do not name `zm-x-web`; say *Modern UI*. Put code identifiers, file names, commands and keys in backticks.
- Use `NOTE` for information and `WARNING` for things that can break a Zimlet or a server.
- Run everything you can run on your own machine before you mark anything `Unverified`. Client-side commands and code, such as `zimlet create`, `build`, `watch` and `package`, the build of an example, lint and unit tests, need no server and no one else's help: run them with the [zimlet-doc-verify](../skills/zimlet-doc-verify/SKILL.md) skill, in a scratch project outside the repository, and use the real output. Not running something that runs locally is a defect, not a reason to mark it `Unverified`. Keep the evidence (the command and what it printed) for your summary, and note any difference between the real output and the reference files or the CLI's own messages as a gap.
- Mark a command, example, step or statement as `[CAUTION]` with the title `Unverified` only when you could neither run it nor confirm it in the code, for example because it needs a Zimbra server, a Modern UI session, an account or a permission you do not have. Reading a reference file is not verification. Reading the code is verification for a statement about what the code does, when you follow the whole path through code you can read. It is not verification for a command, example or step you could run, and not for behaviour that only shows in a running system you cannot observe, such as deploying to a server and seeing the result in the Modern UI. Follow these rules:
  - Put the admonition directly after the item it covers, not at the end of the page or once for a whole section. Do not use one general admonition for a group of claims.
  - Name the item: say which command, example or statement is unverified, and what you did check (for example "the example builds with `zimlet build`; it was not loaded in a running Modern UI").
  - End with a `To verify:` step the reader can follow, with the result to expect (a command's output, a message in the browser console, or what appears in the UI). Take the result from the code or reference, and say where it comes from if it is not obvious. If the verification belongs in a step of the page, put it there.
  - Check every command you mention, including those in diagrams, images and tables. A command that you did not run is unverified wherever it appears. If an unverified command is not needed for the point, leave it out.
  - Remove the admonition only after you have run the item, and say in the summary what you ran.
- Do not use `zimlet-cli.wiki` as a source. Do not link to source code or name private repositories (such as `zm-x-web`) in the pages. Source repositories are not public. External links point only to authoritative documentation relevant to the topic, such as official documentation for Preact, Node.js, Antora or Zimbra. Put every code example in `examples/`.
- When relevant information is unavailable in accessible repositories and you rely on an external source, give only a brief overview and link directly to that source. Do not reproduce detailed instructions or commands from a source you cannot inspect.
- Keep AsciiDoc simple: tables, admonitions, `xref:` and `include::`. Use `:page-` attributes only when needed.
- Never include credentials, tokens (including CI badge tokens), keys, internal hostnames or customer data in text, examples, screenshots or diagrams. Use placeholders such as `<your-zimbra-server>`.
- The guide covers Modern UI only. Do not mention Classic UI, compare with it, or add a "not covered here" note on any page. Classic UI appears only on the dedicated Classic and Modern page and in places where the reader would otherwise do something that fails on a Modern UI server. Do not link to that page from other pages unless the reader needs it for the task at hand.
- Match the page to its part. Each part of the guide has a stated purpose in section 1 of [zimlet-documentation-plan.md](../plans/zimlet-documentation-plan.md). Before you write, read the purpose of the part the page is in. Include only what that purpose calls for, and leave out detail that belongs to a later part, such as mechanisms, option lists and edge cases in Getting started. If a page needs content that does not fit its part, put that content on the page where it fits and link to it.
- Do not give time or effort estimates.
- End each page with a link to the next logical step.

## 3. Page types and what each must contain

| Type | Must contain |
|---|---|
| Concept (how something works) | Plain-language explanation limited to what the reader needs for the next task: a page in Getting started gives the short mental model, and mechanisms that matter only when debugging or going deeper go to the page where the reader needs them; why it matters to a Zimlet author; a diagram when the topic involves flow, parts or lifecycle (section 5); a link to the task that uses it. No step lists. |
| Task (how to do something) | **Goal → Before you start → Numbered steps with exact commands → Expected result → If it didn't work → Next step.** One working example (section 4) when the task writes code. For packaging or deployment tasks, include exact commands and expected output or result from [packaging-deployment.md](./packaging-deployment.md), and state the target `--zimbraXVersion` range and how to find the host version. |
| Reference (commands, slots, APIs, options, extension points) | One entry per item with: purpose, contract as a table (name, type, meaning), one minimal example, and caveats. For command references, document syntax, arguments, options, defaults, and effects. Facts only; no tutorial text. For a slot or `invokePlugin` key, also explain what it does in the UI or flow, where it is rendered (feature component and the component that renders it), and how to see it in the running app (`?zimletSlots=show`). Include a payload table (prop, type, meaning; label inferred types as inferred) and a registration example. Follow [slot-doc.md](./slot-doc.md) for the research and evidence rules. |
| Troubleshooting | Symptom as the reader sees it (message or behaviour), cause, fix. |

## 4. Examples

- Give a working example for every topic that tells the reader to write code or configuration, and for every slot or extension point page. Registering a slot always needs one.
- When writing a complete, runnable Zimlet example, use the [Zimlet creation workflow](../workflow/create-zimlet.md).
- Examples must follow [authoring.md](./authoring.md): `createElement` imported from `preact` in JSX files, only shimmed imports, plugins registered inside `init()`, and `en_US.json` structure for strings. Also follow the coding style of the default template: tabs, single quotes, a line width of 100 (its `.editorconfig` and ESLint/Prettier configuration), and `createElement` as the JSX pragma. Packaging and `config_template.xml` examples must follow [packaging-deployment.md](./packaging-deployment.md).
- Examples are complete and copy-pasteable, with imports and the default export. Verify runnable examples in a scratch project using the [zimlet-doc-verify skill](../skills/zimlet-doc-verify/SKILL.md). If a snippet could not be run, mark it `Unverified` as described in section 2.
- Keep every JS, JSX, JSON, XML and Less example longer than two lines in a file under `modules/ROOT/examples/` and include it. Use `tag::name[]` and `end::name[]` comments and `include::example$...[tags=name]` to show only the relevant part, and state in the text what the part does.
- Inline code is allowed only for one or two lines (an import, one call, a config key) and for short shell commands in numbered steps. Use `[source,js]` or `[source,sh]` and always set the language.
- Use [zimlet-registration-patterns.md](../reference/zimlet-registration-patterns.md) and its [data file](../context/zimlet-registration-patterns.yml) to find a suitable Zimlet and pattern for the example. Inspect the relevant source, then create a simple, focused example for the topic using only the necessary details. Do not copy a whole Zimlet file or name a real Zimlet as the example's source.
- An example shows one use case with the least code that conveys it. Leave out features, helper components, styling, localization and business logic that the topic does not need. Use neutral names (`Greeting`, `my-zimlet`) and do not tie the example to a product feature, so the reader can adapt it to their own case. If you cannot say in one sentence what the example demonstrates, it is too big or too specific: cut it or split it.
- An example may leave out a part of [authoring.md](./authoring.md) that is not its topic, to stay simple. The common case is visible text: write literal text instead of `<Text id>` with `withIntl` and `en_US.json`. Tell the reader in advance with a short `NOTE` right after the example, in this order: what the example simplifies, what happens if they copy it as is (for example "the `preact-i18n/no-text-as-children` lint rule in a project from the default template reports it"), and an `xref:` to the page that shows the full approach. Say that the build or compile fails only when you have checked that it does. Apply the same approach to every similar case: a simplification is always disclosed, with its consequence and a link to the full version.
- Never simplify away something that makes the Zimlet fail at run time or fail to build: the `createElement` import, shimmed-only imports, registering inside `init()`. An example that leaves these out does not work, so keep them even if it makes the example longer.
- Confirm the example against the real pattern (the slot name, the props, the imports) and, where you can, build it in a scratch project before you publish it.
- Placeholders in examples are marked `<like-this>`; never use real accounts, hostnames or tokens.

A slot registration example looks like this, kept in `examples/slots/register-slot.js` and included in the page:

```js
import { createElement } from 'preact';

export default function Zimlet(context) {
  const { plugins } = context;
  return {
    init() {
      plugins.register('slot::<slot-name>', props => <Greeting {...props} />);
    }
  };
}
```

### Common slot patterns

- Take the use cases, the Zimlets that implement them and the example to adapt from [zimlet-registration-patterns.md](../reference/zimlet-registration-patterns.md) and its [data file](../context/zimlet-registration-patterns.yml). Do not invent a pattern that is not in it.
- Document slots by use case as well as by name. A "Common patterns" section shows, for each use case (for example add content to a screen, add a menu item or action, add a settings page, add a tab and screen), the slot to use, a complete registration example in `examples/slots/<use-case>.js`, and a link to the slot's catalog entry.
- Every pattern example follows [authoring.md](./authoring.md) and the same rules as any slot example above.

### Calling an API in examples

- Follow the [API calling guidance](../reference/authoring.md#7-api-calling) to choose a suitable method. For documentation examples, do not implement custom GraphQL operations or add GraphQL/Apollo dependencies; if a GraphQL-backed operation is needed, use a ready-made host hook. This restriction applies only to documentation examples, not Zimlet implementation.

## 5. Diagrams and images

- Prefer a diagram over a screenshot whenever the topic is structure, flow, sequence, lifecycle or relationships: how a Zimlet is built, packaged, served and loaded; the `init()` and plugin registration order; slot rendering; the server bundle path.
- Write diagrams as Mermaid text in `images/diagrams/<name>.mmd`, render them to SVG next to it, and embed the SVG. Commit both files; the page shows the SVG, the `.mmd` is the editable source. The Antora playbook has no diagram extension, so do not embed Mermaid blocks directly.
- A diagram shows one idea with about twelve nodes or fewer, uses the same terms as the text, flows left to right or top to bottom, and has a one-sentence introduction in the page and alt text that states the point of the diagram. No diagram may be the only place a fact appears.
- Lay a diagram out so it stays readable at the size the page shows it:
  - Keep it compact: the rendered SVG `viewBox` is at most about 900 px wide and 700 px tall. Check this in the generated `.svg` (`viewBox` and `max-width` at the top of the file). A long single row of nodes is shrunk by the page width until its text is unreadable; a long single column is taller than the screen.
  - Group nodes in labelled subgraphs (for example "On your machine", "Zimbra server", "Modern UI in the browser") and run each group left to right, with the groups stacked top to bottom, instead of one long chain.
  - Keep node text to about six words and edge labels to about three. Put a command on the edge and a thing in the node. Move longer explanations into the text.
  - Do not scale a diagram down with `width=`. If it does not fit at its natural size, split it or regroup it.
  - Never rely on colour alone to carry meaning. Use a label or a different shape as well.
- Every diagram and image is readable in the rendered page at normal zoom: all text legible without zooming, nothing cut off, the order of the flow clear. A diagram that builds without errors can still be unreadable.
- Use a screenshot only for something a diagram cannot show, such as the real Modern UI layout or the About dialog. Save as PNG in `images/`, crop to the relevant area, and remove names, email addresses, hostnames and tokens. Give every image alt text and a caption in the page.
- Update or remove an image or diagram in the same change that alters what it shows.

## 6. Accessibility

Every page meets WCAG 2.2 level AA. These rules apply to text, tables, code, diagrams and images.

**Text and structure**

- Use real headings in order (`==` after `=`, `===` after `==`), never bold text as a heading. One `=` title per page.
- Link text says where the link goes: `xref:deploy.adoc[Deploy a Zimlet]`, not "click here" or "this page". Do not use a bare URL as link text. Two links with the same text go to the same place.
- Do not use colour, position or shape words as the only instruction ("the green button", "the box on the right"). Name the control by its label.
- Write for plain reading: define abbreviations on first use, keep sentences short, and do not use all capitals for emphasis.
- Mark language and meaning with the right element: `NOTE`, `TIP`, `WARNING` and `CAUTION` admonitions carry their label as text, so they do not depend on colour. Do not simulate them with formatting.

**Tables and code**

- Every table has a header row (`options="header"`) and no merged or empty header cells. Use a table only for data with rows and columns, never for layout. Keep tables narrow enough to read on a small screen, with at most five columns where possible.
- Every code block sets its language (`[source,js]`). Do not show code or commands as an image. Do not rely on syntax colour to carry meaning.
- Write commands so a reader can copy them: no prompt characters (`$`) inside the block, and no line numbers.

**Images and diagrams**

- Every image and diagram has alt text that states what it shows and why it matters (see the diagram rules in section 5). Alt text is a plain sentence, not a file name and not "image of". Quote it in the macro, `image::name.svg["alt text, with commas"]`, because an unquoted comma splits the text into the width and height attributes. Check the generated `<img>` tag shows the whole text and no `width` or `height` you did not set.
- Alt text is not a substitute for the content. A reader who cannot see the figure must get the same facts from the text next to it, so write the steps or relations of a diagram as a sentence or list in the page. For a diagram with more than five nodes, add that text version directly after the figure.
- Text inside an image is at least 14 px at the size shown, and in the real UI screenshots no text is cropped. Do not put the only copy of a command, value or error message in an image.
- Colour contrast is at least 4.5:1 for text and 3:1 for lines, borders and icons, against their background. Use the default Mermaid theme or a theme that meets this, and check the rendered SVG, not only the source.
- A decorative image has empty alt text (`alt=""`); there should be no decorative images in this guide.
- Do not use animation, flashing or auto-playing media.

## 7. Verify as you write

Check each claim while you write, not after the page is done.

- Work section by section. When a section is drafted, audit its claims and fix the section before you start the next.
- A claim is anything a reader could act on or rely on: a command, option, path, file name, default, number, version, output, behaviour or example. Diagram labels, alt text and captions are claims too.
- Keep a ledger as you go: the claim, its kind, the evidence, and the status.
- Evidence is one of these: the code in the repositories as it is now (cite the file and the symbol), a command or example you ran with the `zimlet-doc-verify` skill (cite the command and its result), or something you observed. The files in `.agents/reference/`, your memory and earlier pages are not evidence. Use them to find what to check, then check it in the code.
- Pick the check by kind: read the code for a statement about behaviour; run an example or command with the skill (build, package, watch, lint rule, `register-calls`); for anything that needs a Zimbra server or a Modern UI session, you cannot run it, so follow the `Unverified` rules in section 2.
- Each claim ends with one status: `Verified (run)`, `Verified (code)`, `Contradicted` or `Cannot verify`. Use `Verified (code)` only for what the code does, and say which code path you followed from start to end; when the path leaves code you can read, or needs a running system, the status is `Cannot verify`. Fix a contradicted claim in the page before you go on, and note a contradiction with a reference file or the CLI's own message as a gap. Every `Cannot verify` claim gets its own `Unverified` admonition.
- Run each example with the skill before you include it, and use its real output where the page shows output.

## 8. Finishing a page

A page is finished when every claim in it has a status and none is `Contradicted`, every `Cannot verify` claim has its admonition, and the page meets the sections above. Give the ledger in your summary. A separate, independent review is available (see [review-doc.md](./review-doc.md)); it is run on request.
