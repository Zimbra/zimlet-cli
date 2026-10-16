# Zimlet packaging, deployment and server contract

How a built Zimlet becomes something the Zimbra server serves to Modern UI. Based on [package.js](../../src/commands/package.js). The server behaviour below is not exercised by this workspace.

Rules to follow when packaging and deploying: [rules/packaging-deployment.md](../rules/packaging-deployment.md). Build side: [cli-commands.md](./cli-commands.md). Host side: [zm-x-web zimlet.md](../../../zm-x-web/.agents/zimlet/reference/zimlet.md).

## 1. `zimlet package`

Run in the zimlet folder after `zimlet build`:

```sh
zimlet package --name <zimlet_name> --pkg-version <x.y.z> --zimbraXVersion '<semver range>'
```

Steps:

1. **Label and description** are read from `src/intl/en_US.json` at `zimlet.label` and `zimlet.description`:
   ```json
   { "zimlet": { "label": "Personal Note", "description": "…" } }
   ```
   If missing, `--label` and `--description` are used (deprecated path, warns). If neither is available the command errors.
2. **Descriptor** `build/<name>.xml` is generated:
   ```xml
   <zimlet name="…" version="…" description="…" label="…" zimbraXZimletCompatibleSemVer="…">
     <include>index.js</include>
     <includeCSS>index.css</includeCSS>
     <resource>fonts</resource> …
   </zimlet>
   ```
   Every top-level entry of the build folder is listed: `.js` → `include`, `.css` → `includeCSS`, anything else (except `.properties` and the descriptor itself, including folders such as `fonts/`, `scripts/`) → `resource`. Values are not XML-escaped, so `"` and `&` in label/description break the XML.
3. **Properties files** for the admin console: `<name>.properties` (English) and `<name>_<locale>.properties` for each other `src/intl/*.json`, with `label`/`description` unicode-escaped. They are written to `./build` (hard-coded; the `--builddir` option only affects where files are read from and zipped).
4. **Zip**: the whole build folder → `pkg/<name>.zip` (`--dest` changes the folder). `config_template.xml` is already in `build/` if `zimlet build` found it.

Naming: `--name` is expected to be globally unique and equal to the npm package name (scripts pass `$npm_package_name`). Existing zimlets use `zimbra-zimlet-<feature>`; the older style is `com_<company>_<feature>`.

`--zimbraXVersion` is a semver **range** (npm style, for example `^4.42.0`, `>=1.0.0`). It becomes LDAP attribute `zimbraXZimletCompatibleSemVer` (`since 8.8.9`, `max=256`). It is optional: without it, `zimlet package` writes the default `>=1.0.0`, which accepts every Modern UI version (checked by running `zimlet package` without the option, CLI 19.0.0). The compatibility filter in §3 then never leaves the Zimlet out.

