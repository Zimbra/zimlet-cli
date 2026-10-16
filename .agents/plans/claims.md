# Claims

This is the single record of claim verification for the Zimlet developer guide. It holds every claim that is verified and every claim that is not: claims that could not be run or confirmed in the code, for example because they need a Zimbra server or a Modern UI session, and claims that someone has confirmed. It replaces the `Unverified` admonitions that used to sit inside the pages. Pages state claims as normal text; this file is where their status is kept.

Before a writer or reviewer marks a claim as unverified, they check this file for a `Verified` row for the same claim. Reuse it instead of adding a new row. The process is in [write-doc.prompt.md](../prompts/write-doc.prompt.md).

Rules for adding, updating and closing rows are in [write-doc.md](../rules/write-doc.md) section 2 and [review-doc.md](../rules/review-doc.md) section 2.

## How to use this file

- One row per claim. Do not group claims.
- **Page / section id** is the page id from the [plan](./zimlet-documentation-plan.md) plus the explicit AsciiDoc id of the section that holds the claim, for example `P03#from-source-to-modern-ui`. Give the section an explicit id in the page (`[#from-source-to-modern-ui]` above its heading) so the link survives a heading rename.
- **Claim ID** is `UC-<page id>-<nn>`, for example `UC-P03-01`. Ids are permanent. Do not reuse an id.
- **What was checked** says what you did confirm (for example "the example builds with `zimlet build`"). **To verify** is a step someone with the right access can follow, with the result to expect.
- Do not delete a row when it is closed. Change its status and fill in **Closed on**.
- **Found by** is who found the claim (`write-doc`, `review-doc` or `user`) and the date.

### Severity

Severity is the impact on a reader if the claim turns out to be wrong. It is not the review severity of `review-doc.md`.

| Severity | Meaning |
|---|---|
| High | A reader following the page would fail the main task or lose time on a wrong step: a core path, a command, a deploy or a version rule. |
| Medium | A secondary detail, an expected message or a behaviour that the reader can recover from. |
| Low | A cosmetic or rarely hit detail. |

### Status

| Status | Meaning |
|---|---|
| Unverified | Not yet run or confirmed. |
| Verified | Run or confirmed. Say how in **Evidence**. A user who confirms a claim counts as confirmed: set **Found by** to `user` and say in **Evidence** what the user confirmed. |
| Disproved | Run or confirmed and found wrong. Fix the page and record the fix in **Evidence**. |

## Claims

| Claim ID | Page / section id | Claim | What was checked | To verify | Severity | Status | Found by | Closed on | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| UC-P03-01 | P03#from-source-to-modern-ui | A deployed Zimlet is loaded by the Modern UI, which calls its factory with `context` and then `init()`, and the output appears in its slot. | Each part was checked in the code of the `zimlet` tool, the Zimbra server and the Modern UI. The whole path was not run end to end. | Deploy the zip on a test server, enable the Zimlet for a test account and open the Modern UI. The browser console shows a message like `[ZimletSDK "serverConsolidatedZimlets"]: Loaded successfully from ...`, and the Zimlet's output appears in its slot. | High | Verified | write-doc, 2026-10-16 | 2026-10-16 | Verified manually by the user. The user deployed the Zimlet from the Zimbra Admin Console, following [Managing Zimlets from the Administration Console](https://zimbra.github.io/documentation/zimbra-10/adminguide.html#_managing_zimlets_from_the_administration_console), and reports that it works. The console message and slot output were not recorded separately. |
| UC-P03-02 | P03#factory-and-init | The example entry file adds a greeting at the top of a message body through `slot::message-body-top`. | The example builds with `zimlet build` in a scratch project. It was not loaded in a running Modern UI. | Load the Zimlet with the sideloader and open a message. The greeting appears at the top of the message body. | Medium | Unverified | write-doc, 2026-10-16 | | |
| UC-P03-03 | P03#try-it-while-you-develop | While `zimlet watch` runs, saving a file restarts the Zimlet in the Modern UI without a page reload. | `zimlet watch` serves `index.js` over HTTPS on `localhost` and rebuilds after a save. The restart in a running browser was not observed. The code path was checked: the sideloader loads the URL, hot reload runs the entry again, and the Modern UI shuts down and starts the Zimlet again. | Load the Zimlet in the sideloader, edit a file and save it. The console shows ` 🔄 Zimlet <name> restarted.` and the change appears without a page reload. | Medium | Unverified | write-doc, 2026-10-16 | | |
