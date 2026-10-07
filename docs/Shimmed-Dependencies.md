### Usage

Some modules are *shimmed* (see [Motivation](#Motivation) below), and should not be installed as dependencies of a Zimlet. These include:

```js
preact
preact-router
preact-redux
react-apollo
```

Other psuedo-modules are provided by `zm-x-web` under the `@zimbra-client` namespace. This namespace includes many exports from the main application; such as components, utility functions, decorators, GraphQL queries, and constants. This gives all Zimlets a safe subset of the code used in developing `zm-x-web`. These psuedo-modules include:

```js
@zimbra-client/graphql     // Represents the `zm-x-web/src/graphql` folder
@zimbra-client/enhancers   // Represents the `zm-x-web/src/enhancers` folder
@zimbra-client/constants   // Represents the `zm-x-web/src/constants` folder
```

To use shims in a Zimlet, import them as if they are regular modules.

*Shims are a work in progress*. If you are a developer and you want to use a piece of code from `zm-x-web` in a Zimlet, make a pull request to [add more shims to the Zimlet Manager](https://github.com/ZimbraOS/zm-x-web/blob/master/src/lib/zimlet-manager/shims.js)

### Adding More Shims

1. Add the shim module to [`zm-x-web::src/lib/zimlet-manager/shims.js`](https://github.com/ZimbraOS/zm-x-web/blob/master/src/lib/zimlet-manager/shims.js).
2. Add the shimmed module name and named imports to the [`build-shims.js`](https://github.com/Zimbra/zimlet-cli/blob/master/build-shims.js) script.
3. (Optional) If not already included in the `SHIMMED_MODULES` list, add the module name to [`src/shims/index.js`](https://github.com/Zimbra/zimlet-cli/blob/master/src/shims/index.js) in the `SHIMMED_MODULES` list.
4. Run the build and make sure it works in a Zimlet.

### Motivation

`zimlet-cli` evaluates Zimlets inside a sand boxed environment. This environment has a number of useful dependencies injected into it, these are referred to as *shims*. By injecting dependencies, Zimlets are able to reuse modules bundled into `zm-x-web` without duplicating code.

Consider the `preact` module that exists in the main application (`zm-x-web`); and that `preact` will also be used by the majority of Zimlets. Bundling a unique copy of `preact` with every Zimlet will create a large amount of code duplication. Instead, there will be one copy of `preact` and it is injected into the environments for a Zimlet at runtime.