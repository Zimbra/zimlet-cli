import { FOLLOW_UP_TAG } from '../constants';

// tagNames is a comma separated string, such as "To follow up,Invoices".
export const hasFollowUpTag = message =>
	Boolean(message?.tagNames?.split(',').includes(FOLLOW_UP_TAG));
