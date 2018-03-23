## Zimlet Templates

Using Zimlet templates you can take full control of scaffolding your next Zimlet.

```sh
$: zimlet create default my-project
```

The above command pulls the template from [billneff79/zimlet-default-template](https://github.com/billneff79/zimlet-default-template) - the default template.

> :tipping_hand_woman: Tip: Any Github repo with a `'/template'` folder can be used as a custom template: 

```sh
zimlet create <username>/<repository> <project-name>`
```

### Official Templates

The purpose of official zimlet-cli project templates are to provide opinionated development tooling setups so that users can get started with actual working zimlet code as fast as possible. However, these templates are un-opinionated in terms of how you structure your zimlet code and what libraries you use in addition to zimlet-cli.

All official project templates are repos in the [zimbra organization]. When a new template is added to the organization, you will be able to run `zimlet create <template-name> <project-name>` to use that template.

Current official templates include:

- [billneff79/zimlet-default-template](https://github.com/billneff79/zimlet-default-template) - Default template with minimal example code.  You can specify `default` as the template on the command line to get this template.

### Community Templates

No community templates exist yet, be the first to create a template and open a pull request to add it here!
