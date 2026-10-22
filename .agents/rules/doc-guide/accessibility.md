# Accessibility rules for the Zimlet documentation

Section 6 of the writing rules in [write-doc.md](../write-doc.md). Read it in full together with that file.

## 6. Accessibility

Every page meets WCAG 2.2 level AA. These rules apply to text, tables, code, diagrams and images.

**Text and structure**

- Use real headings in order (`==` after `=`, `===` after `==`), never bold text as a heading. One `=` title per page.
- Link text says where the link goes: `xref:run-package-deploy/deploy.adoc[Deploy a Zimlet]`, not "click here" or "this page". Do not use a bare URL as link text. Two links with the same text go to the same place.
- Do not use colour, position or shape words as the only instruction ("the green button", "the box on the right"). Name the control by its label.
- Write for plain reading: define abbreviations on first use, keep sentences short, and do not use all capitals for emphasis.
- Mark language and meaning with the right element: `NOTE`, `TIP`, `WARNING` and `CAUTION` admonitions carry their label as text, so they do not depend on colour. Do not simulate them with formatting.

**Tables and code**

- Every table has a header row (`options="header"`) and no merged or empty header cells. Use a table only when the reader compares the same three or more attributes across several items to choose between them. Never use a table for layout, for a list of things to learn, install or configure, or for items with only a name and a description. Use a description list for those, or a list grouped under headings when the items fall into groups such as required and optional. Keep tables narrow enough to read on a small screen, with at most five columns where possible.
- Every code block sets its language (`[source,js]`). Do not show code or commands as an image. Do not rely on syntax colour to carry meaning.
- Write commands so a reader can copy them: no prompt characters (`$`) inside the block, and no line numbers.

**Images and diagrams**

- Every image and diagram has alt text that states what it shows and why it matters (see the diagram rules in section 5 of [media.md](./media.md)). Alt text is a plain sentence, not a file name and not "image of". Quote it in the macro, `image::name.svg["alt text, with commas"]`, because an unquoted comma splits the text into the width and height attributes. Check the generated `<img>` tag shows the whole text and no `width` or `height` you did not set.
- Alt text is not a substitute for the content. A reader who cannot see the figure must get the same facts from the text next to it, so write the steps or relations of a diagram as a sentence or list in the page. For a diagram with more than five nodes, add that text version directly after the figure.
- Text inside a diagram is at least 14 px at the size shown. A real UI screenshot shows the whole window for context, so the text around the outlined element may be smaller, but the text inside the outlined element is legible, and no text of the element is cropped (section 5 of [media.md](./media.md)). Do not put the only copy of a command, value or error message in an image.
- Colour contrast is at least 4.5:1 for text and 3:1 for lines, borders and icons, against their background. Use the default Mermaid theme or a theme that meets this, and check the rendered SVG, not only the source.
- A decorative image has empty alt text (`alt=""`); there should be no decorative images in this guide.
- Do not use animation, flashing or auto-playing media.
