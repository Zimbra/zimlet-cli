# Rules for claims in the Zimlet documentation

Sections 2 (claims), 7 and 8 of the writing rules in [write-doc.md](../write-doc.md). Read it in full together with that file. The section numbers are the same as in `write-doc.md`.

## 2. Run, or record, what you cannot confirm

- Run everything you can run on your own machine before you record anything as unverified. Client-side commands and code, such as `zimlet create`, `build`, `watch` and `package`, the build of an example, lint and unit tests, need no server and no one else's help: run them with the [zimlet-doc-verify](../../skills/zimlet-doc-verify/SKILL.md) skill, in a scratch project outside the repository, and use the real output. Not running something that runs locally is a defect, not a reason to record it as unverified. Keep the evidence (the command and what it printed) for your summary, and note any difference between the real output and the reference files or the CLI's own messages as a gap.
- Record a command, example, step or statement in [open claims](../../plans/zimlet-documentation-claims.md) only when you could neither run it nor confirm it in the code, for example because it needs a Zimbra server, a Modern UI session, an account or a permission you do not have. Reading the code is verification for a statement about what the code does, when you follow the whole path through code you can read. It is not verification for a command, example or step you could run, and not for behaviour that only shows in a running system you cannot observe, such as deploying to a server and seeing the result in the Modern UI. Do not put an `Unverified` admonition or any other verification note in the page; the page states the claim as normal text. Follow these rules:
  - Add one row per claim, never one row for a group. Fill every column: claim id (`UC-<page id>-<nn>`), page and section id, the claim, what you checked, `To verify`, severity, status `Unverified`, and who found it and when.
  - Map the row to the section. Give the section that holds the claim an explicit id in the page (`[#section-id]` above the heading, lowercase kebab-case) and write it as `<page id>#<section-id>`, for example `P03#from-source-to-modern-ui`. Keep the id when you rename the heading, and update the row if the claim moves.
  - Name the claim and say what you did check (for example "the example builds with `zimlet build`; it was not loaded in a running Modern UI").
  - Write a `To verify` step that someone with the right access can follow, with the result to expect (a command's output, a message in the browser console, or what appears in the UI). Take the result from the code or reference, and say where it comes from if it is not obvious.
  - Set the severity by the impact on a reader if the claim is wrong, using the levels in the open claims file (High, Medium, Low).
  - Check every command you mention, including those in diagrams, images and tables. A command that you did not run is unverified wherever it appears. If an unverified command is not needed for the point, leave it out.
  - Close a row only after you have run or confirmed the item. Then remove the row from the open claims file, which lists only open claims, and say in the summary what you ran and removed. If the run shows the claim is wrong, fix the page, then remove the row; if you cannot fix it now, set `Disproved` and keep the row until the page is fixed.
  - If a section is removed from the page, remove its rows and say so in the summary.

## 7. Verify as you write

Check each claim while you write, not after the page is done.

- Work section by section. When a section is drafted, audit its claims and fix the section before you start the next.
- A claim is anything a reader could act on or rely on: a command, option, path, file name, default, number, version, output, behaviour or example. Diagram labels, alt text and captions are claims too.
- Keep a ledger as you go: the claim, its kind, the evidence, and the status.
- Do not read the open claims file whole. Search it for the page id (for example `P05#` and `UC-P05-`) and read only the matching rows. Read its Severity and Status tables, found by heading, only when you add or change a row. Take the next claim id from the highest `UC-<page id>-<nn>` row for the page, or `01` if there is none.
- Before you check a claim, look it up in [open claims](../../plans/zimlet-documentation-claims.md) by page and section id and by claim text. For an `Unverified` or `Disproved` row, update that row and do not add a second one; if the wording changed, update the row's claim text. Check every other claim you wrote or changed, and add an `Unverified` row for each one you cannot confirm. Claims you did not write or change in this session need no check.
- Evidence is one of these: the code in the repositories as it is now (cite the file and the symbol), a command or example you ran with the `zimlet-doc-verify` skill (cite the command and its result), or something you observed. The files in `.agents/reference/`, your memory and earlier pages are not evidence. Use them to find what to check, then check it in the code.
- Pick the check by kind: read the code for a statement about behaviour; run an example or command with the skill (build, package, watch, lint rule, `register-calls`); for anything that needs a Zimbra server or a Modern UI session, you cannot run it, so follow the claims rules in section 2.
- Each claim ends with one status from [open claims](../../plans/zimlet-documentation-claims.md) (a `Verified` claim has no row there): `Verified` when you ran it or confirmed it in the code, `Disproved` when a run or the code shows it is wrong, or `Unverified` when you could not run or confirm it. In **Evidence**, say whether it was a run (the command and its result) or the code (the file and symbol, and the path you followed from start to end). Use the code only for what it does; when the path leaves code you can read, or needs a running system, the claim stays `Unverified`. Fix a disproved claim in the page before you go on, and note a disproved claim that conflicts with a reference file or the CLI's own message as a gap. Every `Unverified` claim gets its own row in [open claims](../../plans/zimlet-documentation-claims.md).
- Run each example with the skill before you include it, and use its real output where the page shows output.

### Confirm unverified claims with the user

For each claim you wrote or changed in the session that you did not confirm by running or reading the code, ask the user, one claim per question, with the `ask_user` tool. Show the page and section id (and the claim id, if the claim has an open row) and the claim text. Offer the choices `Yes`, `No` and `Not sure`, and no others.

- `Yes`: the claim is correct. Do not add a row to the [open claims](../../plans/zimlet-documentation-claims.md), which lists only open claims. If the claim has an open row, remove it. Record the answer in the summary.
- `No`: ask for the correct context, as free text, and offer the choice `Update it later`.
  - If the user gives the correct context, change the claim in the page to match it, keep the section id, and run the rules check again. Do not add a row.
  - If the user chooses `Update it later`, leave the text in the page and add a row with status `Disproved`. Leave **Closed on** empty, and in **Evidence** say that the user found the claim wrong and that the page fix is pending. Fix the page, and remove the row, once the correct context is known.
- `Not sure`: leave the text in the page and add a row with status `Unverified`. Give it a `To verify` step that someone with the right access can follow.
- For a claim about what the Modern UI shows, build the example and start the dev server first, as the Modern UI preview of the `zimlet-doc-verify` skill describes, and ask with its choices (`Yes`, `No`, `Not sure`, `Verify later`). `Verify later` is recorded like `Not sure`.
- Use the next free claim id for each new row, and fill every column as section 2 above describes. In **What was checked**, say that the user was asked and what the user answered (`Not sure` or `Verify later`).
- Record every answer in the summary.

## 8. Finishing a page

A page is finished when every claim in it has a status and none is `Disproved`, every `Unverified` claim has its row in [open claims](../../plans/zimlet-documentation-claims.md), and the page meets the sections above. Give the ledger in your summary. A separate, independent review is available (see [review-doc.md](../review-doc.md)); it is run on request.
