# Rules for reviewing Zimlet documentation

These rules say how to judge a page and how to report. The writing rules are in [write-doc.md](./write-doc.md), and the topic rules are in [doc-guide/](./doc-guide/). This file points to them by section and file and does not repeat them. The steps for carrying out a review are in the `review-doc` prompt. A review is run on request, and it is independent of the person who wrote the page.

## 1. Reviewer role

- Check whether the page is true, first. A page that reads well and is wrong fails.
- Do not trust the writer's summary, ledger or evidence. Audit the claims yourself.
- Do not edit the page, its examples or its images. Report findings; the writer fixes them. The only files you may change are the plan, where you set the page status in section 1, and the [open claims](../plans/zimlet-documentation-claims.md), where you add or update rows as section 2 describes.
- Review the whole page, or only the sections you are given, and anything those sections depend on.
- Report only what you confirmed. Say what you could not check instead of guessing.

## 2. Claim audit

Audit every claim on the page with the method in [doc-guide/claims.md](./doc-guide/claims.md) section 7: the same definition of a claim, the same evidence rules and the same statuses. Do it independently, from the code and from running the item with the [zimlet-doc-verify](../skills/zimlet-doc-verify/SKILL.md) skill.

- List every claim in a ledger: claim, kind, evidence, status.
- Read the code for each statement about behaviour. Run each command and example with the skill.
- Before you add or change a row for a claim, look it up in [open claims](../plans/zimlet-documentation-claims.md) as [doc-guide/claims.md](./doc-guide/claims.md) section 7 describes. An open row for the same claim is updated, not duplicated.
- Compare each row in [open claims](../plans/zimlet-documentation-claims.md) for the page with the ledger. A claim you could run must not stay `Unverified`: run it. If it is confirmed, remove the row and say so in the report. If it is wrong, set `Disproved` with the evidence and keep the row until the page is fixed. A claim you could not run needs its own row with a section id, a `To verify` step and a severity (doc-guide/claims.md section 2). Add a row when you find an unverifiable claim that has none.
- Check that the page has no `Unverified` admonition or other verification note, and that each row's section id exists in the page.

| Ledger result | Severity |
|---|---|
| `Disproved`: the code or a run shows the page is wrong | Blocking |
| `Unverified` and no row in the open claims file | Blocking |
| `Unverified` with its own complete row (section id, `To verify`, severity) | None. List it in the report. |
| Confirmed in the ledger, but its row is still in the open claims file | Minor |
| A row with a missing or wrong section id, or an `Unverified` admonition left in the page | Minor |
| An example that fails, or is not the file the page shows | Blocking |

## 3. Other checks

Each topic has its own rule file in [doc-guide/](./doc-guide/). Read each file named below in full before you review the page, as the writing rules do, and judge the page against the sections named. Read [slots.md](./doc-guide/slots.md) only when the page documents a slot or `invokePlugin` extension point. The table says what to check; the rule files say what the rules are.

| Rule file | Sections | Check on the page |
|---|---|---|
| [write-doc.md](./write-doc.md) | 2 | Writing, terms, scope, links, the next-step link, and no secrets, private names or estimates. The page matches its entry (sections and brief) in [zimlet-documentation-plan.md](../plans/zimlet-documentation-plan.md) and the purpose of its part (section 2, "Match the page to its part"). |
| [doc-guide/types.md](./doc-guide/types.md) | 3 | Page contents match its type. |
| [doc-guide/examples.md](./doc-guide/examples.md) | 4 | Examples are files in `examples/`, original, minimal, and disclose any simplification. |
| [doc-guide/media.md](./doc-guide/media.md) | 5 | Diagrams and images follow the layout, size and alt text rules, and are readable in the rendered page. |
| [doc-guide/accessibility.md](./doc-guide/accessibility.md) | 6 | The page meets the accessibility rules. |
| [doc-guide/style.md](./doc-guide/style.md) | 9 | The page follows the style rules. |
| [doc-guide/finish.md](./doc-guide/finish.md) | 8, "Rules check" | Answer each point of the rules check yourself, from the page. A point the page does not meet is a finding. |
| [doc-guide/slots.md](./doc-guide/slots.md) | whole file, on demand | When the page documents a `ZimletSlot` or `invokePlugin` extension point, it follows the slot rules. |

Site checks, done in the preview:

- `npm run build:docs` finishes with no errors and no warnings for the whole site.
- The page, its navigation entry, images, diagrams and examples show the latest text. In an updated page, each changed section shows the new text and the others are unchanged.
- Every link on the page works, except a link to a page that is planned in `zimlet-documentation-plan.md` and not written yet (Antora logs `target of xref not found` for it; this is expected and is not a finding). None redirects to a different path, returns 404, or points to a `file://` URL or a local path. Pages are served under `/documentation/` with `.html` in the name. `documentation/serve.json` is unchanged unless the review is about it.

## 4. Severity

| Level | Meaning | Examples |
|---|---|---|
| Blocking | The page must not be marked `Reviewed` with this present. | A contradicted claim, or an unverifiable claim with no row in the open claims file; a failing example; a build error or warning; a broken, redirecting or local link; an unreadable diagram; a failed accessibility rule; content from a later part; a secret or a private name. |
| Minor | The page works but a rule is not fully met. | Wording, a missing caption, an overlong example, a term used two ways. |

When unsure between the two levels, choose Blocking.

## 5. Report and status

Give the report in this order:

1. A header line: page id, scope, date and the verdict (`Pass` or `Fail`).
2. The claim ledger.
3. What you ran: each command with its result, and the checks you could not run and why.
4. The unverified claims found or touched in this review: the rows you added, removed after verification or left open, with claim id, section id, severity and status.
5. A table of findings: number, severity, location (file and section heading), what is wrong, evidence and the fix to apply. Write "None" if there are none.

Verdict and status:

- `Pass` means no Blocking finding. Set the page to `Reviewed` in section 1 of the plan. Minor findings stay in the report.
- `Fail` means at least one Blocking finding. Leave the page as `Drafted`. If it was `Reviewed`, set it back to `Drafted`.
- Only a review sets `Reviewed`. A writer never does.
- Do not set a phase to `Done`; phase status follows the build order in `.agents/plans/zimlet-documentation-build.md`.
