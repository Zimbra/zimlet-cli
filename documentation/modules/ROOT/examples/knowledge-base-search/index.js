import { createElement } from 'preact';
import KnowledgeBaseSearch from './components/knowledge-base-search';
import KnowledgeBaseToggle from './components/knowledge-base-toggle';

// One function for every registration, so that `unregister` receives the function that
// `register` received.
const renderKnowledgeBaseSearch = () => <KnowledgeBaseSearch />;

export default function Zimlet(context) {
	const { plugins } = context;

	const searchField = {
		show: () => plugins.register('slot::web-search', renderKnowledgeBaseSearch),
		hide: () => plugins.unregister('slot::web-search', renderKnowledgeBaseSearch)
	};

	return {
		init() {
			// The button before the search field. It passes `isMobile` and `showAdvanced`.
			plugins.register('slot::web-search-toggle', props => (
				<KnowledgeBaseToggle {...props} searchField={searchField} />
			));
		}
	};
}
