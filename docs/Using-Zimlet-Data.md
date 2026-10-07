## Overview
Zimlets can provide data to be consumed by the host application. A Zimlet can register, mutate and unregister data.

## Register Data
Zimlets can provide data to the host application by calling registerData on the 'plugins' reference you get from context.

* name: String, name identifier for the data.
* dataArray: Array of data to register.
<br>_**plugins.registerData(name, dataArray)**_

## Mutate Data
Zimlets can mutate the data (provided in the registerData) by calling mutateData.
* name: String, name identifier for the data.
* mutator: Function, A function that will return a new list of the objects, the mutated objects.
<br>_**plugins.mutateData(name, mutator)**_

## Unregister Data
Zimlets can unregister data by calling plugins.unregisterData() and pass the data name identifier.
* name: String, name identifier for the data.
<br>_**plugins.unregisterData(name)**_

## Example

This example, demonstrates how a Zimlet can provide Contact fields and control its behaviour by changing the 'enabled' property of the field.

* You first need to register the data by passing the 'contact::attributes' name identifier and an array of object that represent the fields you want to see in your Contacts.

The object defining the field should contain the following fields:
* fieldName: String, the name that will be displayed in the contact form.
* show: Boolean, true to display the field, false otherwise.
* decorator: Function, A function that will return a transformed version of the passed in value.

```js
plugins.registerData('contact::attributes', [
  {
     fieldName: 'skype',
     enabled: false,
     decorator: skypeName => <a href={`skype://${skypeName}?Call`}>{skypeName}</a>
  }
]);
```

For mutating the contact fields, provide a function that alters and return the list of fields. In this case, we modify the 'enabled' property of the field so it can be displayed in the contacts editor.
```js
plugins.mutateData('contact::attributes', zimletData => {
    const listOfFields = zimletData && !isEmpty(zimletData.data) && zimletData.data;
    return (
        !isEmpty(listOfFields) &&
        listOfFields.map(field => {
	    field.enabled = false;
	    return field;
	})
    );
});
```

For unregistering the fields, call unregisterData and pass the name identifier.
```js
plugins.unregisterData('contact::attributes');
```