**Finding the host version to target.** The server compares your range with the Modern UI (`zm-x-web`) version (`PKG_VERSION` in `ZimletLoader`, sent as `zimbraXZimletCompatibleWith`). In Modern UI, log in, click the settings icon (top right), then **About**. It shows "Zimbra Modern Web App Version `<version-number>` (`<commit-hash>`)" (from the `zm-x-web` README; not run here). The range has to include that version. The mapping between a Zimbra server release and its `zm-x-web` version is not documented in these files; see [zimlet-known-issues.md](../../../zm-modern-zimlets/.agents/reference/zimlet-known-issues.md#documentation-sources).

## 2. `config_template.xml` (admin-editable settings)

If a file named `config_template.xml` exists in the zimlet root, `zimlet build` copies it into the package. Format:

```xml
<zimletConfig name="<zimlet-name>" version="<zimlet-version>">
  <global>
    <property name="someKey">default value</property>
  </global>
</zimletConfig>
```

`name` and `version` are expected to match the packaged Zimlet. After deployment the values reach the client through `accountInfo.zimlets.zimlet[].zimletConfig[0].global[].property[]` (query in [account-info.graphql](../../../zm-x-web/src/graphql/queries/preferences/account-info.graphql)). Read them with `useAccountInfo` from `@zimbra-client/hooks/graphql`. Admins change values with `zmzimletctl configure <config.xml>`. Existing Zimlet repositories: [Zimlet configuration](../../../zm-modern-zimlets/.agents/reference/zimlet-repositories.md#zimlet-configuration).

## 3. Server contract

The server side lives in [zm-mailbox](../../../zm-mailbox). Check each row below against the code before relying on it: [ZimletFilter.java](../../../zm-mailbox/store/src/java/com/zimbra/cs/zimlet/ZimletFilter.java) (compatibility filter), [ZimletResources.java](../../../zm-mailbox/store/src/java/com/zimbra/cs/zimlet/ZimletResources.java) (bundle and labels), [ZimletUtil.java](../../../zm-mailbox/store/src/java/com/zimbra/cs/zimlet/ZimletUtil.java) (deploy and enable), [Zimlet.java](../../../zm-mailbox/store/src/java/com/zimbra/cs/account/Zimlet.java) (zimlet account entry), and [zimbra-attrs.xml](../../../zm-mailbox/store/conf/attrs/zimbra-attrs.xml) (LDAP attributes).

| Step | Behaviour |
|---|---|
| Deploy | `zmzimletctl deploy <zip>` = install + `ldapDeploy` + ACL grant on default COS + enable. |
| Descriptor parse | The server reads `zimbraXZimletCompatibleSemVer` and stores it on the zimlet LDAP entry. |
| Bundle | `GET /service/zimlet/res/Zimlets-nodev_all.zgz` (JS) or `.css` concatenates every enabled zimlet's local `<include>`/`<includeCSS>` files. Before each file it writes `/*\n * Zimlet: <name>File: <file> */`. Remote URLs in `<include>` are skipped. |
| Compatibility filter | If the request has `zimbraXZimletCompatibleWith=<version>`, only zimlets with a non-null `zimbraXZimletCompatibleSemVer` that **satisfies** that version are included. Without the parameter, only zimlets **without** a semver (Classic UI zimlets) are included. |
| Per-COS / per-user | Presence is `mandatory`, `enabled` or `disabled` per COS; users can toggle non-mandatory ones. The client receives it as `zimletContext[0].presence`. |
| JS minify | For Modern UI requests (`zimbraXZimletCompatibleWith` set) the bundle is processed by `compile(...)`, otherwise by the YUI compressor. |
| Labels | `GET /service/res/<n1,n2>.js?locid=<locale>` serves generated label/description snippets from the `.properties` files; the client parses them (`App.localizeZimlets`). |
| Static assets | `/service/zimlet/<name>/…` serves files from the deployed zip. A bundle that references assets by URL is built with `--publicpath "/service/zimlet/<name>/"`. |

Consequences for authors:

- A zimlet whose semver range does not include the running zm-x-web version is **silently absent** from the bundle.
- The consolidated file contains only the `<include>`d scripts, so a Zimlet is expected to ship as a single `index.js`; anything else is loaded through `publicPath` URLs. Rules: [rules/packaging-deployment.md](../rules/packaging-deployment.md#bundle-content).

## 4. Deploying

- **Command line:** The Zimbra Admin Guide covers deploying and managing Zimlets from the command line. See [Managing Zimlets from the command line](https://zimbra.github.io/documentation/zimbra-10/adminguide.html#_managing_zimlets_from_the_command_line_interface).
- **Admin Console:** The Zimbra Admin Guide covers managing Zimlets from the Admin Console. See [Managing Zimlets from the Administration Console](https://zimbra.github.io/documentation/zimbra-10/adminguide.html#_managing_zimlets_from_the_administration_console).
- **OS packages:** The Zimlet monorepos also deliver OS packages; see [OS packages](../../../zm-modern-zimlets/.agents/reference/zimlet-repositories.md#os-packages).
- **Mailbox restart:** The OS-package post-install scripts print an instruction to restart the mailbox service after installation; they do not restart it themselves. This is repository-specific guidance, not a verified requirement for command-line or Admin Console deployment, nor evidence that a restart is required specifically after a first deployment.

To load a Zimlet for development without packaging (sideloader and dev server), follow the [Modern UI preview workflow](../workflow/preview-zimlet.md).
