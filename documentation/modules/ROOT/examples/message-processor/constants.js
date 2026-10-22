// Replace these with the project keys and the ticket address of your own tracker.
export const PROJECT_KEYS = ['SUP', 'OPS'];
export const TICKET_URL = 'https://zimbra.github.io/zimlet-cli/issues/';

// One capture group, so that String.split keeps the ticket numbers between the other text.
export const TICKET_PATTERN = new RegExp(`\\b((?:${PROJECT_KEYS.join('|')})-\\d+)\\b`);
