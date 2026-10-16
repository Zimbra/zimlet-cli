# zimlet-cli: commands and build pipeline

`@zimbra/zimlet-cli` (this repo, version 19.0.0, Node `^24.18.0`, npm `^11`) is the only build tool a Zimlet needs. Binary: `zimlet` ([src/cli.js](../../src/cli.js), compiled to `dist/cli.js`). Compile-time only; it knows nothing about a Zimlet's logic.

The runtime counterpart is in [zm-x-web runtime.md](../../../zm-x-web/.agents/zimlet/reference/runtime.md). Packaging output and deployment: [packaging-deployment.md](./packaging-deployment.md).

## Commands

| Command | Key options | Behaviour |
|---|---|---|
| `zimlet create [template] [dest]` | `--name`, `--force/-f`, `--install/-i` (default true), `--yarn`, `--git`, `--cwd` | Downloads a GitHub template with `gittar`, copies only its `template/` folder, replaces `{{name}}`, writes `package.json` `name`, installs dependencies. `template` `default` means `zimbra/zm-x-zimlet-template-default`; `foo` means `zimbra/foo`. Missing `template`/`dest` triggers interactive prompts. `--force` on an existing folder still asks for confirmation. Template layout: [authoring.md](./authoring.md#starting-from-the-default-template). [create.js](../../src/commands/create.js) |
| `zimlet watch` | `--port` (default 8081, scans up to +100 if busy), `--https` (default true), `--config` | `webpack-dev-server` with HMR, CORS enabled, `allowedHosts: all`, serves `https://localhost:<port>/index.js`, opens a browser. The self-signed certificate must be accepted manually in the browser. |
| `zimlet build` | `--dest` (default `./build`), `--publicpath` (default `/`), `--config` | Production webpack build to `build/index.js` (plus `index.css`, assets, chunks). |
| `zimlet package` | `--name/-n`, `--pkg-version/-v` (both required), `--zimbraXVersion` (default `>=1.0.0`), `--label/-l`, `--description/--desc`, `--builddir/-b`, `--dest/-d` | Creates the descriptor and zip. Details in [packaging-deployment.md](./packaging-deployment.md). |

Template scripts added by `create` when absent: `build: zimlet build`, `watch: zimlet watch`, `package: zimlet package`. Real zimlets use fuller scripts (see [authoring.md](./authoring.md)).

`watch` and `build` both read `package.json` in the current directory.

## Build pipeline (`configure()` in [src/index.js](../../src/index.js))

- **Webpack entry** is the CLI's own [entry.js](../../src/entry.js), not the author's file. The author's file is aliased as `zimlet-cli-entrypoint`: `pkg.module` (for example `src/index.js`) → `pkg.jsnext:main` → `pkg.main`.
- **Compiler**: `esbuild-loader` for `.js/.jsx` (target `es2022`, `jsxFactory: createElement`, legacy decorators, `useDefineForClassFields: false`). Babel is **not** used. Consequence: JSX needs `createElement` in scope, so add `import { createElement } from 'preact'` to every file with JSX.
- **Output**: `index.js` (single file), chunks in `scripts/`, fonts/images in `fonts/` (`asset/resource`). `publicPath` is `https://host:port/` in watch mode, otherwise `--publicpath`.
- **Styles** (`.less`, `.css`): `src/components`, `src/screens`, `src/pages` are CSS Modules with class names `[zimletDir]_[path]_[local]`; every other style file is global. All go through `zimlet-style-loader`, which pushes CSS into the global `ZIMLET_STYLES` array instead of injecting `<style>`. `entry.js` joins it and calls `context.styles.set(...)`, so the **host** injects the CSS. Pipeline: less-loader → postcss (preset-env stage 3, nesting; CSS custom properties preserved) → css-loader.
- **`config_template.xml`**: copied into `build/` if it exists in the zimlet root.
- **Shims**: aliases from `SHIMMED_MODULES` in [src/shims/index.js](../../src/shims/index.js) (note: a directory, not `src/shims.js`) point at generated files in [src/shims/](../../src/shims). Each one re-exports from `global.shims['<module>']`. `react` and `react-dom` alias to the `preact/compat` shim. `build-shims.js` regenerates the files (`npm run build:shims`). See [context-and-shims.md](../../../zm-x-web/.agents/zimlet/reference/context-and-shims.md) for what the host really provides, including the `preact/jsx-runtime` gap.
- **`entry.js` runtime**: calls the iframe's global `zimlet(factory)`. The factory sets `global.shims/zimbra/config/plugins/components/store/meta`, `require`s the author's module, calls its default export with `context` if it is a function (otherwise treats it as a singleton object), applies collected styles, and returns the instance. HMR (`module.hot.accept('zimlet-cli-entrypoint', init)`) is active only when `NODE_ENV === 'development'`.

## Customizing webpack

Create `zimlet.config.js` in the zimlet root (or pass `--config <path>`). [transform-config.js](../../src/lib/webpack/transform-config.js) loads it with `createRequire`, takes `module.exports` or `.default`, and **only calls it if it is a function**: `(config, env) => { /* mutate config */ }`. `env` includes `cwd`, `watch`, `production`, `dest`, `publicpath`. Errors are printed, not thrown.

An object export (for example `{ before, after }`) is ignored when it is the Zimlet's own config. `zm-cloudsuite-zimlets` uses such an object at its repo root, and each package's function-style config calls it. See the [Cloudsuite repository section](./zimlet-repositories.md#zm-cloudsuite-zimlets).

## Development and lint

```sh
npm run build        # build:shims + esbuild src -> dist (prebuild cleans dist)
npm run lint
npm test             # lint + build
npm run build:docs   # Antora site from documentation/ (see below)
```

## Where other documentation lives

- [documentation/](../../documentation): Antora (AsciiDoc) site scaffold added for the new Zimlet developer guide; currently only a home page. Guidance for writing it: [write-doc.md](../rules/write-doc.md); review rules in [review-doc.md](../rules/review-doc.md).
- [examples/dropbox](../../examples/dropbox): old sample, not the live Dropbox zimlet.
