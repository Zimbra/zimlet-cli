[![CircleCI](https://circleci.com/gh/Zimbra/zimlet-cli.svg?style=shield&circle-token=770fdb94c5adb3ca436855b59c752a77fc4e7fed)](https://circleci.com/gh/Zimbra/zimlet-cli)

# Zimlet CLI

A command-line build tool for next generation Zimlets, powered by Webpack.

## Quick Usage

**(note: npm installation as outlined here is not currently supported as this module is not yet public)**

```
npm install -g @zimbra/zimlet-cli

### Usage

```sh
$ zimlet create <template-name> <project-name>
```

Example:
```sh
$ zimlet create default my-project
```

The above command pulls the template from [billneff79/zimlet-default-template] as our defined default template and generates the project at `./my-project/`.

Example:
```sh
$ zimlet create user123/my-zimlet-template my-project
```

The above command pulls the template from the `my-zimlet-template` repo from `user123` in github and generates the project at `./my-project/`.


### Official Templates

The purpose of official zimlet-cli project templates are to provide opinionated development tooling setups so that users can get started with actual working zimlet code as fast as possible. However, these templates are un-opinionated in terms of how you structure your zimlet code and what libraries you use in addition to zimlet-cli.

All official project templates are repos in the [zimbra organization]. When a new template is added to the organization, you will be able to run `zimlet create <template-name> <project-name>` to use that template.

Current available templates include:

- [billneff79/zimlet-default-template] - Default template with minimal example code.  You can specify `default` as the template on the command line to get this template.

> 💁 Tip: Any Github repo with a `'/template'` folder can be used as a custom template: <br /> `zimlet create <username>/<repository> <project-name>`

### CLI Options
#### zimlet create
```sh
$ zimlet create [template] [dest]

Create a new zimlet.

Options:
  --help         Show help                                             [boolean]
  --cwd          A directory to use instead of $PWD.              [default: "."]
  --name         The zimlet's name
  --force, -f    Force `dest` directory to created if it already exists; will
                 overwrite!                           [boolean] [default: false]
  --yarn         Install with `yarn` instead of `npm` [boolean] [default: false]
  --git          Initialize a `git` repository        [boolean] [default: false]
  --install, -i  Install dependencies                  [boolean] [default: true]
  --template     Remote template to clone (user/repo#tag)
  --dest         Directory to create the zimlet
```

Note: If you don't specify enough data to the `zimlet create` command, it will prompt the required questions.

#### zimlet watch
```sh
$ zimlet watch

Start a development server

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
  --config   Path to a custom config file
                                        [string] [default: "./zimlet.config.js"]
  --port     Port of dev server                         [number] [default: 8081]
  --https    Protocol of dev server. https if true, http if false
                                                       [boolean] [default: true]
```

 ^ this will output a URL you can paste into /sdk/zimlets in the email app.

#### zimlet build
```sh
$ zimlet build

Compile a zimlet

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
  --config   Path to a custom config file
                                        [string] [default: "./zimlet.config.js"]
  --dest     Directory for build artifacts           [string] [default: ./build]
```

production build (create .js file and other entries to include in zimlet bundle)

#### zimlet package
```sh
$ zimlet package

Package a zimlet for deployment

Options:
  --version              Show version number                           [boolean]
  --help                 Show help                                     [boolean]
  --name, -n             Globally unique name for your zimlet, e.g.
                         "com_mycompany_examplezimlet"                [required]
  --pkg-version, -v      Version for your zimlet, e.g. "1.0.1"        [required]
  --description, --desc  Description for your zimlet                  [required]
  --builddir, -b         Source directory of built artifacts to publish
                                                            [default: "./build"]
  --dest, -d             Directory for packaged artifacts       [default: ./pkg]
``` 
package for deployment in zimbra server if there are no other pieces of the 

example:
```sh
zimlet package --name com_mycompany_myzimlet -v 1.0.0 --description "My zimlet"
```

## Seeing available zimlet slots
The hooks into Zimbra for Zimlets are called `ZimletSlots`.  To see which slots are available in the UI, add the query string `?zimletSlots=show` to the end of your URL for the webmail client, e.g. `https://localhost:8080/?zimletSlots=show`.  This will show all of the places in the active UI where ZimletSlots are available, such as the available `menu` slot:

 ![show slot](./showSlot.png)

Slots that are not visible, such as the `routes` slot which allows for add URL routes to screens in the app, will present a message in the browser console, such as:
```
non-visible ZimletSlot name=routes
```

The `ZimletSlot`s will remain visible until the page is refreshed without the `zimletSlots=show` query string.

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


## Custom Configuration

#### Webpack

To customize webpack create a `zimlet.config.js` file in the root of your Zimlet which exports a function that will change webpack's config. To use a file other than `zimlet.config.js`, set a custom path as `env.config`.

```js
/**
 * Function that mutates original webpack config.
 *
 * @param {object} config - original webpack config.
 * @param {object} env - options passed to CLI.
 **/
export default function (config, env) {
  /** you can change config here **/
}
```
