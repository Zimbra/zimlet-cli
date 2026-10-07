# XSS Sanitizing

You can use DOMPurify in your Zimlet for your XSS sanitizing needs. Basic example:

```
//Load components from Zimbra
import { createElement } from "preact";
import dompurify from 'dompurify';

//Create function by Zimbra convention
export default function Zimlet(context) {
	//Get the 'plugins' object from context and define it in the current scope
	const { plugins } = context;
	const exports = {};


	exports.init = function init() {
		let clean = dompurify.sanitize('<b>hello there</b>');
		console.log(clean); //prints: <b>hello there</b>
		clean = dompurify.sanitize('<img src=x onerror=alert(1)//>');
		console.log(clean);//prints: <img src="x">	
	};

	return exports;
}
```

Further reading: https://github.com/cure53/DOMPurify