---
name: zimlet-doc-verify
description: >
  Run Zimlet documentation examples and commands in a scratch project and report what
  actually happens. Use when writing or reviewing a page of the Zimlet developer guide and a
  command, a code or config example, or a statement about build, package, watch or lint
  output needs to be confirmed. Reports Verified, Failed or Cannot verify with the command
  and its real output.
---

# Verify Zimlet documentation by running it

Reading code or reference files is not verification. This skill runs the item in a scratch Zimlet project so the page can quote real results. It needs Node 24 (`nvm use 24`) and network access for `npm install`.

## Result contract

Every check reports one result.

| Result | Exit code | Meaning |
|---|---|---|
| `Verified` | 0 | The command ran and the output is shown. |
| `Failed` | 1 | The command ran and failed. The output is the evidence. A failing documented example is a defect in the page or the tool. |
| `Cannot verify` | 2 | It could not be run here. `REASON` and `NEEDED` say why and what is required. |

Quote the `COMMAND` and the key lines of `OUTPUT` in your evidence. Do not paraphrase a result you did not get.

## Direct commands

Run these from the repository root. The scratch folder is `zimlet-verify`, a sibling of this repository (`../zimlet-verify`), so it is outside the repository and easy to find. Keep it between runs, delete it if its install is broken, and never commit it. Each command sets `SCRATCH` itself, because each shell call starts a new process.

### Scratch project

```sh
SCRATCH="$(cd .. && pwd)/zimlet-verify"
mkdir -p "$SCRATCH"
if [ ! -x "$SCRATCH/node_modules/.bin/zimlet" ]; then
  cp -R .agents/skills/zimlet-doc-verify/assets/boilerplate/. "$SCRATCH"
  (cd "$SCRATCH" && npm install --no-audit --no-fund)
fi
cd "$SCRATCH" && npx zimlet --version
```

The install runs only when the scratch folder has no CLI, so later runs reuse it. `Verified` if `npx zimlet --version` prints a version, and, after a fresh install, `npm install` also exits 0. Quote the version. If the install is broken, run `rm -rf "$SCRATCH"` and run this section again. The boilerplate is a minimal Zimlet (`src/index.js`, `src/intl/en_US.json`). To change what it does, edit the scratch copy, not the skill.

### Example file or folder (optional)

Doc examples carry Antora `tag::` and `end::` comments. Strip them before you use an example as Zimlet source. A single file becomes `src/index.js`:

```sh
SCRATCH="$(cd .. && pwd)/zimlet-verify"
grep -v -E '^[[:space:]]*(//|<!--)[[:space:]]*(tag|end)::' <example-file> > "$SCRATCH/src/index.js"
```

A folder example (a multi-file Zimlet, such as `components/Name/index.js` imported by `index.js`) is copied as a whole into `src/`, so relative imports resolve. Remove the files of an earlier example first:

```sh
SCRATCH="$(cd .. && pwd)/zimlet-verify"
EXAMPLE="<absolute path to the example folder>"
rm -rf "$SCRATCH/src/components" "$SCRATCH/src/index.js"
(cd "$EXAMPLE" && find . -type f) | while read -r f; do
  mkdir -p "$SCRATCH/src/$(dirname "$f")"
  grep -v -E '^[[:space:]]*(//|<!--)[[:space:]]*(tag|end)::' "$EXAMPLE/$f" > "$SCRATCH/src/$f"
done
```

### Build

```sh
SCRATCH="$(cd .. && pwd)/zimlet-verify"
cd "$SCRATCH" && rm -rf build && npx zimlet build && ls build
```

`Verified` if the build exits 0. Quote the build output and the file list.

### Package

Build first, then package with the boilerplate script:

```sh
SCRATCH="$(cd .. && pwd)/zimlet-verify"
cd "$SCRATCH" && rm -rf build pkg && npx zimlet build && npm run package && unzip -l pkg/*.zip && cat build/*.xml
```

`Verified` if the package step exits 0. Quote the zip listing and the descriptor XML.

### Lint

This lints an example with the real `zm-modern-zimlets` ESLint config (ESLint 9, `@zimbra/eslint-config`). Set `CHECKOUT` to the absolute path of the `zm-modern-zimlets` checkout, the sibling of this repository.

```sh
SCRATCH="$(cd .. && pwd)/zimlet-verify"
cd "$SCRATCH"
rm -rf example example.js
cp <example-file> example.js
cp "$CHECKOUT/.editorconfig" .editorconfig
printf "import cfg from '%s/eslint.config.mjs';\nexport default cfg;\n" "$CHECKOUT" > eslint.config.mjs
"$CHECKOUT/node_modules/.bin/eslint" example.js
```

