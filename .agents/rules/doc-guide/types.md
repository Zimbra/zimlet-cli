# Rules for page types in the Zimlet documentation

Section 3 of the writing rules in [write-doc.md](../write-doc.md). Read it in full together with that file. The section numbers are the same as in `write-doc.md`.

## 3. Page types and what each must contain

Every page has one of the four types below. Each type has its own subsection with what it must contain. The Build by goal recipe subsection adds rules for a kind of task page, and the Deployment subsection at the end applies to specific kinds of page.

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

### Build by goal recipe (a page under `build-by-goal/`)

A recipe is a task page. The structure below applies to its "Choose the slot" section, the section after "Before you start" and before "Set up the project". Every recipe that fills a slot uses the same headings, ids and order, so that the reader finds the same thing in the same place. The rules for its example are in [examples.md](./examples.md).

- **Title and id.** `== Choose the slot` with the id `choose-the-slot`. A recipe that picks a registration key that is not a slot says what it picks in its title (`Choose the key`, id `choose-the-key`) and keeps the other headings below with that noun.
- **Opening.** One or two sentences, with no list: what the use case needs from the slot, and which slot the example therefore uses. A recipe whose choice is a comparison of three or more slots by the same attributes shows it as a table directly after the opening (the table rule of [accessibility.md](./accessibility.md)).
- **`=== The slot`** (id `the-slot`; `=== The slots` when the example uses more than one). One description-list entry for each slot the example uses, `slot::<name>`. Each entry says where the slot appears, who sees it, and any condition that decides whether it shows. It ends with a link to the slot index. Do not explain props here. Explain them in the section where the example reads them, which says that a slot passes none when that is so. Keep limits that the reader can hit only once they run the example in the "Know the limits" section.
- **`=== Other slots`** (id `other-slots`). One entry for each slot a reader might choose instead. Say where it appears and when to choose it, in one or two sentences, and link to the recipe that owns the topic instead of explaining it. Leave the subsection out when there is no alternative.
- **Wording.** Do not label a subsection by its role in the page ("Slot the example uses"). Name what the reader finds in it. Use the same word for the same thing on every recipe: "slot" for a slot name, "prop" for a value the slot passes.

### Reference (commands, slots, APIs, options, extension points)

Must contain:

- **Every API, property, option, command, hook, component and constant of the reference follows the member template** (see "Member template" below) and is covered completely, with the name, its signature or usage, and when and why to use it. Say what the reader gains, not how the host implements it. Facts only; no tutorial text. File references (the `package.json`, descriptor, `config_template.xml`, `zimlet.config.js` and `en_US.json` pages) are the exception: they keep one entry for each element, attribute or key on the page of the file, each with the name, its meaning and its default or allowed values, and without a page or the member template for each entry.
- If needed explain internals in short. A reader of a reference wants to know what exists and when to use it.
- Add one example to a group page (including the members it documents itself), a landing page or a file reference page. A member's `Example` section is optional (see "Member template" below), and a slot or `invokePlugin` entry gets a registration example. Do not add a payload table or a caveats block to every entry of a group page or file reference page.
- A file reference page, list each entry as a description list item: the name or signature as the term (on a group page, a link to the member page), then one or two sentences on when to use it.
- For group page and file reference page, give each entry an inline anchor before its term, `[[id]]`, where `id` is the first name in lowercase kebab case (`useClientConfig(paths)` gives `use-client-config`), so other pages can link to it with `xref:page.adoc#id[name]`. Keep each id unique on the page. Then add `pass:[<a class="anchor" href="#id"></a>]` before the term, so a § link shows in the left margin on hover, as on headings. Use a table only when entries share three or more attributes that the reader compares across rows. Link to the page that owns the how-to text.
- Still verify every entry against the code (section 7 of [claims.md](./claims.md)). Keep short entries accurate rather than detailed.
- The `context` reference pages (`reference-context*.adoc`) were the first to follow the member template. Every other reference page follows it too, except the file references. Each field, and each member of a field that is an object, gets the full template: its type, its arguments with their types, its return value, its limits and, when it has one, an example. Verify each page in the code.
- **Navigation names in the reference.** Every page under the reference group, at every level, is named in the navigation and in its `=` title with a short custom name in sentence case that starts with a capital letter and says what the item is for (`Plugins`, `Batch client`, `Zimlet manager`, `Utilities`). Do not use the code identifier (`zimbraBatchClient`) for a group or a field page, a prefix such as `context.`, or a different style for some pages. A page that documents one API member is named with the member name as the code writes it (`register`), because it sits under its group page (Context > Plugins > register). The identifier appears in the opening sentence and in the entries. A child page does not repeat the name of its parent.
- **Introduction of a reference page.** The opening paragraph of a member page or a group page says what the item is, why a Zimlet author would use it, and when to reach for it, in one short paragraph, or two for a group page. There is no sentence limit, but do not repeat what the sections below say, and do not pad. Start with what it is, then add `Use it when …` with a concrete situation of a Zimlet, and name the neighbouring member to use instead when the choice is not obvious (for example `invokePlugin` when the sender needs answers and an event gives none). Say what the reader gains, not how the host implements it, and do not repeat the Parameters or Usage notes. Check each claim in the introduction against the code, as for every other entry. A group page names what the group is for in the same way, before its description list of members.
- **Warnings and misuse of an API.** A reader of a reference looks up one member and can miss how it breaks when it is used in the wrong place. Decide this for every member, from the code and the way active Zimlets use it (section 7 of [claims.md](./claims.md)). Ask where the member must not be used, and what goes wrong. Examples are a store method called while a component renders (stale data, or a listener added on every render), a member that works only before a Zimlet has loaded, and a call that also affects other Zimlets.
  - **Always show a warning in the introduction.** Put every `WARNING` of a reference page directly after the opening paragraph, before `Signature`, so the reader sees it first. Never put a warning in `Usage notes`, in a table or after the example.
  - **Use `WARNING` when the misuse causes a defect** (wrong data, a leak, a call that affects other Zimlets, a failure at run time). Use `NOTE` in the same place when nothing breaks and the page only recommends a better choice, such as a hook for the same job inside a component.
  - **Write three things:** the situation to avoid, what goes wrong in it, and what to use instead. Name the alternative and link it: a page of the guide with `xref:`, or the official documentation of an external library with a link that opens in a new tab. Say where the member is the right choice.
  - **One admonition in the introduction.** Keep to the rule of section 9 of [style.md](./style.md). If a member has more than one risk, put the one most likely to be hit in the admonition and the others in `Usage notes`, as plain items.
  - **Only what you checked.** A warning is a claim: verify it as any other (section 7 of [claims.md](./claims.md)). Do not warn about something you did not confirm in the code or by running it. Record in `zimlet-known-issues.md` a defect of the host that causes the misuse.
