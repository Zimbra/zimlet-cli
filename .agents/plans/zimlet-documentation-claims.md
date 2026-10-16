# Zimlet documentation: open claims

This file belongs to the [Zimlet documentation plan](./zimlet-documentation-plan.md).

This file lists the open claims of the Zimlet developer guide: claims that could not be run or confirmed in the code, for example because they need a Zimbra server or a Modern UI session, and `Disproved` claims whose page fix is pending. Pages state claims as normal text; this file is where their open status is kept. It replaces the `Unverified` admonitions that used to sit inside the pages. A claim that is verified is not kept here.

Before a writer or reviewer adds a row, they check this file for an open row for the same claim and update that row instead of adding a second one. The process is in [write-doc.prompt.md](../prompts/write-doc.prompt.md).

Rules for adding, updating and removing rows are in [doc-guide/claims.md](../rules/doc-guide/claims.md) section 2 and [review-doc.md](../rules/review-doc.md) section 2.

## How to use this file

- One row per claim. Do not group claims.
- **Page / section id** is the page id from section 1 of the plan plus the explicit AsciiDoc id of the section that holds the claim, for example `P03#from-source-to-modern-ui`. Give the section an explicit id in the page (`[#from-source-to-modern-ui]` above its heading) so the link survives a heading rename.
- **Claim ID** is `UC-<page id>-<nn>`, for example `UC-P03-01`. Use the next number after the highest one in this table for that page.
- **What was checked** says what you did confirm (for example "the example builds with `zimlet build`"). **To verify** is a step someone with the right access can follow, with the result to expect.
- Remove a row when its claim is closed: when it is confirmed (`Verified`), when it is `Disproved` and the page is fixed, or when its section is removed from the page. The history is in version control. Say in the summary what you removed and why.
- **Found by** is who found the claim (`write-doc`, `review-doc` or `user`) and the date.

## Severity

Severity is the impact on a reader if the claim turns out to be wrong. It is not the review severity of `review-doc.md`.

| Severity | Meaning |
|---|---|
| High | A reader following the page would fail the main task or lose time on a wrong step: a core path, a command, a deploy or a version rule. |
| Medium | A secondary detail, an expected message or a behaviour that the reader can recover from. |
| Low | A cosmetic or rarely hit detail. |

## Status

| Status | Meaning |
|---|---|
| Unverified | Not yet run or confirmed. |
| Verified | Run or confirmed, including confirmed by the user. A verified claim is not kept in this file: remove its row and say in the summary how it was verified. |
| Disproved | Run or confirmed and found wrong. Keep the row until the page is fixed, and say in **Evidence** that the fix is pending. Remove the row when the page is fixed. |

## Claims

| Claim ID | Page / section id | Claim | What was checked | To verify | Severity | Status | Found by | Closed on | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| UC-P01-02 | P01#who-this-guide-is-for | A Zimlet can use another framework (for example Vue or Svelte) by bundling it and mounting it into an element that the Zimlet returns from a handler. | Not built or run. The claim comes from the internal reference notes only. The user was asked and answered `Not sure`. The claim is not on the page; the user chose to leave it out until it is confirmed. | Create a Zimlet that bundles a small framework, mounts it into an element returned from a slot handler, load it with `zimlet watch` in the sideloader and open the slot's screen. Expect the framework's output in the slot. Then add the statement to P01 and P25. | Low | Unverified | user, 2026-10-19 |  | Left out of the page until verified. |
