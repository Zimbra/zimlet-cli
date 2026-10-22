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

## Scratch project

The scratch project is a copy of the default template (`template/` in the sibling `zm-x-zimlet-template-default` checkout, with `{{name}}` replaced by `my-zimlet`), so every check runs against the layout, lint config and scripts that a reader's new project has. The script command creates it:

```sh
node .agents/skills/zimlet-doc-verify/scripts/verify.mjs scratch
```

It checks that the template checkout has the refreshed layout (`template/eslint.config.mjs`; the checkout must be on `master` or a branch that has it), copies the template, replaces `{{name}}`, runs `npm install` and prints the CLI version. `Verified` if it prints the version; quote it. `Cannot verify` if the template checkout is on the old layout, if the node version is not 24, or if the folder was made by an earlier version of this skill from a different boilerplate (run `rm -rf ../zimlet-verify` and run the command again). The install runs only when the scratch folder has no CLI, so later runs reuse it. If the install is broken, delete the folder and run the command again. `--dir <path>` uses another folder. The scratch project is the template's Hello World Zimlet (an Email tab and its page). To change what it does, edit the scratch copy, not the template.

## Example file or folder (optional)

The script command puts a documentation example into the scratch project:

```sh
node .agents/skills/zimlet-doc-verify/scripts/verify.mjs example <example-file-or-folder>
```

It replaces the template's code in `src/` (only `src/intl` is kept), so the project contains the example and nothing else. It strips the Antora `tag::` and `end::` comments. A single file becomes `src/index.js`. A folder example (a multi-file Zimlet, such as `components/Name/index.js` imported by `index.js`) is copied as a whole into `src/`, so relative imports resolve. The command prints the files now in `src/`. `Cannot verify` if there is no scratch project yet.

## Direct commands

Run these from the repository root, after the scratch project exists. The scratch folder is `zimlet-verify`, a sibling of this repository (`../zimlet-verify`), so it is outside the repository and easy to find. Keep it between runs, delete it if its install is broken, and never commit it. Each command sets `SCRATCH` itself, because each shell call starts a new process.

### Build

```sh
SCRATCH="$(cd .. && pwd)/zimlet-verify"
cd "$SCRATCH" && rm -rf build && npx zimlet build && ls build
```

`Verified` if the build exits 0. Quote the build output and the file list.

### Package

Build first, then package with the template's `package` script:

```sh
SCRATCH="$(cd .. && pwd)/zimlet-verify"
cd "$SCRATCH" && rm -rf build pkg && npx zimlet build && npm run package && unzip -l pkg/*.zip && cat build/*.xml
```

`Verified` if the package step exits 0. Quote the zip listing and the descriptor XML.

### Lint

This lints the project with the template's own ESLint config (`eslint.config.mjs`: ESLint 9, `@zimbra/eslint-config`, Prettier) and its `.editorconfig`, which the scratch project already has. Put the example in `src/` first with the "Example file or folder" section, then run the template's `lint` script, which is `eslint src`:

```sh
SCRATCH="$(cd .. && pwd)/zimlet-verify"
cd "$SCRATCH" && npm run lint
```

The `prettier/prettier` rule reads indentation (tabs) from `.editorconfig`, which is why an example must be linted inside the scratch project and not in a folder without one.

- Exit 0: `Verified`, no problems reported.
- Exit 1: `Verified`, the rules reported problems. The output is the evidence.
- Any other exit code: `Failed`.

## Script commands

These checks need more logic than a shell command, so they are in the script. Run them from the repository root:

```sh
node .agents/skills/zimlet-doc-verify/scripts/verify.mjs <command>
```

| Command | What it does |
|---|---|
| `scratch [--dir d]` | Creates the scratch project from the default template, installs it and prints the CLI version (see Scratch project). |
| `example <file or folder> [--dir d]` | Replaces the scratch project's `src/` with a documentation example (see Example file or folder). |
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
2. Run the [launch workflow](../../workflow/launch-zimlet.md): serve the example from the scratch folder with the dev server, and let the user trust its certificate.
3. Tell the user the screen or message that the checks are about.
4. Ask the checks one at a time with `ask_user`, with the choices `Yes`, `No`, `Not sure` and `Verify later`.
   - `Yes`: the user saw it. Report it as confirmed by the user, with the question and answer as evidence.
   - `No`: ask what the user saw, and fix the page to match.
   - `Not sure` or `Verify later`: leave the claim `Unverified`. Say what you ran (build, dev server) and that the user chose not to confirm it now. In `To verify`, give the load steps of the launch workflow and the expected result of the question.
5. Clean up. Stop the dev server as the launch workflow describes. Keep the scratch folder and tell the user its path (`../zimlet-verify`, a sibling of this repository), so they can read the code that was tested.

## Rules

- Run on Node 24. Check with `node -v` first. On another version, report `Cannot verify`.
- Never open, drive or capture the Modern UI yourself, with browser tools or a script. The user does it.
- Run the [launch workflow](../../workflow/launch-zimlet.md) before you ask the user whether a Modern UI claim is correct, so the user has the dev server running and knows what to look for. A stub-host check (`register-calls`) is not a substitute.
- If a result differs from the page, the reference files or the CLI's own messages, report the difference as a gap.
- Do not record an item in the open claims file (`plans/zimlet-documentation-claims.md`) before you have tried it here. Agents record what they could not confirm as `Unverified`. Only the user confirms a claim that needs a server or a Modern UI session; a confirmed claim has no row in the open claims file.