- **Member template.** Every member follows the same template: a method, property, event, option, command, hook, component, constant or utility, in the context reference and in every other reference page (CLI, APIs and hooks, Blocks UI kit, the shared components and the rest), except the file references.
  - **Sections, in this order:** introduction (see the two points above, with its warning if the member needs one), `Signature` (a code block), `Parameters`, `Returns`, `Usage notes` (a list of limits, rules and behaviour), `Example` (optional) and `Next step`.
  - **`Parameters`:** a table with the columns Name, Type and Description, or `None.`. For a function that takes an options object, list the options as rows of this table or in a second `Options` table with the same columns, and give the default of each.
  - **`Returns`:** type and meaning, or `Nothing (`undefined`).`
  - **Changes for other member types:**
    - Property or constant: `Type` (with its value or shape) instead of `Parameters` and `Returns`.
    - Event: `Parameters` (the handler) and `Event data` instead of `Returns`.
    - Component: `Props` (Name, Type and Description) instead of `Parameters`; `Returns` says what it renders.
    - Hook: `Parameters` and `Returns` (the shape of the result).
    - CLI command: `Signature` is the usage line; `Arguments` and `Options` tables (Name, Type or value, Default and Description) instead of `Parameters`; `Output` (what it prints or writes, and its exit code) instead of `Returns`.
  - **`Example` (optional):** when a member has one, it is one working example that follows [examples.md](./examples.md): a complete file under `examples/<topic>/`, included whole, linted, and for a context or host API run or built with the [zimlet-doc-verify](../../skills/zimlet-doc-verify/SKILL.md) skill. It shows a real use case of the member, not only its call. Leave it out when the member has no use case worth showing; do not invent one.
  - **Where the member is documented.** Before writing a reference page, ask the user whether each member gets its own page or the members share a page, unless the user or [the plan](../../plans/zimlet-documentation-plan.md) already says. The template is the same either way. Do not shorten a member to a one-line description because it shares a page.
    - **Own page:** the group page lists its members as a description list of links and names what the group is for. Page ids nest (`P43.1` is the group, `P43.1.1` and `P43.1.2` are its members, and `P43.4.1.1` a nested group's member), and the files are nested as the page ids are (see section 1 of `write-doc.md`). If the plan has no page for a member, add it to the plan first, with the next free id under its group, and then write it.
    - **Shared page** (the user asked for no separate pages, or a group page gathers members that have almost nothing to say, such as the values page of the context reference): each member is a subsection or entry with the full template, without `Next step`, and without `Example` unless the user asks for one. Give each subsection an inline anchor `[[id]]` as in the description list of a group page. The CLI reference (`reference/cli.adoc`) is a shared page of this kind: one section for each command (`create`, `watch`, `build`, `package`) with the CLI template (`Signature`, `Arguments`, `Options`, `Output`, `Usage notes`), and its `Example` is optional for each command, a command line verified with the [zimlet-doc-verify](../../skills/zimlet-doc-verify/SKILL.md) skill.
    - A group page that only lists members, and gives them their own pages, never has an `Example`. A group page that documents its members itself (shared page) follows the shared page rule above.
  - Pages written before this rule keep their current form until the user asks to bring them up to date.
- **Coverage check for the reference.** Before you finish a context or reference page, compare its entries with the existing active Zimlets in both directions. Every member that an active Zimlet uses has an entry. Every entry for a member that no active Zimlet uses is checked against the Deprecated rule below. Do not decide from memory that a member is "not for Zimlets"; count it.
- **Deprecated page in the reference.** A field goes on the Deprecated page only when no active Zimlet uses the field or any of its members and an alternative exists, when the host reference or the code marks the field deprecated, or when the field does not do what its name suggests (for example, it is not specific to the Zimlet). Archived Zimlets and the default template do not count. Judge the main property by its overall use: list one entry for the main property, say what to use instead, and do not list its members as separate entries. A member that no Zimlet uses stays on the page of its main property when other members of that property are in use. If no alternative exists, the entry says so.

### Troubleshooting

Must contain:

- The symptom as the reader sees it (message or behaviour), the cause, and the fix.

### Deployment/server action pages/sections

Must contain:

- For a page or section that owns deployment instructions or server actions (the build, package and deploy pages), follow [packaging-deployment.md](../packaging-deployment.md).
- Any other page that needs a deployment or server action links to the owning page and does not restate its steps.
