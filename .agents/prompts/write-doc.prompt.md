---
name: write-doc
description: Write a new page, or add or update sections of any existing page, of the Zimlet developer guide. A page is looked up in .agents/plans/zimlet-documentation-plan.md and added to the plan when it is missing
agent: agent
model: Claude Sonnet 5.5
---

Work on page `${input:pageId}` of the Zimlet developer guide. Give the page as its id (`P04`), its file name (`prerequisites` or `getting-started/prerequisites.adoc`) or its title (`Prerequisites`). For a new page that the plan does not list, give the title and, if you know it, the part and the file name. Optional scope: `${input:scope:whole page, section names to add or update, or specific plan/reference changes to apply}`.

The plan is `.agents/plans/zimlet-documentation-plan.md`. Look every page up in it first. Follow its section 2 and do not restate its content or the rules here. The open claims are in `.agents/plans/zimlet-documentation-claims.md`. Do not read that file whole: read only the rows for the page, as `doc-guide/claims.md` section 7 describes.

### Research (steps 1 to 4)

1. Read from the plan only what this page needs: section 2, and the page's entry in section 1. The page index is large, so do not read the whole file. Find the entry by searching only the page lines, which start with `- **P`: match the id (`- **P04 `), the file name (`` `getting-started/prerequisites.adoc` ``) or the title. If more than one line matches, ask me with the `ask_user` tool which page I mean. Then pick the mode:

   - **Entry found, status `Not started`:** **create** the whole page.
   - **Entry found, status `Drafted` or `Reviewed`:** **update** the existing page. If a scope is given, change only the named sections; otherwise, change sections that differ from the plan's section list. Keep all other text as it is. Follow "Updating an existing page" in `write-doc.md` section 2.
   - **No entry, and the page does not exist in `documentation/modules/ROOT/pages/`:** **create** a new page and add its entry to the plan (step 9). Before you write, check section 1 of the plan for a page that already owns the topic (the "one home per topic" convention, section 1.2). If one does, tell me and ask whether to extend that page instead. Choose the part from the purposes in section 1 and the folder from section 1 of `write-doc.md`. If the part is not clear, ask me with the `ask_user` tool.
   - **No entry, but the page exists:** **update** it as above, and add its entry to the plan (step 9) so that the plan stays the single place for each page.

   For an entry that exists, read from its line to the next `- **P` line: the heading line (page id, file name, title and status), the section bullets and the Brief. Match a named scope to the entry's section bullets (for example `Find the Modern UI version`); if it matches none, or the page differs from the bullets, say so and ask me. Also read the heading of its part (`### Part N`) and the `_Purpose:` line under it.
2. Read `.agents/rules/write-doc.md`. Then list `.agents/rules/doc-guide/` and read the files that apply, each completely, to its last line:
   - New page: every file except `slots.md`, which is read on demand.
   - Update: every file except `slots.md`, and except `examples.md` when the change touches no example or code block, and `media.md` when it touches no image, diagram or screenshot and does not describe what the user sees in the Modern UI (a research screenshot may be needed for that, as step 4 describes).

   A file can be longer than one tool read returns: read it in line ranges until its last line. A read that is cut off or truncated is not a complete read: continue to the last line, or search the file for the headings you need and read those sections whole. Section numbers 0 to 9 stay the same across the files. The claims file is the exception: read it by row, as above. In the final summary, list each rules and plan file as read in full or by section, with the section numbers. In update mode, read only the scoped sections of the existing page when a scope is given; otherwise, read the whole page in `documentation/modules/ROOT/pages/`.
   Apply the length check of `write-doc.md` section 0 before you write anything: if the page may become very long, stop and ask me.
3. Use the reference material for the section(s) being written or updated, from `.agents/reference/` and, for the host side, from `zm-x-web/.agents/zimlet/reference/zimlet.md`, which names the host file for each topic, to find what to check, as `doc-guide/claims.md` section 7 describes. For a scoped update, do not read unrelated sources. Check claims in the real code, including the template, `zimbra-zimlet-personal-notes`, `shims.js` and `zimlet-slots.yml` where applicable. For examples, take the source in the order `doc-guide/examples.md` section 4 gives. Also read other references when the relevant sources do not cover the section.

4. Ask for screenshots for research before you write unless its for an example you are writting for documentation, as "Screenshots: ask first, then add" in `doc-guide/media.md` section 5 describes. Do this before step 5, and state my answer in the summary.

### Write (steps 5 and 6)

5. Write or edit the page in `documentation/modules/ROOT/pages/`, section by section. Put examples, images and diagrams in the folders listed in section 2 of the plan. Look up each claim in the open claims file (`.agents/plans/zimlet-documentation-claims.md`) before you check it, and audit each section's claims before you start the next, as `doc-guide/claims.md` section 7 describes.
   Add a screenshot only as the same section of `doc-guide/media.md` describes, and list each one in the summary as added to the page, research only or skipped.
6. Create mode, or a page that is not in the navigation: add the page to `documentation/modules/ROOT/nav.adoc` (create the file if it does not exist), in the group of its part. Update mode: change `nav.adoc` only if a page or section title changed.

### Check (steps 7 and 8)

7. Rules check, before the claim ledger: run the checks of `doc-guide/finish.md` ("Rules check") and put each answer, with its one line of evidence, in the summary under "Rules check". Then check the claim ledger for the sections being written or updated, including unchanged text that the edit touches or depends on, as `doc-guide/claims.md` section 8 describes. For a scoped update, do not re-audit unrelated sections.
8. Confirm the claims with me, as the section "Confirm unverified claims with the user" of `.agents/rules/doc-guide/claims.md` describes. Ask one claim at a time with the `ask_user` tool, and record every answer in the summary.

### Finish (steps 9 and 10)

9. Update the plan. For a page with no entry, add one in section 1 under the part you chose, in the format of the other entries: the heading line (`- **P<id> `<file name>` – <title>** (Drafted)`), the section bullets of the page you wrote and a Brief. Take the next free id of that part; a child page nests under its parent's id (`P12.7`, `P12.1.13`). For a page with an entry, update the entry when the page's sections changed. Create mode sets the page to `Drafted`. Update mode leaves `Drafted` as is, and resets `Reviewed` to `Drafted` because the page changed. Never set `Reviewed`.
10. Run the build and preview checks as `doc-guide/finish.md` ("Build and preview") describes. Do not set `Reviewed` yourself. Then delete the staged screenshots, as "Clean up" in `doc-guide/media.md` describes.

Record gaps as you find them, as `doc-guide/finish.md` ("Record gaps") describes.

Do not commit. At the end, state the mode used, list the sources used, the sections changed, the rules check of step 7, the claim ledger, my answer for each claim you asked about in step 8, and any gaps found in the plan or sources, with the `zimlet-known-issues.md` entries you added or changed. Then print the claims that were found or touched in this session as a table of claim id (`-` for a verified claim with no row), page and section id, claim, severity and status (added, updated, removed after verification or left open). Write "None" if there are none.
