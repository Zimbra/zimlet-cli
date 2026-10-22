# Rules for diagrams and images in the Zimlet documentation

Section 5 of the writing rules in [write-doc.md](../write-doc.md). Read it in full together with that file.

## 5. Diagrams and images

- Prefer a diagram over a screenshot whenever the topic is structure, flow, sequence, lifecycle or relationships: how a Zimlet is built, packaged, served and loaded; the `init()` and plugin registration order; slot rendering; the server bundle path.
- Write diagrams as Mermaid text in `images/diagrams/<name>.mmd`, render them to SVG next to it, and embed the SVG. Commit both files; the page shows the SVG, the `.mmd` is the editable source. The Antora playbook has no diagram extension, so do not embed Mermaid blocks directly.
- A diagram shows one idea with about twelve nodes or fewer, uses the same plain terms as the text, flows left to right or top to bottom, and has a one-sentence introduction in the page and alt text that states the point of the diagram. No diagram may be the only place a fact appears.
- Keep diagrams, their alt text and their captions abstract. Show the steps and the flow in plain words, not the implementation. Do not put these in a diagram, alt text or caption: function or method names (such as `init()` or `factory(context)`), file or folder names (such as `src/index.js`), commands or flags, registration keys or slot ids, code, paths, hostnames or tokens. Name each step by what it does for the reader, such as "Sets it up". Put the exact names in the page text beside the diagram, where the reader looks them up, and link to the reference page for them.
- Lay a diagram out so it stays readable at the size the page shows it:
  - Keep it compact: the rendered SVG `viewBox` is at most about 900 px wide and 700 px tall. Check this in the generated `.svg` (`viewBox` and `max-width` at the top of the file). A long single row of nodes is shrunk by the page width until its text is unreadable; a long single column is taller than the screen.
  - Group nodes in labelled subgraphs (for example "On your machine", "Zimbra server", "Modern UI in the browser") and run each group left to right, with the groups stacked top to bottom, instead of one long chain.
  - Keep node text to about six words and edge labels to about three. Use plain words for both. Move longer explanations into the text.
  - Do not scale a diagram down with `width=`. If it does not fit at its natural size, split it or regroup it.
- Every diagram and image is readable in the rendered page at normal zoom: all text legible without zooming, nothing cut off, the order of the flow clear. A diagram that builds without errors can still be unreadable.
- Use a screenshot only for something a diagram cannot show, such as the real Modern UI layout or the About dialog. Save as PNG in `images/`, crop to the relevant area, and remove names, email addresses, hostnames and tokens. Give every image alt text and a caption in the page.
- Update or remove an image or diagram in the same change that alters what it shows.

### Screenshots: ask first, then add

Never invent a screenshot. Capture one only when the user asks you to.

**Ask before you write.** Do this once, before you write the steps.
- List the sections you will write or update that describe steps the reader takes in the real Modern UI, the Admin Console or another screen (find, open, choose or read something on a screen). Do not ask for screenshots of commands, code or terminal output.
- Remove from the list each screen that an image in `documentation/modules/ROOT/images/` already shows in the same state as the end of the steps (search the folder and the `image::` lines of the pages). A screen shown in a different state, such as an empty form where the steps end with a filled table, stays on the list. Ask for a new capture of such a screen only when the existing image is outdated, cropped too tight or unclear.
- If the list is empty, skip the question. Otherwise ask once with the `ask_user` tool, naming each section and the screen it needs, with the choices `I will provide screenshots`, `Capture them for me` and `Skip`.
- `I will provide screenshots`: wait for the files and read each one. It shows the real labels, order and layout, so write the steps from it and check them against the code.
- `Capture them for me`: follow the Modern UI preview of the `zimlet-doc-verify` skill, and stop and ask the user if the page is blocked.
- `Skip`: write the sections as text only. A section without a screenshot is complete.

**Add while you write.** A screenshot can serve as research only.
- Every section whose steps the reader takes in a real screen gets at least one screenshot of the result of those steps (the end state the reader compares with their own screen), when the user provided or captured one. Add more only when they show where a control is or what to compare, and the text alone would be harder to follow. Do not add one that repeats what the text plainly says. Another page showing the same screen in a different state does not replace it.
- If a screenshot the user gave is not usable (it shows data that contradicts the steps, such as a missing name, or it is cropped, blurred or too small), do not drop it silently. Say what is wrong, ask the user for a new capture with the `ask_user` tool, and keep the section as text until it arrives.
- Do not copy a research-only screenshot into the repository.
- Give each one you add alt text, a caption and the text version of its facts.
- If a section needs a screenshot that you did not ask about, ask then, with the same choices.

**Quality.** Never enlarge, upscale or sharpen a screenshot to make its text readable: the result is blurry. Crop, but do not resize. If its text is under 14 px at the size shown, or it is unclear, ask the user for a sharper capture (a larger window, a zoomed-in browser or a high-density display), and keep the section as text until it arrives.

In the summary, list each screenshot as added to the page, research only or skipped, with the user's answer.
