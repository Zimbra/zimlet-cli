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

The source scanner `find-slots.sh` in `zm-x-web` owns every field of the catalog (`kind`, `name`, `doc` and `usages`) and rewrites them on every run. Do not edit the catalog by hand. The `doc` field holds the page and anchor of the entry in the guide, which the scanner reads from the slot pages in this repository, so after you add, rename, move or remove an entry on a slot page, run the scanner from the `zm-x-web` root and commit the catalog there. A name without `doc` is not documented yet. Do not store documentation prose in the catalog.

These usage details are scanner-derived clues, not a substitute for tracing code. They identify where to look and what is syntactically passed; they do not establish semantic meaning, types, UI purpose, or plugin behavior. Follow the source from each usage and record only conclusions supported by that evidence.

Keep the catalog concise. The generated AsciiDoc guide contains the fuller behavior, contract, and placement explanations.

## Producing documentation from the catalog

When producing documentation from the index, describe the shared plugin contract once per extension point. For slots, explain the meaning of each plugin prop and its evidence-based type. For direct invocations, explain ordered arguments and result handling. Do not enumerate or repeat every placement's runtime value. If a caller adds a prop/argument or the same prop is supplied with a materially different contract, note that difference concisely in the placement description.

Documentation for each extension point must explain:

- What the extension point does in its host UI or processing flow, including relevant availability conditions and meaningful rendering/result behavior.
- The meaning and type of each plugin-facing prop or argument, distinguishing inferred types from declared ones.
- Where it is rendered or processed: the feature/root component and direct parent of `ZimletSlot` or `invokePlugin` caller. Support this with source links.

Do not repeat generic manager or `ZimletSlot` behavior in every section. Summarize shared host behavior once in the document and refer to [slot-behavior.md](../../../../zm-x-web/.agents/zimlet/reference/slot-behavior.md) for implementation details. Never infer a contract from a name alone.

## Keeping the all-slots page current

`reference/slots/all-slots.adoc` is generated. Do not edit it by hand. Run `node .agents/scripts/generate-all-slots.mjs` from the repository root after any of these changes, and commit the regenerated page with them:

- The catalog `zimlet-slots.yml` in `zm-x-web` adds, renames or removes a name.
- A slot page under `reference/slots/` adds, renames or removes an entry heading, or a slot term of the `Hide built-in UI` page, or moves an entry to another page. Run `find-slots.sh` in `zm-x-web` first, so that the `doc` fields of the catalog follow the pages.

The script reads the catalog, and writes one entry for each catalog name with its link (the `doc` field), its kind (slot or data key), its place in the guide, and the shared pattern entry for the per-vertical names. It needs `zm-x-web` checked out next to this repository, and it writes nothing there.

Run it with `--check` to see whether the page is current without writing it. It exits with 1 when the page is out of date. When it fails with `No doc for`, a catalog name has no entry in any slot page: document the name, or fix its heading or anchor on the slot page, and run `find-slots.sh` again. When it fails with `points to a page or anchor that does not exist`, the catalog is behind the pages: run `find-slots.sh` again. Do not change the script to skip the name. When it fails with `Two names give the anchor`, rename one of the entries.

## Slot reference page format in the developer guide

### Category page

A slot category page (a page under `reference/slots/`) has this order: the introduction, the shared section `Before you register a handler` (see "Shared section" below), `Members`, `Learn from an example` and then one entry for each slot. A group page that has sub pages holds no entries. An extension point that belongs to the whole group, such as the `settings` key, has a sub page of its own.

