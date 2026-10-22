import { createElement } from 'preact';
import { useCallback, useState } from 'preact/hooks';

// Use localization for visible text in a real Zimlet.
const INPUT_LABEL = 'Name to look up';
const BUTTON_LABEL = 'Search';

export default function Zimlet(context) {
	const { plugins, zimbraBatchClient } = context;

	const PeopleSearch = () => {
		const [name, setName] = useState('');
		const [people, setPeople] = useState([]);

		const changeName = useCallback(event => setName(event.target.value), []);

		const search = useCallback(
			() =>
				zimbraBatchClient
					.jsonRequest({
						name: 'SearchGal',
						namespace: 'urn:zimbraAccount',
						body: { name, type: 'account' }
					})
					.then(response => setPeople(response.cn || []))
					.catch(error => console.error(error)),
			[name]
		);

		return (
			<div>
				<input aria-label={INPUT_LABEL} value={name} onInput={changeName} />
				<button type="button" onClick={search}>
					{BUTTON_LABEL}
				</button>
				<ul>
					{people.map(person => (
						<li key={person._attrs.email}>{person._attrs.fullName || person._attrs.email}</li>
					))}
				</ul>
			</div>
		);
	};

	return {
		init() {
			plugins.register('slot::mail-sidebar-footer', PeopleSearch);
		}
	};
}
