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