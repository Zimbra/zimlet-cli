# Rules for packaging and deploying a Modern UI Zimlet

Follow these when running `zimlet package`, writing `config_template.xml`, deploying a Zimlet or loading it for development. How the command and the server behave is described in [packaging-deployment.md](../reference/packaging-deployment.md); section numbers below point there. For rules on writing the Zimlet itself, see [zimlet-authoring.md](./authoring.md).

## Before packaging

- Run `zimlet build` first, then `zimlet package` from the Zimlet folder ([§1](../reference/packaging-deployment.md#1-zimlet-package)).
- Provide `zimlet.label` and `zimlet.description` in `src/intl/en_US.json`. Do not rely on the deprecated `--label` / `--description` options.
- Avoid `"` and `&` in the label and description. They are written to the XML descriptor without escaping.

## Name and version

- Pass `--name` equal to the npm package name (use `$npm_package_name`) and keep it globally unique. Use `zimbra-zimlet-<feature>` for new Zimlets; `com_<company>_<feature>` is the older style.
- Always pass `--zimbraXVersion` with a semver range that includes the zm-x-web version you target. The option is optional, but do not omit it: `zimlet package` then writes `>=1.0.0`, which accepts every Modern UI version, so the server never leaves the Zimlet out on an untested version. A range that excludes the running version makes the Zimlet silently absent ([§3](../reference/packaging-deployment.md#3-server-contract)).
- Read the target version in Modern UI under Settings, then **About**.

## Bundle content

- Ship the Zimlet as a single `index.js` (plus `index.css`). The server concatenates only the `<include>`d scripts.
- Load any other asset through `publicPath` URLs: build with `--publicpath "/service/zimlet/<name>/"` when the bundle references assets by URL.

## `config_template.xml`

- Keep the file in the Zimlet root and make its `name` and `version` match the packaged Zimlet ([§2](../reference/packaging-deployment.md#2-config_templatexml-admin-editable-settings)).
- Read values on the client with `useAccountInfo` from `@zimbra-client/hooks/graphql`.

## Deploying
- Always remember there are 2 ways when it comes to deploying a zimlet which are via the CLI and via Admin console.
- OS-package post-install scripts print a mailbox restart instruction; this is repository-specific guidance, not a verified requirement for CLI or Admin Console deployment ([§4](../reference/packaging-deployment.md#4-deploying)).

### Deploying via CLI
- Run the CLI as the `zimbra` user: `zmzimletctl -l deploy /path/<name>.zip`, then `zmprov fc zimlet` to flush the Zimlet cache ([§4](../reference/packaging-deployment.md#4-deploying)).
- For OS packages, add the Zimlet to the repository's package scripts and provide `scripts/postinst.sh` (see [Zimlet monorepos](../../../zm-modern-zimlets/.agents/reference/zimlet-repositories.md)).

### Deploying via Admin console
- Use the Admin console to upload and deploy the Zimlet ZIP file. Follow the prompts to complete the deployment and flush the Zimlet cache as needed ([§4](../reference/packaging-deployment.md#4-deploying)).

## Development loading

- Development needs a Modern UI server (test or production) with the sideloader Zimlet available; there is no stand-alone environment. Use the sideloader for development instead of packaging: `npm start`, accept the certificate at `https://localhost:8081/index.js` once, install and enable the sideloader Zimlet, then load the dev URL. See [development loading](../reference/cli-commands.md#development-loading-no-packaging)
