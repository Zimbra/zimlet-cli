import { createElement } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { Text } from '@zimbra/preact-i18n';
import { ActionButton } from '@zimbra-client/components';
import { BookOpenIcon } from 'lucide-preact';
import { withIntl } from '../../enhancers';

const KnowledgeBaseToggle = ({ isMobile, showAdvanced, searchField }) => {
	const [isOn, setIsOn] = useState(false);
	// The other search field has no room on a small screen, and the advanced search needs the
	// Modern UI's own field.
	const isReplacing = isOn && !isMobile && !showAdvanced;

	useEffect(() => {
		if (!isReplacing) {
			return undefined;
		}
		searchField.show();
		// Runs when the user switches the button off, when a condition above stops holding and
		// when the button goes away.
		return searchField.hide;
	}, [isReplacing, searchField]);

	const handleClick = useCallback(() => setIsOn(on => !on), []);

	if (isMobile) {
		return null;
	}

	return (
		<ActionButton
			icon={BookOpenIcon}
			iconOnly
			colored={isReplacing}
			spacingSize="md"
			aria-pressed={isReplacing}
			title={<Text id="my-zimlet.toggle" />}
			aria-label={<Text id="my-zimlet.toggle" />}
			onClick={handleClick}
		/>
	);
};

export default withIntl()(KnowledgeBaseToggle);
