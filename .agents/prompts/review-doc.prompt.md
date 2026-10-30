---
name: review-doc
description: Independently audit a page, or sections of a page, of the Zimlet developer guide for accuracy and against the documentation rules, and set its status
agent: agent
model: Claude Sonnet 5.5
---

Review page `${input:pageId}` (for example `P03`) of the Zimlet developer guide. Optional scope: `${input:scope:whole page, or the section names to review}`.

The plan is `.agents/plans/zimlet-documentation-plan.md`, and the open claims are in `.agents/plans/zimlet-documentation-claims.md`. The review rules are in `.agents/rules/review-doc.md`. They name the claim audit, the other checks, the severity levels, the report format and the status rules; follow them and do not restate them here. Do not edit the page, its examples or its images, and do not commit.

1. Read `.agents/rules/review-doc.md`, `.agents/rules/write-doc.md`, and every `.md` file in `.agents/rules/doc-guide/` except `slots.md` (list the folder first), each to its last line. Read `slots.md` too, to its last line, only when the page documents a `ZimletSlot` or a data key. Run `node .agents/scripts/check-doc-style.mjs <page>` and treat each finding as a candidate issue. Read the page's entry (plan section 1: part purpose, section list and brief), and the page in `documentation/modules/ROOT/pages/` with its examples and images.
2. Build the claim ledger for the page or the scope, as `review-doc.md` section 2 describes.
3. Audit every claim yourself. Read the real code for statements about behaviour. Run each command and example with the `zimlet-doc-verify` skill (`.agents/skills/zimlet-doc-verify/SKILL.md`), in a scratch project outside the repository, and use the real output.
4. Run `npm run build:docs` and note every error and warning.
5. Start `npm run preview:docs` (use the address it prints). Open the home page, find the page's navigation entry, follow every link on the page, and check the changed text, the included examples and the images. Screenshot each diagram and image at normal zoom.
6. Check the page against the other checks in `review-doc.md` section 3.
7. Stop the preview and delete the scratch project.
8. Check each claim, then update the open claims file (`.agents/plans/zimlet-documentation-claims.md`) for the page as `review-doc.md` section 2 describes. That section lists open claims only.
9. Write the report in the format of `review-doc.md` section 5, and set the status as it says. After the report, print the unverified claims found or touched in this session as a table of claim id, page and section id, claim, severity and status (added, removed after verification or left open). Write "None" if there are none.
