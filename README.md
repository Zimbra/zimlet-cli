# Zimlet CLI

A command-line build tool for next generation Zimlets, powered by Webpack.

## Quick Usage

**(note: npm installation as outlined here is not currently supported as this module is not yet public)**

```
npm install -g zimlet-cli

# note: this is not yet implemented! (start with the example)
zimlet create my-new-zimlet

cd my-new-zimlet

# development server
zimlet watch
# ^ this will output a URL you can paste into /sdk/zimlets in the email app.

# production build (create .js file and other entries to include in zimlet bundle)
zimlet build

# package for deployment in zimbra server if there are no other pieces of the zimlet
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
cd packages/\@zimbra/zimlet-cli

# install the dependencies:
npm install

# now any time you change src/ in the CLI package,
# (re-)link your build of the CLI globally:
npm link
```

Doing the above (and repeating the last step for any change to the CLI's source) will introduce a `zimlet` command globally.
