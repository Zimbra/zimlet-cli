# Rules for examples in the Zimlet documentation

Section 4 of the writing rules in [write-doc.md](../write-doc.md). Read it in full together with that file.

## 4. Examples

- Give a working example for every topic that tells the reader to write code or configuration, and for every slot or extension point page. Registering a slot always needs one.
- When writing a complete, runnable Zimlet example, use the [Zimlet creation workflow](../../workflow/create-zimlet.md).
- Examples must follow [authoring.md](../authoring.md): `createElement` imported from `preact` in JSX files, only shimmed imports, plugins registered inside `init()`, and `en_US.json` structure for strings. Also follow the coding style of the default template: tab indentation (the `indent_style = tab` rule of the `.editorconfig` in `zm-modern-zimlets` and in this repository), single quotes, a line width of 100 (its ESLint/Prettier configuration), and `createElement` as the JSX pragma. Prettier takes the tab setting from `.editorconfig`, so a file that is linted without an `.editorconfig` next to it or above it reports tabs as errors; this is not a defect of the example. Packaging and `config_template.xml` examples must follow [packaging-deployment.md](../packaging-deployment.md).
- Examples are complete and copy-pasteable, with imports and the default export. If a snippet could not be run, record it in [open claims](../../plans/zimlet-documentation-claims.md) as described in section 2.
- Lint every example file before you add it under `modules/ROOT/examples/`. Run the Lint steps of the [zimlet-doc-verify](../../skills/zimlet-doc-verify/SKILL.md) skill on it, against the `zm-modern-zimlets` ESLint config. Fix every problem it reports, either by hand or with ESLint `--fix` on a scratch copy that you then copy back, and lint again until ESLint exits 0 with no problems. Add the file to the page only after it passes. A folder example is linted the same way, as a whole. If a problem cannot be fixed, do not add the example; tell the user why.
- Keep every JS, JSX, JSON, XML and Less example longer than two lines in its own file under `modules/ROOT/examples/<topic>/` and include the whole file: `[source,<language>]` followed by `include::example$<topic>/<path>[]`. Do not show part of a file with `tag::`/`end::` comments or `tags=`, because a snippet hides the imports, the default export and the surrounding code the reader needs. Keep tag comments out of example files, since a whole-file include prints them. Say in the text what the example does, before the listings.
- An example that spans several files of a Zimlet keeps the files' relative paths. Store each file at the same path it has in the Zimlet, under `examples/<topic>/` (for example `index.js`, `components/Button/index.js`, `components/Button/style.less`). Show each file as its own listing with a block title that is its path (`.components/Button/index.js`), so the reader sees where each file goes. Start with the entry file (`index.js`). Keep the set of files as small as the use case needs, following the one-use-case rule below.
- Inline code is allowed only for one or two lines (an import, one call, a config key) and for short shell commands in numbered steps. Use `[source,js]` or `[source,sh]` and always set the language.
- Use [zimlet-examples.md](../../../../zm-modern-zimlets/.agents/reference/zimlet-examples.md) to find a suitable Zimlet for the example: its curated list first, then, if the topic is not there, its registration patterns and their [data file](../../../../zm-modern-zimlets/.agents/context/zimlet-patterns.yml). Inspect the relevant source, then create a simple, focused example for the topic using only the necessary details. Do not copy a whole Zimlet file or name a real Zimlet as the example's source.
- An example shows one use case with the least code that conveys it. Leave out features, helper components, styling, localization and business logic that the topic does not need. Use neutral names (`Greeting`, `my-zimlet`) and do not tie the example to a product feature, so the reader can adapt it to their own case. If you cannot say in one sentence what the example demonstrates, it is too big or too specific: cut it or split it.
- An example must demonstrate the use case of every API, hook, helper or constant that the page names for it. Simple is fine; printing the value is not enough. Show the reader why they would call it and what they do with the result: use a returned value to decide what to render or do (for example, compare `getPlatformType()` with `PLATFORM_TYPES` and show different content), and put a returned field into real content (for example, `data.accountInfo.name` inside a welcome string) instead of printing it bare. If an API appears in the example only to be imported or displayed, drop it from the example or add the behavior that shows its purpose. Check the result against the API's real return values (read its source) and say in the text what the example does with each one.
- An example may leave out a part of [authoring.md](../authoring.md) that is not its topic, to stay simple. The common case is visible text: write literal text instead of `<Text id>` with `withIntl` and `en_US.json`. Tell the reader in advance with a short `NOTE` right after the example, in this order: what the example simplifies, what happens if they copy it as is (for example "the `preact-i18n/no-text-as-children` lint rule in a project from the default template reports it"), and an `xref:` to the page that owns the full approach. Take that page from section 1 of [zimlet-documentation-plan.md](../../plans/zimlet-documentation-plan.md) (for visible text, `localization.adoc`) and link to the whole page, not to a section of a reference page that only lists the names. If the page is planned but not written yet, link it by file name with no `#anchor`, as [write-doc.md](../write-doc.md) describes. One sentence in the `NOTE` is enough; do not explain the concept there. Say that the build or compile fails only when you have checked that it does. Apply the same approach to every similar case: a simplification is always disclosed, with its consequence and a link to the full version.
- Never simplify away something that makes the Zimlet fail at run time or fail to build: the `createElement` import, shimmed-only imports, registering inside `init()`. An example that leaves these out does not work, so keep them even if it makes the example longer.
- Confirm the example against the real pattern (the slot name, the props, the imports).
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

- Take the use cases, the Zimlets that implement them and the example to adapt from [zimlet-examples.md](../../../../zm-modern-zimlets/.agents/reference/zimlet-examples.md) and its [data file](../../../../zm-modern-zimlets/.agents/context/zimlet-patterns.yml). Do not invent a pattern that is not in it.
- Document slots by use case as well as by name. A "Common patterns" section shows, for each use case (for example add content to a screen, add a menu item or action, add a settings page, add a tab and screen), the slot to use, a complete registration example in `examples/slots/<use-case>.js`, and a link to the slot's catalog entry.
- Every pattern example follows [authoring.md](../authoring.md) and the same rules as any slot example above.

### Calling an API in examples

- Follow the [API calling guidance](../../reference/authoring.md#7-api-calling) to choose a suitable method. For documentation examples, do not implement custom GraphQL operations or add GraphQL/Apollo dependencies; if a GraphQL-backed operation is needed, use a ready-made host hook. This restriction applies only to documentation examples, not Zimlet implementation.
