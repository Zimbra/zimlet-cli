# ZimletSlot and data key documentation rules

This rule covers how to trace and document Zimlet extension points (`ZimletSlot` placements and data keys, which the host reads with direct `invokePlugin` callsites). For how they behave and what the catalog fields mean, read [slot-behavior.md](../../../../zm-x-web/.agents/zimlet/reference/slot-behavior.md).

## Documenting a slot

When documenting a slot, follow the payload through wrappers and callers, distinguish wrapper-only props from the actual plugin payload, and describe render-prop behavior from the code. Do not infer contribution element types beyond the manager and consumers' implementations.

## Placement references in the developer guide

- Do not document the complete nested component ancestry. Identify the first relevant feature or screen component and the component that directly renders `ZimletSlot`.
- For data key entries, identify the feature or screen component and the component or function that directly calls `invokePlugin`.
- Callsite file paths, 1-based line numbers, and enclosing owners are recorded in each record's `usages`.
- Do not add generic application-shell ancestors that do not contribute to the extension point.
- If source evidence cannot establish a location or caller, mark it as unresolved rather than guessing.

## Maintaining the catalog

The source scanner owns `kind`, `name`, and `usages` and rewrites them on every run. When researching an entry, update only `placementAreas` with evidence-based, concise UI or processing areas. Do not infer placement from a name alone. Do not store documentation prose or an AsciiDoc `anchor` in this index; a future documentation generator can derive a stable anchor from the exact `name`.

These usage details are scanner-derived clues, not a substitute for tracing code. They identify where to look and what is syntactically passed; they do not establish semantic meaning, types, UI purpose, or plugin behavior. Follow the source from each usage and record only conclusions supported by that evidence.

The scanner rewrites `kind`, `name`, and `usages`; preserve those fields when researching entries. Keep the catalog concise rather than adding documentation prose. The generated AsciiDoc guide can contain the fuller behavior, contract, and placement explanations.

## Producing documentation from the catalog

When producing documentation from the index, describe the shared plugin contract once per extension point. For slots, explain the meaning of each plugin prop and its evidence-based type. For direct invocations, explain ordered arguments and result handling. Do not enumerate or repeat every placement's runtime value. If a caller adds a prop/argument or the same prop is supplied with a materially different contract, note that difference concisely in the placement description.

Documentation for each extension point must explain:

- What the extension point does in its host UI or processing flow, including relevant availability conditions and meaningful rendering/result behavior.
- The meaning and type of each plugin-facing prop or argument, distinguishing inferred types from declared ones.
- Where it is rendered or processed: the feature/root component and direct parent of `ZimletSlot` or `invokePlugin` caller. Support this with source links.

Do not repeat generic manager or `ZimletSlot` behavior in every section. Summarize shared host behavior once in the document and refer to [slot-behavior.md](../../../../zm-x-web/.agents/zimlet/reference/slot-behavior.md) for implementation details. Never infer a contract from a name alone.

## Slot reference page format in the developer guide

### Category page

A slot category page (a page under `reference/slots/`) has this order: the introduction, the shared section `Before you register a handler` (see "Shared section" below), `Members`, `Learn from an example` and then one entry for each slot. A group page that has sub pages holds no entries. An extension point that belongs to the whole group, such as the `settings` key, has a sub page of its own.

