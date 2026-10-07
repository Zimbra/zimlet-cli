## Zimlet Templates

Using Zimlet templates you can take full control of scaffolding your next Zimlet.

```sh
$: zimlet create default my-project
```

The above command pulls the template from [Zimbra/zm-x-zimlet-template-default](https://github.com/Zimbra/zm-x-zimlet-template-default) - the default template.

> :tipping_hand_woman: Tip: Any Github repo with a `'/template'` folder can be used as a custom template: 

```sh
zimlet create <username>/<repository> <project-name>`
```

### Official Templates

The purpose of official zimlet-cli project templates are to provide opinionated development tooling setups so that users can get started with actual working zimlet code as fast as possible. However, these templates are un-opinionated in terms of how you structure your zimlet code and what libraries you use in addition to zimlet-cli.

All official project templates are repos in the [zimbra organization]. When a new template is added to the organization, you will be able to run `zimlet create <template-name> <project-name>` to use that template.

Current official templates include:

- [Zimbra/zm-x-zimlet-template-default](https://github.com/Zimbra/zm-x-zimlet-template-default) - Default template with minimal example code.  You can specify `default` as the template on the command line to get this template.

### Community Templates
- [ZeXtras/zm-x-zimlet-template-ts](https://github.com/ZeXtras/zm-x-zimlet-template-ts) - A TypeScript and SCSS ready template

If you have created a useful template, open an issue to have it added here!