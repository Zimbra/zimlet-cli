// Use localization for visible text in a real Zimlet.
const BRIEFCASE_LABEL = 'team documents';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// The slot passes pathType, the area that is open. Return text for the Briefcase,
			// and null elsewhere, so that the search box keeps its own word.
			plugins.register('slot::searchInputPlaceholder', ({ pathType }) =>
				pathType === 'briefcase' ? BRIEFCASE_LABEL : null
			);
		}
	};
}
