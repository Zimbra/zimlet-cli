## Development

To deploy in development:

1. Run `zimlet watch` to start a `zimlet-cli` development server, and observe the URL printed by the `watch` command (e.g. `https://localhost:8081/index.js`).
2. Navigate to the route of `/sdk/zimlets` on your `zm-x-web` development server (e.g. `https://localhost:8080/sdk/zimlets`)*.
3. Enter a unique name into the "name" input box, and then the URL printed by the `zimlet-cli` development server from Step 1.
4. Press "Load Zimlet".

* NOTE: The server will need the [zm-x-zimlet-sideloader](https://github.com/Zimbra/zm-x-zimlet-sideloader) enabled for this route to appear.

The Zimlet should now be running, and if the `persist` checkbox is checked it will be reloaded when the page reloads.

> If loading fails, navigate to your Zimlet URL and make sure the Certificate has been accepted.

## Production

After completing a Zimlet, it can be packaged into a `zip` file and then deployed to the Zimbra server using the [Zimbra Administration Console](https://wiki.zimbra.com/wiki/Administration_Console). Run the following in the Zimlet's working directory:

```sh
zimlet build
zimlet package
```

When building, you can add a '--publicpath' option. This allows to you specify the path from which your zimlet downloads its assets (which could include font files, images etc.). This option is not mandatory. If not specified 'publicpath' defaults to '/'. 

```sh
zimlet build --publicpath "custom/path/here"
```


When packaging, read through the options, and determine what you must enter for `--name`, `--pkg-version`, `--description`, and `--zimbraXVersion`. For example:

```sh
zimlet package --name "com_example_my-zimlet" --description "My First Zimlet" --pkg-version 1.0.0 --zimbraXVersion ">=0.0.1"
```
3. The `package` command will output a `zip` file that can be deployed as follows: 
 - From the Administration Console: [Managing Zimlets from the Administration Console](https://github.com/Zimbra/adminguide/blob/a48eb9b6d1efe311113583f11763a6eed2795834/zimlets.adoc#managing-zimlets-from-the-administration-console).
 - From the command line: [zmzimletctl](https://wiki.zimbra.com/wiki/CLI_zmzimletctl)

## Compatibility with Zimbra X Client

When packaging a Zimlet, the Zimlet MUST specify a value for `--zimbraXVersion`. This version will tell the Zimbra X client which version of the client it is compatible with. That makes it possible for the Zimbra X to maintain semantic versioning for Zimlets; and a breaking change to Zimbra X will cause a Zimlet to not load itself.

**To be compatible with ANY version, set `zimbraXVersion` to `>=0.0.1`**