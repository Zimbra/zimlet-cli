# Rules for page types in the Zimlet documentation

Section 3 of the writing rules in [write-doc.md](../write-doc.md). Read it in full together with that file. The section numbers are the same as in `write-doc.md`.

## 3. Page types and what each must contain

Every page has one of the four types below. Each type has its own subsection with what it must contain. The Deployment subsection at the end applies to specific kinds of page.

### Concept (how something works)

Must contain:

- A plain-language explanation limited to what the reader needs for the next task: a page in Getting started gives the short mental model, and mechanisms that matter only when debugging or going deeper go to the page where the reader needs them.
- Why it matters to a Zimlet author.
- A diagram when the topic involves flow, parts or lifecycle (section 5).
- A link to the task that uses it.

No step lists.

### Task (how to do something)

Must contain, in this order: **Goal → Before you start → Numbered steps with exact commands → Expected result → If it didn't work → Next step.**

- One working example (section 4) when the task writes code.
- For packaging or deployment tasks, exact commands and expected output or result from [packaging-deployment.md](../packaging-deployment.md), the target `--zimbraXVersion` range, and how to find the host version.

### Reference (commands, slots, APIs, options, extension points)

Must contain:

- One entry per item, covering every item, each kept short: the name, its signature or usage, and one or two sentences on when and why to use it. Say what the reader gains, not how the host implements it. For a command, the signature shows its arguments and options; defaults and effects go in those sentences. Facts only; no tutorial text.
- Do not explain internals. A reader of a reference wants to know what exists and when to use it.
- Do not add examples to an inventory page, whether per entry, per group or per page. An example is a how-to: it belongs on the task or concept page that owns the topic, so link to that page instead. Do not add a payload table or a caveats block to every entry either. The exceptions are a slot or `invokePlugin` entry, which gets a registration example, and a `context` field entry, which gets the full entry described below (without an example).
- Group entries by area under headings. List each entry as a description list item: the name or signature as the term, then one or two sentences on when to use it. Give each entry an inline anchor before its term, `[[id]]`, where `id` is the first name in lowercase kebab case (`useClientConfig(paths)` gives `use-client-config`), so other pages can link to it with `xref:page.adoc#id[name]`. Keep each id unique on the page. Then add `pass:[<a class="anchor" href="#id"></a>]` before the term, so a § link shows in the left margin on hover, as on headings. Use a table only when entries share three or more attributes that the reader compares across rows. Link to the page that owns the how-to text.
- Still verify every entry against the code (section 7 of [claims.md](./claims.md)). Keep short entries accurate rather than detailed.
- Slot and `invokePlugin` keys are the exception, and each one gets a full entry: what it does in the UI or flow, where it is rendered (feature component and the component that renders it), how to see it in the running app (`?zimletSlots=show`), a payload table (prop, type, meaning; label inferred types as inferred), and a registration example. Follow [slots.md](./slots.md) for the research and evidence rules.
- The `context` fields of the context reference pages (`reference-context*.adoc`) are the second exception. Each field, and each member of a field that is an object, gets a full entry: its type, its arguments with their types, its return value, and the limits that apply. Do not add an example to these entries or pages; whether to keep one for each API member is decided later. Verify each entry in the code.
- **Navigation names in the API reference.** Every page under the API reference group, at every level, is named in the navigation and in its `=` title with a short custom name in sentence case that starts with a capital letter and says what the item is for (`Plugins`, `Batch client`, `Zimlet manager`, `Utilities`). Do not use the code identifier (`zimbraBatchClient`) for a group or a field page, a prefix such as `context.`, or a different style for some pages. A page that documents one API member is named with the member name as the code writes it (`register`), because it sits under its group page (Context > Plugins > register). The identifier appears in the opening sentence and in the entries. A child page does not repeat the name of its parent.
- **Introduction of an API reference page.** The opening paragraph of a member page or a group page says what the item is, why a Zimlet author would use it, and when to reach for it, in one short paragraph, or two for a group page. There is no sentence limit, but do not repeat what the sections below say, and do not pad. Start with what it is, then add `Use it when …` with a concrete situation of a Zimlet, and name the neighbouring member to use instead when the choice is not obvious (for example `invokePlugin` when the sender needs answers and an event gives none). Say what the reader gains, not how the host implements it, and do not repeat the Parameters or Usage notes. Check each claim in the introduction against the code, as for every other entry. A group page names what the group is for in the same way, before its description list of members.
- **One page for each API member in the API reference.** A page for a method, property or event has these sections in this order: an introduction (see the point above), `Signature` (a code block), `Parameters` (a table with the columns Name, Type and Description, or `None.`), `Returns` (type and meaning, or `Nothing (`undefined`).`), `Usage notes` (a list of limits and behaviour), and `Next step`. Do not add an `Example` section, and do not link or include an example file. Example files that already exist stay in `examples/` unlinked. A property page has `Type` instead of `Parameters` and `Returns`. An event page has `Parameters` (the handler) and `Event data` instead of `Returns`. The group page lists its members as a description list of links. A group page for a nested group follows the same rule, so the nesting can go deeper (`P43.4.1.1`). The files are nested as the page ids are (see section 1 of `write-doc.md`). Page ids nest: the group is `P43.1` and its members are `P43.1.1`, `P43.1.2`, and so on.
- **Coverage check for the API reference.** Before you finish a context or API reference page, compare its entries with the existing active Zimlets in both directions. Every member that an active Zimlet uses has an entry. Every entry for a member that no active Zimlet uses is checked against the Deprecated rule below. Do not decide from memory that a member is "not for Zimlets"; count it.
- **Deprecated page in the API reference.** A field goes on the Deprecated page only when no active Zimlet uses the field or any of its members and an alternative exists, when the host reference or the code marks the field deprecated, or when the field does not do what its name suggests (for example, it is not specific to the Zimlet). Archived Zimlets and the default template do not count. Judge the main property by its overall use: list one entry for the main property, say what to use instead, and do not list its members as separate entries. A member that no Zimlet uses stays on the page of its main property when other members of that property are in use. If no alternative exists, the entry says so.

### Troubleshooting

Must contain:

- The symptom as the reader sees it (message or behaviour), the cause, and the fix.

### Deployment/server action pages/sections

Must contain:

- For a page or section that owns deployment instructions or server actions (the build, package and deploy pages), follow [packaging-deployment.md](../packaging-deployment.md).
- Any other page that needs a deployment or server action links to the owning page and does not restate its steps.
