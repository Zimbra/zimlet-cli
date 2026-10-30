# Rules for diagrams and images in the Zimlet documentation

Section 5 of the writing rules in [write-doc.md](../write-doc.md). Read it in full together with that file.

## 5. Diagrams and images

- Prefer a diagram over a screenshot whenever the topic is structure, flow, sequence, lifecycle or relationships: how a Zimlet is built, packaged, served and loaded; the `init()` and plugin registration order; slot rendering; the server bundle path.
- Write diagrams as Mermaid text in `images/diagrams/<name>.mmd`, render them to SVG next to it, and embed the SVG. Commit both files; the page shows the SVG, the `.mmd` is the editable source. The Antora playbook has no diagram extension, so do not embed Mermaid blocks directly.
- A diagram shows one idea with about twelve nodes or fewer, uses the same plain terms as the text, flows left to right or top to bottom, and has a one-sentence introduction in the page and alt text that states the point of the diagram. No diagram may be the only place a fact appears.
- Keep diagrams, their alt text and their captions abstract. Show the steps and the flow in plain words, not the implementation. Do not put these in a diagram, alt text or caption: function or method names (such as `init()` or `factory(context)`), file or folder names (such as `src/index.js`), commands or flags, registration keys or slot ids, code, paths, hostnames or tokens. Name each step by what it does for the reader, such as "Sets it up". Put the exact names in the page text beside the diagram, where the reader looks them up, and link to the reference page for them. One exception: the lifecycle diagram of the factory page may name the factory and `init()`, because an author must know these two names to write the entry file.
- Lay a diagram out so it stays readable at the size the page shows it:
  - Keep it compact: the rendered SVG `viewBox` is at most about 900 px wide and 700 px tall. Check this in the generated `.svg` (`viewBox` and `max-width` at the top of the file). A long single row of nodes is shrunk by the page width until its text is unreadable; a long single column is taller than the screen.
  - Group nodes in labelled subgraphs (for example "On your machine", "Zimbra server", "Modern UI in the browser") and run each group left to right, with the groups stacked top to bottom, instead of one long chain.
  - Keep node text to about six words and edge labels to about three. Use plain words for both. Move longer explanations into the text.
  - Do not scale a diagram down with `width=`. If it does not fit at its natural size, split it or regroup it.
- Every diagram and image is readable in the rendered page at normal zoom: all text legible without zooming, nothing cut off, the order of the flow clear. A diagram that builds without errors can still be unreadable.
- Use a screenshot only for something a diagram cannot show, such as the real Modern UI layout or the About dialog. Save as PNG in `images/`. Prefer a screenshot of the whole application window, because it shows the context around the control. Crop only to remove names, email addresses, hostnames and tokens. Outline the control or text that the reader needs (see "Outline what matters" below). Give every image alt text and a caption in the page.
- Update or remove an image or diagram in the same change that alters what it shows.

### Screenshots: ask first, then add

Never invent a screenshot. You never capture one yourself: the user does, and you read it as research before you write the steps. Screenshots wait in the staging folder `.agents/tmp/screenshots/`, which Git ignores.

**Ask before you write.** Do this once, before you write the steps.
- List the sections you will write or update that describe steps the reader takes in the real Modern UI, the Admin Console or another screen (find, open, choose or read something on a screen). Do not ask for screenshots of commands, code or terminal output.
- Remove from the list each screen that an image in `documentation/modules/ROOT/images/` already shows in the same state as the end of the steps (search the folder and the `image::` lines of the pages). A screen shown in a different state, such as an empty form where the steps end with a filled table, stays on the list. Ask for a new capture of such a screen only when the existing image is outdated, cropped so tight that the context is lost, or unclear.
- If the list is empty, skip the question. Otherwise ask once with the `ask_user` tool, naming each section and the screen it needs, with the choices `I will provide screenshots`, `Prepare the screens, I will capture` and `Skip`.
- `I will provide screenshots`: the user already has or makes them. Create the staging folder if it does not exist (`mkdir -p .agents/tmp/screenshots`), then wait for the files as "Wait for the files" below describes and read them as "Read the screenshots" describes.
- `Prepare the screens, I will capture`: give the user the shot list and the capture checklist below. Create the staging folder if it does not exist. If a screen needs a dev Zimlet, first run the [launch workflow](../../workflow/launch-zimlet.md) with the example that screen shows (write or copy that example first if it does not exist yet), which starts the dev server and has the user trust its certificate. Then wait for the files as "Wait for the files" below describes and read them.
- `Skip`: write the sections as text only. A section without a screenshot is complete.