For a folder example, copy it with `cp -R <example-folder> example` and lint `example` instead of `example.js`.

The wrapper config imports the checkout's config, so the checkout is not modified. ESLint ignores files outside the config's folder, which is why the example is copied into the scratch folder.

The `.editorconfig` copy is required. The `prettier/prettier` rule reads indentation (tabs) from the `.editorconfig` nearest to the linted file, and `.prettierrc` sets none. Without the copy, every tab-indented line is reported as `Replace ↹ with ··`, which is a false result caused by the scratch folder, not by the example.

- Exit 0: `Verified`, no problems reported.
- Exit 1: `Verified`, the rules reported problems. The output is the evidence.
- Any other exit code: `Failed`.
- If `$CHECKOUT/node_modules/.bin/eslint` does not exist: `Cannot verify`, with `NEEDED: npm install` in the `zm-modern-zimlets` checkout.

## Script commands

Two checks need more logic than a shell command, so they stay in the script. Run them from the repository root:

```sh
node .agents/skills/zimlet-doc-verify/scripts/verify.mjs <command>
```

| Command | What it does |
|---|---|
| `watch <dir> [--port n] [--example file or folder]` | Starts `zimlet watch`, fetches `https://localhost:<port>/index.js`, edits a source file, and checks that the served file is rebuilt. Prints the URL the CLI itself prints. |
| `register-calls <dir> [--invoke]` | Loads `build/index.js` with a stub host and lists the `plugins.register` calls made by the factory and by `init()`. With `--invoke`, it also calls each registered handler once with empty props and reports whether it threw. Needs a build first. |

## Which check answers which claim

| The page says | Run |
|---|---|
| A command or option works, with this output | The direct command for it, then compare the real output |
| An example builds | Example file, then Build |
| An example registers a slot in `init()`, not in the factory | Example file, Build, then `register-calls` |
| A missing import or a bad handler fails when it is called | Example file, Build, then `register-calls --invoke` |
| The package contains these files, with this descriptor | Package |
| The dev server serves `index.js` and rebuilds on save | `watch` |
| A lint rule reports an example | Lint |
| What a slot shows in the Modern UI, or a console message, with a dev Zimlet loaded from the sideloader | Example file, Build, then the "Modern UI preview (user checks)" steps below: you start the dev server and the user checks the Modern UI |
| Something needs a deployed Zimlet on a Zimbra server, or a Modern UI session that cannot be reached | Report `Cannot verify` and name what is needed |

`register-calls` uses a stub host. It proves which registrations a Zimlet makes, not how a slot renders them.

## Modern UI preview (user checks)

A claim about what the Modern UI shows, such as a slot output or a console message, needs a person in the Modern UI. Do not drive the browser. You build the example and start the dev server. The user loads it and tells you what they see.

1. List the checks. Write each as a question with one observable answer, for example "Does the text `<expected text>` appear above the message body?" or "Does the browser console print `[ZimletSideLoaderSDK "<name>"]: Loaded successfully from ...`?". Take the expected text from the example, not from memory.
2. Build the example (Example file, then Build), then start the dev server in the scratch folder, detached so it keeps running: `cd "$SCRATCH" && npx zimlet watch --port 8081`. Confirm that `curl -sk -o /dev/null -w "%{http_code}" https://localhost:8081/index.js` prints `200`.
3. Tell the user the screen or message that the checks are about.
4. Ask the checks one at a time with `ask_user`, with the choices `Yes`, `No`, `Not sure` and `Verify later`.
   - `Yes`: the user saw it. Report it as confirmed by the user, with the question and answer as evidence.
   - `No`: ask what the user saw, and fix the page to match.
   - `Not sure` or `Verify later`: leave the claim `Unverified`. Say what you ran (build, dev server) and that the user chose not to confirm it now. In `To verify`, give the load steps above and the expected result of the question.
5. Clean up. Ask the user to untick "Persist on Reload" for the test entry (stored in the `localStorage` key `zimlets-persistance`). Stop the `zimlet watch` process on port 8081 with `kill <PID>`. Keep the scratch folder and tell the user its path (`../zimlet-verify`, a sibling of this repository), so they can read the code that was tested.

## Rules

- Run on Node 24. Check with `node -v` first. On another version, report `Cannot verify`.
- Run the preview workflow before you ask the user whether a Modern UI claim is correct, so the user has the dev server running and knows what to look for. A stub-host check (`register-calls`) is not a substitute.
- If a result differs from the page, the reference files or the CLI's own messages, report the difference as a gap.
- Do not record an item in the open claims file (`plans/zimlet-documentation-claims.md`) before you have tried it here. Agents record what they could not confirm as `Unverified`. Only the user confirms a claim that needs a server or a Modern UI session; a confirmed claim has no row in the open claims file.
