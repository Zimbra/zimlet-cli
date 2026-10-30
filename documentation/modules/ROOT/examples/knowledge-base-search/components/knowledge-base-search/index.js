import { createElement } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Text } from '@zimbra/preact-i18n';
import { ActionButton, TextInput } from '@zimbra-client/components';
import { SearchIcon } from 'lucide-preact';
import { withIntl } from '../../enhancers';
import { KNOWLEDGE_BASE_SEARCH_URL } from '../../constants';
import style from './style.less';

const KnowledgeBaseSearch = () => {
	const [query, setQuery] = useState('');

	const handleInput = useCallback(event => setQuery(event.target.value), []);

	const handleSubmit = useCallback(
		event => {
			event.preventDefault();
			const text = query.trim();
			if (text) {
				const url = `${KNOWLEDGE_BASE_SEARCH_URL}?q=${encodeURIComponent(text)}`;
				window.open(url, '_blank', 'noopener,noreferrer');
			}
		},
		[query]
	);

	return (
		<form class={style.form} role="search" onSubmit={handleSubmit}>
			<TextInput
				autofocus
				class={style.input}
				value={query}
				placeholder={<Text id="my-zimlet.placeholder" />}
				aria-label={<Text id="my-zimlet.placeholder" />}
				onInput={handleInput}
			/>
			<ActionButton
				type="submit"
				icon={SearchIcon}
				iconOnly
				spacingSize="md"
				title={<Text id="my-zimlet.submit" />}
				aria-label={<Text id="my-zimlet.submit" />}
			/>
		</form>
	);
};

export default withIntl()(KnowledgeBaseSearch);
