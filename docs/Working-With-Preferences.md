Add your own preferences to the Settings Menu by using the `settings` plugin with a settings configuration object:

## Full Example

```js
plugins.register('settings', {
  // A unique ID for this zimlets settings menu.
  id: 'com_zimbra_x_your_zimlet_name',

  // The text in the Settings panel list
  title: 'My Zimlet',

  // The body of the Settings panel
  // props.value           contains all information about the current settings provided by `fields`
  // props.onFieldChange   use this to change the values of a field. changes are not committed until the user presses "Save".
  component: ({ value, onChange ...props }) => 'Settings for My Zimlet.',

  // The preference fields that your zimlet will be modifying.
  // See `fields` below.
  fields: {
    // The value of `myPreference` will be passed to the `component` so it can be rendered in a form.
    myPreference: {
      type: 'userPref',
      key: 'zimbraPrefSomethingRandom',
      defaultValue: 0
    }
  }

  // Optional, hide the settings when this function returns true.
  hide: (props) => false
});
```

## Options

### `title`

A `string` or `vNode`.

### `component`

A React `Component`, with `props` containing the current settings values defined by `options.fields`.

Use `props.value` to create an HTML form which calls `onFieldChange` when values change. Fields are not saved to the server until the user presses "Save".

### `fields`

A field represents a preference on the server. The value of the field will be passed to `options.component`, along with an `onFieldChange` prop that can be used to change the field.

```js
onFieldChange(['myPreference'], [{ target: { value: 1 } }]);
```

Typings for the `fields` object are as follows:

```ts
enum FieldTypes {
  mailboxMetadata: 'mailboxMetadata',
  userPref: 'userPref',
  whiteBlacklist: 'whiteBlacklist',
  filterRules: 'filterRules',
  MODIFY_PROPERTIES: 'modifyProperties', // Coming soon!
  zimletPrefs: 'zimletPrefs'
};

type FieldConfig<T> = {
 type: FieldType
 key: string        // the preference being changed, such as `zimbraPrefMailPollingInterval`
 defaultValue: T

 /** Transform the value after it is received from the server */
 toJS?: (value: any) => T

 /** Transform the value before it is saved to the server */
 fromJS?: (value: T) => any
}
```

For real examples of settings config objects, see [ZimbraOS/zm-x-web/blob/master/src/components/settings/constants.js](https://github.com/ZimbraOS/zm-x-web/blob/master/src/components/settings/constants.js)