- **A list of the sub pages**, on a group page that has sub pages (for example `Pages`, id `pages`): a description list with one term for each sub page, a link, and one or two sentences that name the slots of that page.
- **`Members`** (id `members`): a description list of the slots on the page, each term a link to its entry. A page with one entry has no `Members` list.
- **`Learn from an example`** (id `learn-from-an-example`, role `examples`, written `[#learn-from-an-example.examples]`): an opening sentence that says each entry is an example that fills slots of the category and serves as a model for the other slots, and then a description list of the examples that use the slots of the page. The role makes the site show the section as a tinted panel, so that it reads as a pointer and not as a slot entry. It is not an admonition. A page with no `Members` list puts it directly after the introduction. An entry is one of two kinds, and its description says which in its first words ("A recipe that …" or "A basic example that …"). A recipe: the term is the link to the recipe (`xref:build-by-goal/<recipe>.adoc[<recipe title>]`). A basic example: the term is the link to the section of a guide page that registers the slot in a working example (`xref:<page>.adoc#<section id>[<section title> in <page title>]`). List a basic example only for a slot that no recipe uses, and give one for the page, from the page that teaches how to register a handler, and not one for every page that registers the slot. The description has three parts, in this order: what the example builds, with the slots of the page that it fills, as links; what the reader learns, taken from its `What you will learn` section or from the text of the section; and how that carries over to the other slots of the page, in one sentence. Use a generic phrase for the carry over, such as "Every other slot in this category that adds an item is registered the same way", when it is true of every slot of that kind on the page, and name only the exceptions. Name a slot only when one slot qualifies. Say a slot takes the same steps only when its entry shows the same handler shape or props. Leave the sentence out when no other slot of the page does. List only an example that exists and uses the slot, and not a page that only mentions it. Leave the section out when no example uses a slot of the page. Do not name examples in the introduction.

### Where a slot is documented

Decide the page of a slot from the screens that render it, not from its name or from the folder of the host file. Before you write an entry, find every component that imports and renders the component that holds the `ZimletSlot`, and record where else the slot shows.

- **One vertical.** The slot goes on the page of that vertical.
- **Several verticals, one shared component.** The slot goes to one shared home. Use an App shell page named for the component when the component is part of the frame of several verticals (the folder list), and a page of its own when the slots form a feature that spans verticals (the composer and editor).
- **A slot that stays on one vertical's page** although another screen also renders it (for example `print-link` in the Calendar toolbar, or `attachment-viewer` in Briefcase) names the other places in its `Usage notes`. The page of the other vertical links to the entry and does not repeat it.

### Shared section

A category page that has lookup facts shared by several of its slots has one section for them, `Before you register a handler` (id `before-you-register-a-handler`), between the introduction and `Members`. Every page uses this one name and no other shared section. Each fact is a `===` subsection of it, named for what it holds, with an id of its own. Entries link to a subsection and do not repeat it. The section is never a concept explanation. A concept goes to its concept page or the glossary and is linked, not restated. Leave the section out when the page has nothing to share.

A subsection is one of these kinds, in this order when a page has more than one:

- **Layout map.** The ordered groups of a menu, toolbar or screen, and the slot at each position. Name the subsection as the interface names the menu or screen (`Account menu`). Write the map as an ordered list, from top to bottom, of the built-in entries and the slots. Name a built-in entry that shows only under a condition, with the condition in a few words. State nothing else about the entry.
- **Name list.** The values that a slot name or a handler argument takes, such as the vertical names. Name the subsection for what it lists (`Vertical names`, id `vertical-names`), and write the values as a list or a table. Say in one sentence where the values come from and whether a deployment can change them, and link the concept in the glossary. Do not define the concept.
- **Shared behaviour.** A rule that holds for several slots of the page, such as that a slot hides a control and draws nothing (`Slots that hide a control`), or how the keys work (`Registration`). State it once, with the one `WARNING` if the rule needs it.

Keep the whole section to what the reader needs to look up, about one screen. Do not repeat a fact that a `Usage notes` bullet owns. The introduction of the page may say in one sentence how a menu or screen opens.

### Slot entry

Every slot entry uses the same sections, in this order. The entry is a `==` section whose id is the slot name in lowercase kebab case (`header-menu-item`; `vertical-tab-item` for `<vertical>-tab-item`). The sections below it are `===` headings with ids `<slot id>-register-a-handler`, `<slot id>-props` and `<slot id>-usage-notes`. There is no `Returns`, `Expected result` or `Signature` section, and no label such as `Handler kind`.

