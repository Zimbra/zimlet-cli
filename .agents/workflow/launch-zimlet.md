# Workflow for launching a Zimlet from a dev server in the Modern UI

Use this workflow when the user needs to load a Zimlet from the `zimlet watch` dev server into a running Modern UI, for example to check what a slot shows or to capture screenshots. The commands are in [cli-commands.md](../reference/cli-commands.md#development-loading-no-packaging).

The agent starts and stops the dev server and gets the browser to trust its certificate with the user. The user does everything in the Modern UI. The agent never opens, reads or captures the Modern UI.

## Prerequisites

- Node 24 (`nvm use 24`).
- A Zimlet folder with the code to serve. For a documentation example, use the scratch project at `../zimlet-verify` (a sibling of this repository): run the "Scratch project" and "Example file or folder" sections of the [zimlet-doc-verify](../skills/zimlet-doc-verify/SKILL.md) skill.
- A Modern UI test instance where the user is signed in, with the sideloader Zimlet (`zm-modern-zimlets/zimlets/zimbra-zimlet-sideloader`) enabled for the account.

## Steps for the agent

1. Pick the port. Check that 8081 is free with `lsof -nP -iTCP:8081 -sTCP:LISTEN`. If another process uses it (often the dev server of another Zimlet that the user is working on), do not stop it: use the next free port (8082, 8083, ...). Use that port, called `<port>` below, in every URL.
2. Start the dev server in the Zimlet folder, detached so it keeps running: `npx zimlet watch --port <port>`. Check `node -v` first, because a detached shell can start on another Node version. Confirm that `curl -sk -o /dev/null -w "%{http_code}" https://localhost:<port>/index.js` prints `200`. Note the PID of the process that listens on the port. If the server does not answer, stop it, report the output and do not go on.
3. Open `https://localhost:<port>/index.js` in the user's browser so that the browser can trust its certificate: run `open https://localhost:<port>/index.js` on macOS, or give the user the URL on another system. A trusted certificate is stored per browser, so it must be the browser the user uses for the Modern UI.
4. Ask the user with the `ask_user` tool to accept it: choose Advanced, then Proceed to localhost (unsafe), until the page shows JavaScript code. Offer the choices `Done` and `It did not open or is blocked`. Wait for the answer. On the second choice, report what the user sees and stop. Do not try other URLs or workarounds.
5. Tell the user what to load: in the sideloader (`/integrations/sideloader`, or `/sdk/zimlets` if that page is Not Found), enter the Zimlet name you give and the URL `https://localhost:<port>/index.js`, press Load Zimlet and wait for the status `Running`. Say that Persist on Reload should be unticked when they finish. Then hand over, as the caller of this workflow describes.
6. When the work ends, stop only the `zimlet watch` process that you started, with `kill <PID>`. Never stop a dev server that you did not start.

## Related

- [cli-commands.md](../reference/cli-commands.md#development-loading-no-packaging) explains the `zimlet watch` command and the dev URL.
