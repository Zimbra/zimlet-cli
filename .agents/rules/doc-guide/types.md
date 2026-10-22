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
- Do not add examples to an inventory page, whether per entry, per group or per page. An example is a how-to: it belongs on the task or concept page that owns the topic, so link to that page instead. Do not add a payload table or a caveats block to every entry either. The exception is a slot or `invokePlugin` entry, which gets a registration example (see below).
- Group entries by area under headings. List each entry as a description list item: the name or signature as the term, then one or two sentences on when to use it. Give each entry an inline anchor before its term, `[[id]]`, where `id` is the first name in lowercase kebab case (`useClientConfig(paths)` gives `use-client-config`), so other pages can link to it with `xref:page.adoc#id[name]`. Keep each id unique on the page. Then add `pass:[<a class="anchor" href="#id"></a>]` before the term, so a § link shows in the left margin on hover, as on headings. Use a table only when entries share three or more attributes that the reader compares across rows. Link to the page that owns the how-to text.
- Still verify every entry against the code (section 7 of [claims.md](./claims.md)). Keep short entries accurate rather than detailed.
- Slot and `invokePlugin` keys are the exception, and each one gets a full entry: what it does in the UI or flow, where it is rendered (feature component and the component that renders it), how to see it in the running app (`?zimletSlots=show`), a payload table (prop, type, meaning; label inferred types as inferred), and a registration example. Follow [slots.md](./slots.md) for the research and evidence rules.

### Troubleshooting

Must contain:

- The symptom as the reader sees it (message or behaviour), the cause, and the fix.

### Deployment/server action pages/sections

Must contain:

- For a page or section that owns deployment instructions or server actions (the build, package and deploy pages), follow [packaging-deployment.md](../packaging-deployment.md).
- Any other page that needs a deployment or server action links to the owning page and does not restate its steps.
