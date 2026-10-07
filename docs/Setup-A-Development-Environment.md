An extensive getting started guide on how to create Zimlets and Java extensions can be found at:
- https://github.com/Zimbra/zm-extension-guide
- https://github.com/Zimbra/zm-zimlet-guide

# Hardware/OS
Any environment where you can run the required software below can be an effective development environment.  Mac, Linux, and Windows OSs should all be effective environments.  It is perfectly acceptable and encouraged for this to all run on your local laptop/desktop for speed and ease of development.

# Required Software
You must have the following software installed in your development environment:

* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* Node v6+ and Node Package Manager (NPM) v5+.  You can use [node version manager (nvm) to install both of these](https://github.com/creationix/nvm#install-script)

# IDE
Developing zimlets will be much easier if you have a good IDE with an integrated eslint plugin.  That will eliminate many common bugs that could be hard to find on your own.  Below are some recommended editors and plugins for them that you may find useful

## Atom

Many developers use the&nbsp;_[Atom](|https://atom.io/) IDE. [Guide to Installing/Updating/Using Atom Packages](|http://flight-manual.atom.io/using-atom/sections/atom-packages/).  Below are some helpful packages that you'll want to install and some settings that are handy for them:

* *[linter-eslint package](https://github.com/AtomLinter/linter-eslint)* *\-* Show eslint errors in Atom, using the rules defined in the project of the active file
  * Select the "Fix errors on save" checkbox
  * For the "Silence specific rules while typing" field, enter the following. &nbsp;This will prevent you from being bugged by errors that will be fixed when you save the file
    * keyword-spacing, no-trailing-spaces, no-spaced-func, no-multiple-empty-lines, object-curly-spacing, quotes, react/jsx-space-before-closing
* *[nice-index](https://atom.io/packages/nice-index)* \- Instead of showing index.js for every file, shows the folder name instead of index.js in the tab.
* *[editorconfig](https://atom.io/packages/editorconfig)* \- loads the .editorconfig configuration for your editor behavior automatically
* *[language-babel](https://atom.io/packages/language-babel)* \- provides full language support for fancy Javascript and JSX
* *[merge-conflicts](https://atom.io/packages/merge-conflicts)* \- easy resolution of merge conflicts, in Atom
* *[pigments](https://atom.io/packages/pigments)* \- shows the color codes you put in your css in their actual color (including LESS variables)

## Visual Studio Code

Download Here: [https://code.visualstudio.com/](https://code.visualstudio.com/)

Install extensions through the View->Extensions menu

Some other plugins you may find useful:
* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Show eslint errors in Atom, using the rules defined in the project of the active file
* [Babel ES6/ES7](https://marketplace.visualstudio.com/items?itemName=dzannotti.vscode-babel-coloring) - Adds JS Babel es6/es7 syntax coloring
* [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight) - Highlight web colors in your editor
* [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) - EditorConfig Support for Visual Studio Code
* [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) - Supercharge the Git capabilities built into Visual Studio Code — Visualize code authorship at a glance via Git blame annotations and code lens, seamlessly navigate and explore Git repositories, gain valuable insights via powerful comparison commands, and so much more
* [Highlight Matching Tag](https://marketplace.visualstudio.com/items?itemName=vincaslt.highlight-matching-tag) - Highlights matching closing or opening tag
* [Node.js Modules Intellisense](https://marketplace.visualstudio.com/items?itemName=leizongmin.node-module-intellisense) - Autocompletes Node.js modules in import statements
* [NPM Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense) - Visual Studio Code plugin that autocompletes npm modules in import statements

# Install Zimlet Cli tool
`$ npm install -g @zimbra/zimlet-cli`