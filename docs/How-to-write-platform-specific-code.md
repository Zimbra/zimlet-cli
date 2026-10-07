
## Writing platform-specific code in Zimlets 

Zimlet CLI exposes `getPlatformType` function which can be used for detecting in which platform zimlet is loaded and running at runtime, it will return values as below

| Return value        | Platform  |
|:-------------:|:-------------:|
| electron      | Desktop App |
| android      | Android Mobile App      |
| ios | IOS Mobile App      |
| web | Everything else      |


There is a constant `PLATFORM_TYPES` that is also exposed to zimlets to match the returned value.

```
PLATFORM_TYPES = {
	ELECTRON: 'electron',
	ANDROID: 'android',
	IOS: 'ios',
	WEB: 'web'
};
```

Both of these functions can be imported from `@zimbra-client/platform`.


## Example

```js
import { h } from 'preact';
import createApp from './components/app';
import { getPlatformType, PLATFORM_TYPES } from '@zimbra-client/platform';

export default function Zimlet(context) {
    // Some component code...

    exports.init = function init() {
        if (getPlatformType() === PLATFORM_TYPES.ELECTRON) {
            // Write platform specific logic here...
        };
        ...
    }

    // Rest of the component code...
}
```
