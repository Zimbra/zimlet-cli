---
name: write-doc
description: Write a new page, or add or update sections of an existing page, of the Zimlet developer guide from .agents/plans/zimlet-documentation-plan.md
agent: agent
model: Claude Sonnet 5
---

Work on page `${input:pageId}` (for example `P03`) of the Zimlet developer guide. Optional scope: `${input:scope:whole page, section names to add or update, or specific plan/reference changes to apply}`.

The plan is `.agents/plans/zimlet-documentation-plan.md`. Follow its section 2 and do not restate its content or the rules here.

1. Read the plan and find the page's status in section 1, then pick the mode:
   - `Not started`: **create** the whole page. Check its dependencies as the plan's section 6 describes. If they are not met, stop and tell me.
   - `Drafted` or `Reviewed`: **update** the existing page. If a scope is given, change only the named sections; otherwise, change sections that differ from the plan's section list. Keep all other text as it is.
   - For a scoped update, inspect only the named sections and the plan/reference material relevant to them; do not scan or re-audit unrelated sections. Where a changed plan or reference alters a fact, search the whole page for every place that states it, including section text, diagram sources and rendered diagrams, alt text, captions, tables and example files, and update each one or say in the summary why it stays. If the scope identifies a changed plan or reference, use it to update only the affected sections. For example, if new reference material is added and informed by user, consider correcting wording, practical examples etc which should now be corrected as per new reference.
   - For non scoped update, verify each section being updated against the current plan and the code behind it, as `write-doc.md` section 7 describes. Revise its wording or examples as needed, and update the plan if the code or references show its section list or brief is out of date.
2. Read `.agents/rules/write-doc.md` and the relevant parts of the plan: section 1 for the page's entry (part purpose, section list and brief). In update mode, read only the scoped sections of the existing page when a scope is given; otherwise, read the whole page in `documentation/modules/ROOT/pages/`.
3. Use the reference material for the section(s) being written or updated, from `.agents/reference/` and `zm-x-web/.agents/zimlet/reference/`, to find what to check, as `write-doc.md` section 7 describes. For a scoped update, do not read unrelated sources. Check claims in the real code, including the template, `zimbra-zimlet-personal-notes`, `shims.js` and `zimlet-slots.yml` where applicable. For registration examples, follow the pattern and recommended Zimlet in `.agents/reference/zimlet-registration-patterns.md` and its YAML. Also read other references when the relevant sources do not cover the section.
4. Write or edit the page in `documentation/modules/ROOT/pages/`, section by section. Put examples, images and diagrams in the folders listed in section 2 of the plan. Look up each claim in `.agents/plans/claims.md` before you check it, and audit each section's claims before you start the next, as `write-doc.md` section 7 describes.
5. Create mode only: add the page to `documentation/modules/ROOT/nav.adoc` (create the file if it does not exist). Update mode: change `nav.adoc` only if a page or section title changed.
6. Check the claim ledger for the sections being written or updated, including unchanged text that the edit touches or depends on, as `write-doc.md` section 8 describes. For a scoped update, do not re-audit unrelated sections.
7. Confirm the claims with me. For each claim you wrote or changed in this session that does not reuse a `Verified` row, one claim per question, ask me with the `ask_user` tool. Show the claim id, the page and section id, and the claim text. Offer the choices `Yes`, `No` and `Not sure`, and no others. Ask about the claims one at a time.
   - `Yes`: the claim is correct. Record it in `.agents/plans/claims.md` as a `Verified` row: **Found by** `user` with today's date, **What was checked** that the user confirmed it, and **Evidence** that the user confirmed it is correct. If the claim already has an `Unverified` row, change that row to `Verified`. Do not add an `Unverified` row.
   - `No`: ask me for the correct context, as free text, and offer the choice `Update it later`.
     - If I give the correct context, change the claim in the page to match it, keep the section id, and check it again under step 6. Do not add a row.
     - If I choose `Update it later`, leave the text in the page and add a row with status `Disproved`. Leave **Closed on** empty, and in **Evidence** say that the user found the claim wrong and that the page fix is pending. Fix the page, and set the row to `Verified` with the evidence, once the correct context is known.
   - `Not sure`: leave the text in the page and add a row with status `Unverified`. Give it a `To verify` step that someone with the right access can follow.
   - Use the next free claim id for each new row, and fill every column as `write-doc.md` section 2 describes. In **What was checked**, say that the user was asked and what the user answered.
   - Record every answer in the summary.
8. Update the statuses in the plan as its section 6 describes. Create mode sets the page to `Drafted`. Update mode leaves `Drafted` as is, and resets `Reviewed` to `Drafted` because the page changed. Never set `Reviewed`.
9. Run the build and preview checks of the `review-doc` prompt (its build and preview steps) for your page, if the toolchain is installed, and fix everything they find. Do this last, after your final edit.
   A separate, independent review is run with the `review-doc` prompt on request. Do not set `Reviewed` yourself.

Do not commit. At the end, state the mode used, list the sources used, the sections changed, the claim ledger, my answer for each claim you asked about in step 7, and any gaps found in the plan or sources. Then print the claims in `.agents/plans/claims.md` that were found or touched in this session, verified and unverified, as a table of claim id, page and section id, claim, severity and status (added, reused, closed or left open). Write "None" if there are none.
