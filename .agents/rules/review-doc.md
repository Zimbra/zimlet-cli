# Rules for reviewing Zimlet documentation

These rules say how to judge a page and how to report. The writing rules are in [write-doc.md](./write-doc.md); this file points to them by section and does not repeat them. The steps for carrying out a review are in the `review-doc` prompt. A review is run on request, and it is independent of the person who wrote the page.

## 1. Reviewer role

- Check whether the page is true, first. A page that reads well and is wrong fails.
- Do not trust the writer's summary, ledger or evidence. Audit the claims yourself.
- Do not edit the page, its examples or its images. Report findings; the writer fixes them. The only file you may change is the plan, to set the page status (section 5).
- Review the whole page, or only the sections you are given, and anything those sections depend on.
- Report only what you confirmed. Say what you could not check instead of guessing.

## 2. Claim audit

Audit every claim on the page with the method in [write-doc.md](./write-doc.md) section 7: the same definition of a claim, the same evidence rules and the same statuses. Do it independently, from the code and from running the item with the [zimlet-doc-verify](../skills/zimlet-doc-verify/SKILL.md) skill.

- List every claim in a ledger: claim, kind, evidence, status.
- Read the code for each statement about behaviour. Run each command and example with the skill.
- Compare each `Unverified` admonition with the ledger. A claim you could run must not be marked `Unverified`. A claim you could not run needs its own admonition with a `To verify:` step (write-doc.md section 2).

| Ledger result | Severity |
|---|---|
| `Contradicted`: the code or a run shows the page is wrong | Blocking |
| `Cannot verify` and no `Unverified` admonition on the page | Blocking |
| `Cannot verify` with its own admonition and `To verify:` step | None. List it in the report. |
| `Verified (run)` or `Verified (code)`, but the page marks that same claim `Unverified` | Minor |
| An example that fails, or is not the file the page shows | Blocking |

## 3. Other checks

Judge the page against these sections of [write-doc.md](./write-doc.md). Each point is a check; the rules are there.

| Check | Rule |
|---|---|
| Page contents match its type | section 3 |
| Examples are files in `examples/`, original, minimal, and disclose any simplification | section 4 |
| Diagrams and images follow the layout, size and alt text rules, and are readable in the rendered page | section 5 |
| The page meets the accessibility rules | section 6 |
| Writing, terms, scope, links, the next-step link, and no secrets, private names or estimates | section 2 |
| The page matches its section list and brief in [zimlet-documentation-plan.md](../plans/zimlet-documentation-plan.md), and the purpose of its part | section 2 ("Match the page to its part") |

Site checks, done in the preview:

- `npm run build:docs` finishes with no errors and no warnings for the whole site.
- The page, its navigation entry, images, diagrams and examples show the latest text. In an updated page, each changed section shows the new text and the others are unchanged.
- Every link on the page works. None redirects to a different path, returns 404, or points to a `file://` URL or a local path. Pages are served under `/documentation/` with `.html` in the name. `documentation/serve.json` is unchanged unless the review is about it.

## 4. Severity

| Level | Meaning | Examples |
|---|---|---|
| Blocking | The page must not be marked `Reviewed` with this present. | A contradicted or unflagged unverifiable claim; a failing example; a build error or warning; a broken, redirecting or local link; an unreadable diagram; a failed accessibility rule; content from a later part; a secret or a private name. |
| Minor | The page works but a rule is not fully met. | Wording, a missing caption, an overlong example, a term used two ways. |

When unsure between the two levels, choose Blocking.

## 5. Report and status

Give the report in this order:

1. A header line: page id, scope, date and the verdict (`Pass` or `Fail`).
2. The claim ledger.
3. What you ran: each command with its result, and the checks you could not run and why.
4. A table of findings: number, severity, location (file and section heading), what is wrong, evidence and the fix to apply. Write "None" if there are none.

Verdict and status:

- `Pass` means no Blocking finding. Set the page to `Reviewed` in section 1 of the plan. Minor findings stay in the report.
- `Fail` means at least one Blocking finding. Leave the page as `Drafted`. If it was `Reviewed`, set it back to `Drafted`.
- Only a review sets `Reviewed`. A writer never does.
- Do not set a phase to `Done`; phase status follows the plan's section 7.