**Shot list and capture checklist.** Always put all the screenshots for the page in one list, so the user captures them in one go and you wait once, and list only a screenshot that the page will use or that you need as research. Write the shot list in the chat: for each screenshot a file name `<page-id>-<section-id>-<short-name>.png` (for example `P12-find-version-about-dialog.png`), the screen, the exact state to capture (what is open, selected or visible) and the numbered steps to reach it. Add this checklist for the user:
- Use a desktop-size window, at least 1440 px wide, at 100% browser zoom. The tablet layout hides controls.
- Use a clean test account, so no real names, email addresses, hostnames or tokens show. Crop them out if they do.
- Use the light theme everywhere, so all screenshots look the same. In the Modern UI, choose the Light Theme in the settings, not Dark Theme or Device's Theme. Set the browser and the operating system to a light appearance too, so browser dialogs, permission prompts and menus are light. Do not capture in a private or Incognito window, because it forces a dark browser theme and adds Incognito-only text.
- Capture the whole application window or dialog, so the reader sees the context. Crop only to remove personal data. Do not resize or enlarge it. Save as PNG with the exact file name from the list, in `.agents/tmp/screenshots/`, then choose `Ready` when the agent asks.

**Wait for the files.** Do not end your turn and do not write the steps yet. Ask with the `ask_user` tool, with the choices `Ready` and `Skip these screenshots`. On `Skip these screenshots`, handle the sections as `Skip` does. On `Ready`, list the staging folder (`ls`) and check that every file on the shot list exists. For `I will provide screenshots` there is no list: ask the user for the file names. Ask again for the missing ones, and handle a file that never arrives as the second bullet of "Add while you write" says.

**Read the screenshots.** Do this yourself, in this conversation, and not in a subagent, because only you keep the exact labels for the page.
- List the folder with `ls`, not with a glob, because a glob can skip ignored files. Read only the files named in the shot list (or, for `I will provide screenshots`, the files the user names), each with the `view` tool. A file that is not on the list is not used, so an old file cannot be read by mistake.
- Check each image against the Quality paragraph below and the rules above (no personal data, the light theme in the Modern UI and in every browser or system element, and that it shows the screen and state on the shot list, not another window). Handle one that fails as the second bullet of "Add while you write" says.
- Write down the labels, their order and the layout that the images show, as notes in your working text, before you go on. Write the steps from them and check them against the code. Where an exact label matters, ask the user to paste the visible text as well.

**Add while you write.** A screenshot can serve as research only.
- Every section whose steps the reader takes in a real screen gets at least one screenshot of the result of those steps (the end state the reader compares with their own screen), when the user provided one. Add more only when they show where a control is or what to compare, and the text alone would be harder to follow. Do not add one that repeats what the text plainly says. Another page showing the same screen in a different state does not replace it.
- If a screenshot the user gave is not usable (it shows data that contradicts the steps, such as a missing name, or it is cropped so that the element is cut off, or it is blurred, or it shows a dark theme), do not drop it silently. Say what is wrong, ask the user for a new capture with the `ask_user` tool, and keep the section as text until it arrives.
- A research-only screenshot is never copied into `documentation/`. Copy only the ones the page uses from the staging folder to `documentation/modules/ROOT/images/`.
- Give each one you add alt text, a caption and the text version of its facts.
- If a section needs a screenshot that you did not ask about, ask then, with the same choices.

**Outline what matters.** After the user provides a screenshot, draw a border around each control or text that the steps refer to, on a copy that you save to `images/`. Use a solid border of at least 4 px in red (`#d32f2f`, which has more than 3:1 contrast on white). Draw it with a script, not by hand, and keep the original in the staging folder until the clean-up. If the element touches the edge of the image, add white padding to that side so that the border does not cover it. Name each outlined element in the caption and in the text, because the outline is not the only place where the fact appears.

**Quality.** Never enlarge, upscale or sharpen a screenshot to make its text readable: the result is blurry. Do not resize it. Text of the application around the outlined element may be small, because it only gives context. If the text inside the outlined element is unclear, ask the user for a sharper capture (a larger window, a zoomed-in browser or a high-density display), and keep the section as text until it arrives.

**Clean up.** The pages read their images from `documentation/modules/ROOT/images/`, never from the staging folder. So copy every image a page uses to `images/` while you write (see "Add while you write"), and check that each `image::` line of the pages you changed points to a file there. When that is done and the page is final, at the end of the run after the build and preview checks, delete the whole staging folder with `rm -rf .agents/tmp/screenshots`.

In the summary, list each screenshot as added to the page, research only or skipped, with the user's answer, and say that the staging folder was deleted.
