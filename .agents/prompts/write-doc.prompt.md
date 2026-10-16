---
name: write-doc
description: Write a new page, or add or update sections of an existing page, of the Zimlet developer guide from .agents/plans/zimlet-documentation-plan.md
agent: agent
model: Claude Sonnet 5
---

Work on page `${input:pageId}` (for example `P03`) of the Zimlet developer guide. Optional scope: `${input:scope:whole page, section names to add or update, or specific plan/reference changes to apply}`.

The plan is `.agents/plans/zimlet-documentation-plan.md`. Follow its section 2 and do not restate its content or the rules here.

1. Read the plan and find the page's status in section 1, then pick the mode:
   - `Not started`: **create** the whole page. Check its dependencies as the plan's section 7 describes. If they are not met, stop and tell me.
   - `Drafted` or `Reviewed`: **update** the existing page. If a scope is given, change only the named sections; otherwise, change sections that differ from the plan's section list. Keep all other text as it is.
   - For a scoped update, inspect only the named sections and the plan/reference material relevant to them; do not scan or re-audit unrelated sections. Where a changed plan or reference alters a fact, search the whole page for every place that states it, including section text, diagram sources and rendered diagrams, alt text, captions, tables and example files, and update each one or say in the summary why it stays. If the scope identifies a changed plan or reference, use it to update only the affected sections. For example, if new reference material is added and informed by user, consider correcting wording, practical examples etc which should now be corrected as per new reference.
   - For non scoped update, verify each section being updated against the current plan and all relevant reference files; revise its wording or examples as needed, and update the plan if the references show its section list or brief is out of date.
2. Read `.agents/rules/write-doc.md` and the relevant parts of the plan: section 1 for the page's section list and section 3 for its brief. In update mode, read only the scoped sections of the existing page when a scope is given; otherwise, read the whole page in `documentation/modules/ROOT/pages/`.
3. Read the sources relevant to the section(s) being written or updated from `.agents/reference/` and `zm-x-web/.agents/zimlet/reference/`. For a scoped update, do not read unrelated sources. For any section that shows or explains registration, also read `.agents/reference/zimlet-registration-patterns.md` and the patterns it points to in its YAML, and build the example from the recommended Zimlet. Check relevant claims against the corresponding real code, including the template, `zimbra-zimlet-personal-notes`, `shims.js` and `zimlet-slots.yml` where applicable. Also read other references when the relevant sources do not cover the section.
4. Write or edit the page in `documentation/modules/ROOT/pages/`, section by section. Put examples, images and diagrams in the folders listed in section 2 of the plan. After each section, audit its claims and fix it before you start the next, as `write-doc.md` section 7 describes.
5. Create mode only: add the page to `documentation/modules/ROOT/nav.adoc` (create the file if it does not exist). Update mode: change `nav.adoc` only if a page or section title changed.
6. Check the claim ledger for the sections being written or updated, including unchanged text that the edit touches or depends on: every claim has a status, none is `Contradicted`, and every `Cannot verify` claim has its `Unverified` admonition. For a scoped update, do not re-audit unrelated sections.
7. Update the statuses in the plan as its section 7 describes. Create mode sets the page to `Drafted`. Update mode leaves `Drafted` as is, and resets `Reviewed` to `Drafted` because the page changed. Never set `Reviewed`.
8. Run the build and preview checks of the `review-doc` prompt (its build and preview steps) for your page, if the toolchain is installed, and fix everything they find. Do this last, after your final edit.
   A separate, independent review is run with the `review-doc` prompt on request. Do not set `Reviewed` yourself.

Do not commit. At the end, state the mode used, list the sources used, the sections changed, the items marked `Unverified`, the claim ledger, and any gaps found in the plan or sources.
