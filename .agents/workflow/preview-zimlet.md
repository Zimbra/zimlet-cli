# Workflow for previewing a Zimlet in the Modern UI

Use this workflow to see what a Zimlet shows in a running Modern UI, for example to check a slot output. It loads the Zimlet from the `zimlet watch` dev server through the sideloader on the test server. The commands are in [cli-commands.md](../reference/cli-commands.md#development-loading-no-packaging).

The test server is `https://localhost:8080/`. The user must be signed in to it, and the browser must trust the certificates for ports 8080 and 8081.

## Prerequisites

- Node 24 (`nvm use 24`).
- A Zimlet folder with the code to preview. For a documentation example, use the scratch project at `${TMPDIR:-/tmp}/zimlet-verify`, with the example copied to `src/index.js`.
- The browser tools. The user has signed in to the test server in that browser.
- The sideloader Zimlet (`zm-modern-zimlets/zimlets/zimbra-zimlet-sideloader`) installed and enabled for the account. The sideloader is also reachable at the legacy `/sdk/zimlets` route.

## Steps

1. Start the dev server in the Zimlet folder, detached so it keeps running: `npx zimlet watch --port 8081`. Confirm that `curl -sk -o /dev/null -w "%{http_code}" https://localhost:8081/index.js` prints `200`.
2. Open `https://localhost:8080/integrations/sideloader`. If the sideloader is not in the Integrations menu, the sideloader Zimlet is not enabled for the account. Ask the user to enable it.
3. If the webpack dev overlay ("Compiled with problems") covers the page, take a fresh page read, click its close or Dismiss button once, and take a screenshot to confirm it is gone. If it is still there, ask the user to dismiss it. It can come back on every reload.
4. Enter a name for the Zimlet, keep the URL `https://localhost:8081/index.js`, and press Load Zimlet. The status must show `Running`.
5. Open the screen or message that the claim is about and check what the Zimlet shows. Quote the console line `[ZimletSideLoaderSDK "<name>"]: Loaded successfully from ...` and describe what appears.
6. Clean up. Untick "Persist on Reload" for the test entry (it is stored in the `localStorage` key `zimlets-persistance`) so it does not load again on every reload. Stop the `zimlet watch` process on port 8081.

## When to stop and ask the user

Stop, and ask the user to unblock it, when any of these happens. Do not try other workarounds, hidden keystrokes or other URLs while the page is blocked.

- A certificate warning appears on port 8080 or 8081 (`ERR_CERT_AUTHORITY_INVALID`). The user opens the URL in the browser window, chooses Advanced, then Proceed to localhost (unsafe).
- A login page appears. The user signs in. Never type credentials.
- The overlay or another screen keeps blocking the page.

## Related

- [cli-commands.md](../reference/cli-commands.md#development-loading-no-packaging) explains the `zimlet watch` command and the dev URL.
