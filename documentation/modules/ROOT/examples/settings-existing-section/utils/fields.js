import { CLOSING_PHRASE } from '../constants';
import { toProperty } from './property';

// The type tells the Settings dialog where to read and save the value.
// The dialog adds this field to the fields of the built-in page.
export const FIELDS = {
	[CLOSING_PHRASE]: {
		type: 'modifyProperties',
		key: CLOSING_PHRASE,
		defaultValue: toProperty(CLOSING_PHRASE, '')
	}
};
