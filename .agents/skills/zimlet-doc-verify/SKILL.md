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

Every command prints one result and exits with a matching code.

| Result | Exit code | Meaning |
|---|---|---|
| `Verified` | 0 | The command ran and the output is shown. |
| `Failed` | 1 | The command ran and failed. The output is the evidence. A failing documented example is a defect in the page or the tool. |
| `Cannot verify` | 2 | It could not be run here. `REASON` and `NEEDED` say why and what is required. |

Quote the `COMMAND` and the key lines of `OUTPUT` in your evidence. Do not paraphrase a result you did not get.

## Commands

Run from the repository root: `node .agents/skills/zimlet-doc-verify/scripts/verify.mjs <command>`.

| Command | What it does |
|---|---|
| `scratch [dir]` | Copies [the boilerplate](./assets/boilerplate) (a minimal Zimlet) to `dir`, or a new temporary folder, runs `npm install`, and prints the folder and the CLI version. |
| `build <dir> [--example file] [--as path]` | Optionally writes an example file to `src/index.js` (or `--as`), without its `tag::`/`end::` comments, then runs `zimlet build`. |
| `package <dir> [--example file]` | Builds, runs `zimlet package` with the boilerplate script, and prints the zip listing and the descriptor XML. |
| `watch <dir> [--port n] [--example file]` | Starts `zimlet watch`, fetches `https://localhost:<port>/index.js`, edits a source file, and checks that the served file is rebuilt. Prints the URL the CLI itself prints. |
| `lint-i18n <dir> <file>` | Installs ESLint 8 and the `preact-i18n` plugin in the scratch project and runs the `no-text-as-children` rule on a file. |
| `register-calls <dir> [--invoke]` | Loads the built `build/index.js` with a stub host and lists the `plugins.register` calls made by the factory and by `init()`. With `--invoke` it also calls each registered handler once with empty props and reports whether it threw. |

To change what the boilerplate does, edit files in the scratch folder, not in the skill.

## Which command answers which claim

| The page says | Run |
|---|---|
| A command or option works, with this output | `build`, `package` or `watch`, then compare the real output |
| An example builds | `build --example <file>` |
| An example registers a slot in `init()`, not in the factory | `build --example`, then `register-calls` |
| A missing import or a bad handler fails when it is called | `build --example`, then `register-calls --invoke` |
| The package contains these files, with this descriptor | `package` |
| The dev server serves `index.js` and rebuilds on save | `watch` |
| A lint rule reports an example | `lint-i18n` |
| Something needs a deployed Zimlet, a Zimbra server or a Modern UI session | Nothing here can run it: report `Cannot verify` and name what is needed |

`register-calls` uses a stub host. It proves which registrations a Zimlet makes, not how a slot renders them.

## Rules

- Use a scratch folder outside the repository. Delete it when you are done. Never commit it.
- Run on Node 24. On another version the skill returns `Cannot verify`.
- If a result differs from the page, the reference files or the CLI's own messages, report the difference as a gap.
- Do not mark an item `Unverified` in a page before you have tried it here.
