import { BLOCKED_EXTENSIONS, MAX_SIZE_BYTES } from '../constants';

export const PROBLEM = { BLOCKED_TYPE: 'blockedType', TOO_LARGE: 'tooLarge' };

// Returns the first problem that a file has, or null when the file can be shared.
export default function checkFile({ name, size }) {
	const extension = name.includes('.') ? name.split('.').pop().toLowerCase() : '';

	if (BLOCKED_EXTENSIONS.includes(extension)) {
		return PROBLEM.BLOCKED_TYPE;
	}
	if (size > MAX_SIZE_BYTES) {
		return PROBLEM.TOO_LARGE;
	}
	return null;
}
