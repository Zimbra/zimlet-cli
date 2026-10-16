# Rules for writing a Modern UI Zimlet

Follow these when creating or changing a Zimlet that runs in `zm-x-web`. Background, examples and tables are in [authoring.md](../reference/authoring.md); section numbers below point there.

For the ordered creation workflow, follow [create-zimlet.md](../workflow/create-zimlet.md). These requirements apply throughout that workflow.

## Package

- Provide at least `package.json`, `src/index.js` (default export: `factory(context)`) and `src/intl/en_US.json`. `zimlet package` fails if `src/intl` is missing, even when `--label` and `--description` are supplied. Add `config_template.xml` only for admin-editable settings and `scripts/postinst.sh` only in repos that ship OS packages ([authoring §1](../reference/authoring.md#1-minimum-package)).
- Set `main` to `build/index.js` and `module` to `src/index.js`. Put `@zimbra/zimlet-cli` in `devDependencies`.
- Use Node 24, as every repo requires.
- Scaffold from the default template only after applying the fixes in [needs-attention.md](../reference/needs-attention.md), or copy the closest existing Zimlet.

## Factory and lifecycle

- Import `createElement` from `preact` in every file that contains JSX. The host has no `preact/jsx-runtime` shim.
- Register all plugins inside `init()`. For async setup, register later from a promise inside `init()`.
- When registering conditionally, undo with `plugins.unregister(name, sameHandlerReference)`; pass the same function reference you registered.

## Registration

- Keep hook calls inside slot handlers unconditional, or return an element of a real component for stateful UI. Handlers run inline while the slot renders ([authoring §3](../reference/authoring.md#3-registration-channels)).
- Pick the slot from the catalog [zimlet-slots.yml](../../../zm-x-web/.agents/zimlet/context/zimlet-slots.yml). Read the callsite `props` / `payloadProps` and follow [slot-behavior.md](../../../zm-x-web/.agents/zimlet/reference/slot-behavior.md). For vertical or tab slots, follow [verticals.md](../../../zm-x-web/.agents/zimlet/reference/verticals.md).
- Never infer a slot's payload from its name alone.

## Imports

- Import only the shimmed modules listed in [context-and-shims.md](../../../zm-x-web/.agents/zimlet/reference/context-and-shims.md#2-shimmed-modules-what-a-zimlet-may-import). Anything else is bundled into your `index.js`.
- Do not add `react`, `react-dom`, `preact` or `@apollo/client` as dependencies. They are aliased to the host's.
- Pass a component (for example from `lucide-preact`) to `icon` props. Do not pass string icon names.
- Use the host router (`preact-router`), not your own.

## Localization

- Keep `src/intl/en_US.json` as the mandatory fallback. Use the zimlet name as the namespace and include the `zimlet` block with `label` and `description`.
- Load locales through `withIntlWrapper` in `src/enhancers.js`, wrap components with `withIntl()(Component)`, and use `<Text id="<zimlet-name>.<key>" />`.
- For adding languages or fixing translations, use the repository's `AGENTS.md` and `.agents/translation/config.yml`; do not improvise the workflow ([authoring §6](../reference/authoring.md#6-localization)).

## Styles

- Prefer shared values from the public zm-x-ui [`css-variables.css`](https://github.com/Zimbra/zm-x-ui/blob/master/css-variables.css), [`palette.css`](https://github.com/Zimbra/zm-x-ui/blob/master/palette.css), and [`variables.less`](https://github.com/Zimbra/zm-x-ui/blob/master/variables.less) when they fit the design. This is a preference, not a hard requirement; use local values when appropriate ([authoring §5](../reference/authoring.md#5-styles)).
