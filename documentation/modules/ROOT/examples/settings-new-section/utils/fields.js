import { ENABLED, DAYS, DEFAULT_DAYS } from '../constants';
import { toProperty } from './property';

// The type tells the Settings dialog where to read and save the value.
// A value is always text, so the check box is saved as 'true' or 'false'.
export const FIELDS = {
	[ENABLED]: { type: 'modifyProperties', key: ENABLED, defaultValue: toProperty(ENABLED, 'false') },
	[DAYS]: { type: 'modifyProperties', key: DAYS, defaultValue: toProperty(DAYS, DEFAULT_DAYS) }
};
