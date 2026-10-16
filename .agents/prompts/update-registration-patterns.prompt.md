---
name: update-registration-patterns
description: Refresh the Zimlet registration patterns context after a Zimlet is added, changed or removed, or after new patterns appear
agent: agent
model: Claude Sonnet 5
---

Update `.agents/context/zimlet-registration-patterns.yml` and, only if needed, `.agents/reference/zimlet-registration-patterns.md`. Optional scope: `${input:scope:all, or the Zimlet names to review}`.

Read `.agents/reference/zimlet-registration-patterns.md` first. It explains the data, the `status` contract and the limits.

1. Run `node .agents/scripts/scan-zimlet-registrations.mjs` from the `zimlet-cli` root (Node `^24.18.0`; the sibling repositories must be checked out). Read its summary: added, refreshed, drift, missing, unclassified, appended usages.
2. For each Zimlet that was added (`status: scanned`) or reported as drifted, open that Zimlet's `src/index.js`, and only the other files the entry's `registrations[].file` names. Do not read other components or investigate what they render.
3. Fill the judgment fields and set the Zimlet's `status: complete`:
   - `registrations[].pattern` and `variant`. Use an existing pattern or variant when one fits.
   - `modifierVariants` and `notes` when the registration is conditional, async, dynamic, looped or registered twice, or when something would surprise a reader.
   - For a drifted `complete` entry, change only what the drift shows (a registration added or removed) and keep the rest.
4. Add a new pattern or variant only when no existing one fits, and give it `summary`, `recommendedExample` and variants with examples. Add a row for it to the tables in the reference `.md`. Set the pattern's `status: complete` only after the next step shows its `usages` are right.
5. For each `unclassified` registration, decide the pattern; if it is a new kind of key, add a pattern as in step 4.
6. Run the script again and then with `--check`. `--check` must exit 0.
7. Check that every `zimlets[].index` path exists and that every link in the reference `.md` resolves.

Rules:
- References only. Do not put code samples or component descriptions in the YAML or the `.md`; point to the Zimlet's `index` instead.
- Do not edit mechanical fields by hand (`registrations[].op`, `key`, `handler`, `guards`, `file`, `modifiers`, `factory`, `index`) or the `usages` of a `scanned` pattern. Fix the scanner if it gets them wrong.
- Never change an entry that is `complete` without a drift report or a reason you state.
- Slot names are recorded as the Zimlet registers them. Do not validate them against `zm-x-web`'s `zimlet-slots.yml`; use it only to understand the host side.
- Classify a registration as `slot-behavior` only after you checked that its component renders nothing or its handler returns `{}`.
- Do not copy hostnames, tokens or credentials from any source.

Known issues from the first run, and what to do about them:

- **Registrations outside `src/index.js`.** `ads`, `chat`, `org-chart` and `web-search` register or unregister slots from components, mostly in `useEffect` or a callback, and `ads` registers nothing in `index.js`. The scanner reads every file under `src/`; each registration has a `file`, and a pattern's `usages` has `files` and `unregisters`. Never assume `index.js` holds everything. For a Zimlet whose `file` is not `src/index.js`, open that file, say in `notes` when it runs (effect, event, state change), and say when an unregister undoes a registration made in `init()`.
- **Registrations a grep misses.** `register(` calls split over several lines, template-literal names (`slot::${adSlots}`) and calls inside `.then`, `store.subscribe`, loops or helper functions defeat a text search. Use the scanner, not `grep`. Record computed names as written and explain them in `notes`.
- **Guards are lexical.** The scanner marks a registration conditional or async only from the code around the call. A helper such as `registerPlugins()` that `init()` calls conditionally, or from a callback, is not detected (`zoom`, `google-drive`, `onedrive`). Read where `init()` calls the helper and add the condition to `notes` or `modifierVariants`. Do not call a Zimlet async without finding the promise: only `dropbox` is.
- **`slot-ui` is the default for every slot.** `slot-behavior` needs proof: read the registered component and confirm it returns `null`, or that the handler returns `{}`. `slot::app` and the send-toolbar slot are ambiguous; leave them `slot-ui` until checked.
- **Companion settings slots are matched by name** (`setting` or `preferences`, except `settings-dropdown*`). Check each new match, and check that a Zimlet that matched is not a gear-menu item.
- **Wrong paths in a brief.** The first brief named `.agent/context/zimlet-slot.yml`, a misplaced guide file, and a `zimlets/` folder in cloudsuite. The real ones are `.agents/zimlet/context/zimlet-slots.yml`, the root `AGENTS.md`, and `packages/`. Check every path on disk before relying on it.
- **Folders that are not Zimlets.** Empty leftovers from archived Zimlets, and the shared library `zimbra-cloud-common`, have no `src/index.js`. The scanner lists them under "skipped folders". Do not add entries for them.
- **A slot missing from `zimlet-slots.yml` is not an error.** Some registered slots are not in the catalog. Record them as registered and do not look them up or report a gap.
- **Same Zimlet name in two repositories.** Entries are matched on `repo` and `name` together.
- **Complete patterns are append-only.** If the scanner starts producing new derived fields (as `files` and `unregisters` were added), set the patterns to `scanned`, run the script once, and set them back to `complete`. Do this only for that reason, and say so in your final report. Likewise, after you reclassify registrations in Zimlet entries, run the script before setting a pattern to `complete`, so its `usages` match the new classification.
- **Testing the merge.** Never test against the real YAML. Copy it and run with `--output <copy>` and `--repo <name>=<dir>` (it replaces a default repo with the same name or adds one) pointing at a scratch folder.
- **Node and npm.** The default shell may have Node 18 and npm 6, which cannot read this repository's lockfile and fail the install. Use Node `^24.18.0` (for example from nvm) for the script and any `npm install`.
- **Unrelated changes.** `package.json` may already contain changes that are not yours, such as `preview:docs`. Leave them. ESLint may fail to start in this environment (missing module); that is not a result of your change. If a failed ESLint run deletes `.eslintcache`, restore it with `git checkout .eslintcache`.
- **Parse errors.** The scanner parses JSX, decorators and class properties. If a file uses syntax it cannot parse, add the Babel plugin in `scanFile` instead of skipping the file.

Do not commit. At the end, list the Zimlets and patterns added or changed, the drift you resolved, anything left `scanned`, and any limit of the scanner you found.
