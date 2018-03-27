[![CircleCI](https://circleci.com/gh/Zimbra/zimlet-cli.svg?style=shield&circle-token=770fdb94c5adb3ca436855b59c752a77fc4e7fed)](https://circleci.com/gh/Zimbra/zimlet-cli)
[![NPM Downloads](https://img.shields.io/npm/dm/@zimbra/zimlet-cli.svg?style=flat)](https://www.npmjs.com/package/@zimbra/zimlet-cli) [![NPM Version](https://img.shields.io/npm/v/@zimbra/zimlet-cli.svg?style=flat)](https://www.npmjs.com/package/@zimbra/zimlet-cli)

# Zimlet CLI

A command-line build tool for next generation Zimlets, powered by Webpack.

# Documentation
See the [full documentation on the github wiki](https://github.com/Zimbra/zimlet-cli/wiki).  Topics include documentation of all command options, getting started development guides, and more.

## Installation

Install the client globally so you can run it from the command line:
```sh
$ npm install -g @zimbra/zimlet-cli
```

## Quick Usage

To create a new zimlet repository:
```sh
$ zimlet create <template-name> <project-name>
```

Example:
```sh
$ zimlet create default my-project
```

The above command pulls the template from [Zimbra/zm-x-zimlet-template-default] as our defined default template and generates the project at `./my-project/`.

Example:
```sh
$ zimlet create user123/my-zimlet-template my-project
```

The above command pulls the template from the `my-zimlet-template` repo from `user123` in github and generates the project at `./my-project/`.


### Official Templates

The purpose of official zimlet-cli project templates are to provide opinionated development tooling setups so that users can get started with actual working zimlet code as fast as possible. However, these templates are un-opinionated in terms of how you structure your zimlet code and what libraries you use in addition to zimlet-cli.

All official project templates are repos in the [Zimbra organization](https://github.com/Zimbra). When a new template is added to the organization, you will be able to run `zimlet create <template-name> <project-name>` to use that template.

Current available templates include:

- [Zimbra/zm-x-zimlet-template-default] - Default template with minimal example code.  You can specify `default` as the template on the command line to get this template.

> 💁 Tip: Any Github repo with a `'/template'` folder can be used as a custom template: <br /> `zimlet create <username>/<repository> <project-name>`

## Hacking on the CLI

Want to work on the CLI? It's easy:

```
# get into this directory:
cd zimlet-cli

# install the dependencies:
npm install

# now any time you change src/ in the CLI package,
# (re-)link your build of the CLI globally:
npm link
```

Doing the above (and repeating the last step for any change to the CLI's source) will introduce a `zimlet` command globally.

[Zimbra/zm-x-zimlet-template-default]: https://github.com/Zimbra/zm-x-zimlet-template-default
