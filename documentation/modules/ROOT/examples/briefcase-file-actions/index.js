import { createElement } from 'preact';
import CheckButton from './components/check-button';
import CheckMenuItem from './components/check-menu-item';

export default function Zimlet(context) {
	const { plugins, store } = context;

	return {
		init() {
			// Read the actions when you use them: the object is built from the current registry.
			const renderAction = (Component, { selectedList }) => {
				const { addModal, removeModal } = store.zimletRedux.actions.zimlets;

				return (
					<Component addModal={addModal} removeModal={removeModal} selectedList={selectedList} />
				);
			};

			plugins.register('slot::briefcase-document-context-menu', props =>
				renderAction(CheckMenuItem, props)
			);
			plugins.register('slot::briefcase-document-header-action', props =>
				renderAction(CheckButton, props)
			);
		}
	};
}