- **A list of the sub pages**, on a group page that has sub pages (for example `Pages`, id `pages`): a description list with one term for each sub page, a link, and one or two sentences that name the slots of that page.
- **`Members`** (id `members`): a description list of the slots on the page, each term a link to its entry. A page with one entry has no `Members` list.
- **`Learn from an example`** (id `learn-from-an-example`, role `examples`, written `[#learn-from-an-example.examples]`): an opening sentence that says each entry is an example that fills slots of the category and serves as a model for the other slots, and then a description list of the examples that use the slots of the page. The role makes the site show the section as a tinted panel, so that it reads as a pointer and not as a slot entry. It is not an admonition. A page with no `Members` list puts it directly after the introduction. An entry is a recipe, and its description says so in its first words ("A recipe that …"). The term is the link to the recipe (`xref:build-by-goal/<recipe>.adoc[<recipe title>]`). Do not list a basic example, that is a section of a guide page that registers a slot, because a basic example is not a recipe. The description has three parts, in this order: what the example builds, with the slots of the page that it fills, as links; what the reader learns, taken from its `What you will learn` section or from the text of the section; and how that carries over to the other slots of the page, in one sentence. Use a generic phrase for the carry over, such as "Every other slot in this category that adds an item is registered the same way", when it is true of every slot of that kind on the page, and name only the exceptions. Name a slot only when one slot qualifies. Say a slot takes the same steps only when its entry shows the same handler shape or props. Leave the sentence out when no other slot of the page does. List only a recipe that exists and uses the slot, and not a page that only mentions it. Every category page has at least one recipe, so the section is never empty. Do not name examples in the introduction.

### Where a slot is documented

Decide the page of a slot from the screens that render it, not from its name or from the folder of the host file. Before you write an entry, find every component that imports and renders the component that holds the `ZimletSlot`, and record where else the slot shows.

- **One vertical.** The slot goes on the page of that vertical.
- **Several verticals, one shared component.** The slot goes to one shared home. Use an App shell page named for the component when the component is part of the frame of several verticals (the folder list), and a page of its own when the slots form a feature that spans verticals (the composer and editor).
- **A slot that stays on one vertical's page** although another screen also renders it (for example `print-link` in the Calendar toolbar, or `attachment-viewer` in Briefcase) names the other places in its `Usage notes`. The page of the other vertical links to the entry and does not repeat it.

### Slots documented by behaviour

The default is the screen. A group of slots goes to a page of its own, by behaviour, only when all of these are true:

- The slot draws nothing of its own, or the host uses its result as data.
- The slots share one contract that does not depend on the screen, so that one explanation covers them all.
- A reader looks for them by task ("remove this", "change this content") and not by screen.

A slot that also renders handler content, or that has props or its own contract, stays on the page of its screen. There are two behaviour pages:

- **Hide built-in UI** (`reference/slots/hide-built-in-ui.adoc`): the slots that the host renders through `RemovableSectionZimlet` and that only hide a built-in part. The scanner marks them `wrapper: RemovableSectionZimlet`.
- **Content processors** (`reference/slots/content-processors.adoc`): the data keys that change or supply content (see "Data key entry").

Write a behaviour page like this, and do not repeat on it what the shared section already says:

- A shared section `Before you register a handler` with one subsection that holds the registration code block once, the props (none), the value that the handler returns, and the one `WARNING`. A slot entry does not repeat the code block, `Props` or the warning.
- Group the slots under `==` headings by the part of the UI they hide (a menu, a dialog, a screen). Do not use a `Members` list: the groups are the list.
- Give each slot one description-list term with an inline anchor, `[[id]]` and the margin link as in the group page rule, so that `xref:...#id[...]` works. The description says what the slot hides and where, in one or two sentences. Add bullets (`+` continuation) only for a fact that is unique to the slot, such as a condition that decides whether the part shows. A fact that several slots share goes once in the introduction of its group.
- On the page of the screen, name the slot where the reader meets the part (in a layout map, a list of the parts of a menu, or the introduction) and link to its term on the behaviour page. Do not add an entry, a `Members` item or the shared warning on the page of the screen.
- List every slot of the page in `all-slots.adoc` with the page `Hide built-in UI`.

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
   Leave the whole section out when there is nothing to say and no recipe is linked.

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
