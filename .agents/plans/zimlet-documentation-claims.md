# Zimlet documentation: open claims

This file belongs to the [Zimlet documentation plan](./zimlet-documentation-plan.md).

This file lists the open claims of the Zimlet developer guide: claims that could not be run or confirmed in the code, for example because they need a Zimbra server or a Modern UI session, and `Disproved` claims whose page fix is pending. Pages state claims as normal text; this file is where their open status is kept. It replaces the `Unverified` admonitions that used to sit inside the pages. A claim that is verified is not kept here.

Before a writer or reviewer adds a row, they check this file for an open row for the same claim and update that row instead of adding a second one. The process is in [write-doc.prompt.md](../prompts/write-doc.prompt.md).

Rules for adding, updating and removing rows are in [doc-guide/claims.md](../rules/doc-guide/claims.md) section 2 and [review-doc.md](../rules/review-doc.md) section 2.

## How to use this file

- One row per claim. Do not group claims.
- **Page / section id** is the page id from section 1 of the plan plus the explicit AsciiDoc id of the section that holds the claim, for example `P03#from-source-to-modern-ui`. Give the section an explicit id in the page (`[#from-source-to-modern-ui]` above its heading) so the link survives a heading rename.
- **Claim ID** is `UC-<page id>-<nn>`, for example `UC-P03-01` or, for a child page, `UC-P43.1-01`. Use the next number after the highest one in this table for that page.
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
| UC-P06-02 | P06#create-from-template | `zimlet create default my-zimlet` creates the refreshed template (Hello World tab, `zimlet.label` in `en_US.json`, CLI `^19.0.0`). | Ran `zimlet create zimbra/zm-x-zimlet-template-default#PREAPPS-9862 my-zimlet` with CLI 19.0.0 on Node 24.18.0: install, `npm run build`, `npm run package` and `npm run lint` all exit 0, and the Zimlet loaded in the Modern UI (the user confirmed the tab and the Hello World page). The refresh is fixed on the branch `PREAPPS-9862` but is not merged to the default branch, so `zimlet create default my-zimlet` still creates the old template (CLI `^14.0.0`, label `TBD`). | After the branch is merged, run `zimlet create default my-zimlet` and compare `package.json` and `src/index.js` with the page. Expect `@zimbra/zimlet-cli` `^19.0.0` and the Hello World tab. | High | Unverified | write-doc, 2026-10-22 |  | Fixed but not merged. Until then, use `zimlet create zimbra/zm-x-zimlet-template-default#PREAPPS-9862 my-zimlet`. Remove this row after the merge check passes. |
| UC-P07-01 | P07#naming-rules | The Zimlet name must be unique among the Zimlets on the server, because the descriptor and the zip use it. | The `zimlet package --name` help text says "Globally unique name for your zimlet", and the name ends up in the descriptor and the zip file name (ran `zimlet package`). Server behaviour with two Zimlets of the same name was not checked. The user was asked and answered `Not sure`. | Deploy two different Zimlet packages with the same name to a test server and list the deployed Zimlets. Expect the second deployment to replace or conflict with the first, so only one Zimlet of that name exists. | Medium | Unverified | write-doc, 2026-10-22 |  | Source of the statement is the CLI help text. |
| UC-P43.6.4-01 | P43.6.4#usage-notes | `zimlets-initialized` is emitted about 500 ms after a bundle finishes loading, and again 500 ms after any later handler registration, so a listener can receive it many times. | Read `loadZimletByUrls`, `debouncedZimletsInitialized` and `createPlugins`. Not observed in a running Modern UI. The user was asked for the batch on 2026-10-23 and chose to verify later. | In the Modern UI, add `zimlets.on('zimlets-initialized', () => console.warn('initialized'))` in a dev Zimlet, then register a second handler later from the console. Expect one message after load and one more after the later registration. | Medium | Unverified | write-doc 2026-10-23 | | |
