---
name: write-doc
description: Write a new page, or add or update sections of an existing page, of the Zimlet developer guide from .agents/plans/zimlet-documentation-plan.md
agent: agent
model: Claude Sonnet 5.5
---

Work on page `${input:pageId}` of the Zimlet developer guide. Give the page as its id (`P04`), its file name (`prerequisites` or `prerequisites.adoc`) or its title (`What you need before you start`). Optional scope: `${input:scope:whole page, section names to add or update, or specific plan/reference changes to apply}`.

The plan is `.agents/plans/zimlet-documentation-plan.md`. Follow its section 2 and do not restate its content or the rules here. The build order, with the phase statuses, is in `.agents/plans/zimlet-documentation-build.md`, and the open claims are in `.agents/plans/zimlet-documentation-claims.md`. Do not read either of those two files whole. In the build file, read the row of the build order table whose Pages column holds the page id (it can be a range, such as `P03–P06`), the rows of the phases in its Depends on column, and the line starting `Phase status values`. In the claims file, read only the rows for the page, as `doc-guide/claims.md` section 7 describes.

Read `.agents/rules/write-doc.md` and every rules file in `.agents/rules/doc-guide/` except `slots.md`, which is read on demand, each completely. The build and claims files are the exception: read them by row, as above. A tool read that is cut off or truncated is not a complete read: continue in line ranges to the last line, or search the file for the headings you need and read those sections whole. In the final summary, list each rules and plan file as read in full or by section, with the section numbers.

### Research (steps 1 to 4)

1. Read from the plan only what this page needs: section 2, and the page's entry in section 1. The page index is large, so do not read the whole file. Find the entry by searching only the page lines, which start with `- **P`: match the id (`- **P04 `), the file name (`` `prerequisites.adoc` ``) or the title. If no page line or more than one matches, ask me with the `ask_user` tool which page I mean. Read from that line to the next `- **P` line: the heading line (page id, file name, title and status), the section bullets and the Brief. Match a named scope to the entry's section bullets (for example `Find the Modern UI version`); if it matches none, or the page differs from the bullets, say so and ask me. Also read the heading of its part (`### Part N`) and the `_Purpose:` line under it. Then find the page's status and pick the mode:

   - `Not started`: **create** the whole page. Check its dependencies as the build order in `.agents/plans/zimlet-documentation-build.md` describes. If they are not met, stop and ask me with the `ask_user` tool whether to continue. Record nothing in the plan about my answer.
   - `Drafted` or `Reviewed`: **update** the existing page. If a scope is given, change only the named sections; otherwise, change sections that differ from the plan's section list. Keep all other text as it is.
   - For an update, follow "Updating an existing page" in `write-doc.md` section 2.
2. Read `.agents/rules/write-doc.md`. Then list `.agents/rules/doc-guide/` and read every `.md` file in it except `slots.md`, each to its last line. A file can be longer than one tool read returns: read it in line ranges until its last line. Section numbers 0 to 9 stay the same across the files. Then read the page's entry in the plan as step 1 describes (part purpose, section list and brief). In update mode, read only the scoped sections of the existing page when a scope is given; otherwise, read the whole page in `documentation/modules/ROOT/pages/`.
   Apply the length check of `write-doc.md` section 0 before you write anything: if the page may become very long, stop and ask me.
3. Use the reference material for the section(s) being written or updated, from `.agents/reference/` and, for the host side, from `zm-x-web/.agents/zimlet/reference/zimlet.md`, which names the host file for each topic, to find what to check, as `doc-guide/claims.md` section 7 describes. For a scoped update, do not read unrelated sources. Check claims in the real code, including the template, `zimbra-zimlet-personal-notes`, `shims.js` and `zimlet-slots.yml` where applicable. For registration examples, follow the pattern and recommended Zimlet in `.agents/reference/zimlet-examples.md` and its YAML. Also read other references when the relevant sources do not cover the section.

4. Ask for screenshots before you write, as "Screenshots: ask first, then add" in `doc-guide/media.md` section 5 describes. Do this before step 5, and state my answer in the summary.

### Write (steps 5 and 6)

5. Write or edit the page in `documentation/modules/ROOT/pages/`, section by section. Put examples, images and diagrams in the folders listed in section 2 of the plan. Look up each claim in the open claims file (`.agents/plans/zimlet-documentation-claims.md`) before you check it, and audit each section's claims before you start the next, as `doc-guide/claims.md` section 7 describes.
   Add a screenshot only as the same section of `doc-guide/media.md` describes, and list each one in the summary as added to the page, research only or skipped.
6. Create mode only: add the page to `documentation/modules/ROOT/nav.adoc` (create the file if it does not exist). Update mode: change `nav.adoc` only if a page or section title changed.

### Check (steps 7 and 8)

7. Rules check, before the claim ledger: run the checks of `doc-guide/finish.md` ("Rules check") and put each answer, with its one line of evidence, in the summary under "Rules check". Then check the claim ledger for the sections being written or updated, including unchanged text that the edit touches or depends on, as `doc-guide/claims.md` section 8 describes. For a scoped update, do not re-audit unrelated sections.
8. Confirm the claims with me, as the section "Confirm unverified claims with the user" of `.agents/rules/doc-guide/claims.md` describes. Ask one claim at a time with the `ask_user` tool, and record every answer in the summary.

### Finish (steps 9 and 10)

9. Update the statuses as the build order in `.agents/plans/zimlet-documentation-build.md` describes: the page status in section 1 of the plan, and the phase status in the build order. Create mode sets the page to `Drafted`. Update mode leaves `Drafted` as is, and resets `Reviewed` to `Drafted` because the page changed. Never set `Reviewed`.
10. Run the build and preview checks as `doc-guide/finish.md` ("Build and preview") describes. Do not set `Reviewed` yourself. Then delete the staged screenshots, as "Clean up" in `doc-guide/media.md` describes.

Record gaps as you find them, as `doc-guide/finish.md` ("Record gaps") describes.

Do not commit. At the end, state the mode used, list the sources used, the sections changed, the rules check of step 7, the claim ledger, my answer for each claim you asked about in step 8, and any gaps found in the plan or sources, with the `zimlet-known-issues.md` entries you added or changed. Then print the claims that were found or touched in this session as a table of claim id (`-` for a verified claim with no row), page and section id, claim, severity and status (added, updated, removed after verification or left open). Write "None" if there are none.
