import { createElement } from 'preact';
import { useAccountInfo } from '@zimbra-client/hooks/graphql';
import { getPlatformType, PLATFORM_TYPES } from '@zimbra-client/platform';

function getHint() {
	switch (getPlatformType()) {
		case PLATFORM_TYPES.ANDROID:
		case PLATFORM_TYPES.IOS:
			return 'Tap a message to open it.';
		case PLATFORM_TYPES.ELECTRON:
			return 'You are using the desktop app.';
		default:
			return 'Click a message to open it.';
	}
}

export default function AccountName() {
	const { data, loading } = useAccountInfo();

	if (loading || !data) {
		return null;
	}

	const greeting = `Welcome, ${data.accountInfo.name}!`;

	return (
		<p>
			{greeting} {getHint()}
		</p>
	);
}
