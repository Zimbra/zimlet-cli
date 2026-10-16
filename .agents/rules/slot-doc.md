# ZimletSlot and `invokePlugin` documentation rules

This rule covers how to trace and document Zimlet extension points (`ZimletSlot` placements and direct `invokePlugin` callsites). For how they behave and what the catalog fields mean, read [slot-behavior.md](../../../zm-x-web/.agents/zimlet/reference/slot-behavior.md).

## Documenting a slot

When documenting a slot, follow the payload through wrappers and callers, distinguish wrapper-only props from the actual plugin payload, and describe render-prop behavior from the code. Do not infer contribution element types beyond the manager and consumers' implementations.

## Placement references in the developer guide

- Do not document the complete nested component ancestry. Identify the first relevant feature or screen component and the component that directly renders `ZimletSlot`.
- For direct `invokePlugin` entries, identify the feature or screen component and the component or function that directly calls `invokePlugin`.
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

Do not repeat generic manager or `ZimletSlot` behavior in every section. Summarize shared host behavior once in the document and refer to [slot-behavior.md](../../../zm-x-web/.agents/zimlet/reference/slot-behavior.md) for implementation details. Never infer a contract from a name alone.

## Direct `invokePlugin` extension points

- A direct call such as `zimlets.invokePlugin('messageProcessors:emailProcessor', arg)` is an extension point keyed by its exact first argument. Document it in a separate section from any `ZimletSlot` entry.
- Search source callsites for `invokePlugin` outside `src/components/zimlet-slot.js`. Do not document the manager's `invokePlugin` method definition as an extension point, and do not duplicate the generic `slot::` invocation implemented in `ZimletSlot`; its named slots are documented through their `ZimletSlot` placements.
- Resolve a call's name only when its first argument is a literal or can be established from local code. Record the remaining arguments in order, their actual value flow, and how the caller consumes the result array.
- Distinguish multiple callsites for the same invocation name when their arguments or result handling differ. Use one section for the shared invocation name and summarize placement differences within it.
- Record only evidence-supported argument and result meanings. If handler output shape is not statically declared or cannot be established from consumers, label it inferred or unknown.

## Related

- Behavior and catalog field reference: [slot-behavior.md](../../../zm-x-web/.agents/zimlet/reference/slot-behavior.md).
- Template-literal slot names derived from configured vertical slugs: [verticals.md](../../../zm-x-web/.agents/zimlet/reference/verticals.md) and the scan's `unresolved` report.
- Entry point for developer guidance: the root [AGENTS.md](../../AGENTS.md#topic-to-file-map).
