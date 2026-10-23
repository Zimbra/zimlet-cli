# Rules for finishing a Zimlet documentation page

Section 8 of the writing rules in [write-doc.md](../write-doc.md). Read it in full together with that file, before the rules check. The section numbers are the same as in `write-doc.md`.

## 8. Finishing a page

The conditions for a finished page are in section 8 of [claims.md](./claims.md).

### Rules check

Run `node .agents/scripts/check-doc-style.mjs <page>` and fix every finding. Then read the page once more, sentence by sentence, and answer each point with one line of evidence (a line number, a command result or "not applicable").

- Structure: one `=` title and an introduction with a summary, when to read the page and why (section 2 of `write-doc.md`) that does not repeat the sections; headings in sentence case; the page ends with a link to the next step; the page matches its part (sections 2 and 3).
- Style: nothing talks about the page, its tables, links or examples; no sentence is longer than about 25 words; at most one admonition per section; no internal repository, tool or path names (sections 9 and 2).
- Ownership: each procedure, command or option that another page in section 1 of the plan owns is linked, not restated (section 2). Name the owning page.
- Terms and links: each term is explained at first use and linked to the concept page that owns it, or to the glossary when it has no concept page (section 2 of `write-doc.md`); every link text says where it goes; a link to an unwritten planned page has no section anchor (sections 2 and 6).
- Examples: each is in `examples/`, includes `createElement`, uses shimmed imports only and registers inside `init()`; visible text is a constant label with a comment to use localization; each other simplification has a `NOTE` with its consequence ([examples.md](./examples.md)).
- Accessibility and media: each table has a header row; each code block has a language ([accessibility.md](./accessibility.md)); each image or diagram has quoted alt text, a text version of the facts and no text under 14 px ([media.md](./media.md)).
- Claims: every `Unverified` row of this change says that the user was asked and what the user answered (`Not sure`, `Verify later`, or the batch question). No row says that the user was not asked. If one does, stop and ask the user before you finish ([claims.md](./claims.md) section 7).
- Safety: no credentials, hostnames, customer data or private repository names; no mention of Classic UI except where the plan allows (section 2).

### Build and preview

Run the site checks in section 3 of [review-doc.md](../review-doc.md) ("Site checks") for the page, if the toolchain is installed, and fix everything they find. Do this last, after the final edit. Ignore `target of xref not found` for a planned page that is not written yet (section 2).

Leave `documentation/build` in place after the build. The preview server (`npm run preview:docs`, port 3000) serves that folder and fails when it is gone. If you removed or changed it, run `npm run build:docs` again as the last command so the served site is current.

### Record gaps

When the code or references show a mismatch between the sources the guide relies on (for example the CLI and the host disagree, a reference file is wrong, or a documented behaviour does not happen), add or update an entry in [zimlet-known-issues.md](../../../../zm-modern-zimlets/.agents/reference/zimlet-known-issues.md) in `zm-modern-zimlets` under the matching heading. Say how it was checked and the fix, and remove the entry when it is fixed. Do not record temporary problems of the session, such as a leftover scratch state or a missing local tool.