1. **Introduction** (the text under the `==` heading). One to three sentences: what the slot changes in the UI and where it appears, and when to choose it. Name an alternative slot, with a link, when the reader might need it. Put the one `WARNING`, if the slot needs one, after it. Do not put availability conditions or limits here.
2. **`Register a handler`**. A `js` code block with `plugins.register('slot::<name>', handler)`, an empty line and a comment that types the handler: `// handler: (props) => element | null`. Write the props in the parameter and the type that the handler returns after `=>`. A sentence after the block names what to return only when the slot has a specific recommendation, such as an `ActionMenuItem`. Do not describe again what the slot does with the result.
3. **`Props`**. A description list, one entry for each prop with its type, or `None.` when the slot passes nothing.
4. **`Usage notes`**, a bullet list, in this order, leaving out a bullet that has no answer:
   - Who sees it and when it shows: the window width, the account feature, the screen that must be open.
   - Limits and non-obvious behaviour of what the handler returns, such as that `null` keeps the standard item, that only the first result is used or that a function is rendered as a component. Behaviour that every slot shares, such as that the slot renders the results of all handlers in registration order, is on the slots page (P09) and is not repeated here.
   - The last bullet, when a recipe uses the slot: `For a complete example, see xref:build-by-goal/<recipe>.adoc[<recipe title>].` The same recipe is in the `Learn from an example` section of the page. A slot that no recipe uses has no such bullet.
   - The last bullet, when no recipe uses the slot but a page of the guide registers it in a working example: `For a basic example, see xref:<page>.adoc#<section id>[<section title> in <page title>].` Use it only for a slot that such an example registers, and never together with the recipe bullet. The same example is in the `Learn from an example` section of the page.
   Leave the whole section out when there is nothing to say and no example is linked.

### Data key entry

A data key (a registration key without `slot::`, such as `messageProcessors:emailProcessor`) follows the slot entry format with these changes, and is documented on the page of its use case, not on a page of data keys:

- The `==` heading is the key as written. The id is the part after the prefix in lowercase kebab case (`email-processor`).
- `Register a handler` uses the key: `plugins.register('messageProcessors:emailProcessor', handler)`. The typed comment shows the arguments that the host passes and what the handler returns, for example `// handler: () => (doc: Document) => void`. The sentence after the block says what the host does with the result.
- `Arguments` (id `<id>-arguments`) replaces `Props`: the ordered arguments that the host passes, each with its type, or `None.` when it passes none.
- `Usage notes` says when the host calls the handler, which results it uses (all of them, or only the first) and what happens to the result. It does not repeat rules that another entry of the page owns, and links to that entry instead.
- A key whose registered value is an object and not a function (`settings`) lists the keys of that object, the keys of its parts and the props of its component in sections of their own, with a description list, instead of `Arguments`.
- A section `Registration` after the introduction of the page says once that the key has no `slot::` prefix and why the host does not draw the result.

Placement: when the introduction cannot say where a slot appears, write "Details pending" in its place, as the plan requires, and do not guess (see "Placement references" above).

## Data keys

- A direct call such as `zimlets.invokePlugin('messageProcessors:emailProcessor', arg)` is a data key, identified by its exact first argument. A data key has no `slot::` prefix, and the host uses the results as data and does not draw them. Document it in a separate section from any `ZimletSlot` entry.
- Search source callsites for `invokePlugin` outside `src/components/zimlet-slot.js`. Do not document the manager's `invokePlugin` method definition as a data key, and do not duplicate the generic `slot::` invocation implemented in `ZimletSlot`; its named slots are documented through their `ZimletSlot` placements.
- Resolve a call's name only when its first argument is a literal or can be established from local code. Record the remaining arguments in order, their actual value flow, and how the caller consumes the result array.
- Distinguish multiple callsites for the same invocation name when their arguments or result handling differ. Use one section for the shared invocation name and summarize placement differences within it.
- Record only evidence-supported argument and result meanings. If handler output shape is not statically declared or cannot be established from consumers, label it inferred or unknown.

## Related

- Behavior and catalog field reference: [slot-behavior.md](../../../../zm-x-web/.agents/zimlet/reference/slot-behavior.md).
- Template-literal slot names derived from configured vertical slugs: [verticals.md](../../../../zm-x-web/.agents/zimlet/reference/verticals.md) and the scan's `unresolved` report.
- Entry point for developer guidance: the root [AGENTS.md](../../../AGENTS.md#topic-to-file-map).
