import { createElement } from 'preact';
import { useCallback } from 'preact/hooks';
import { useAccountInfo } from '@zimbra-client/hooks/graphql';

const ZIMLET_NAME = 'my-zimlet';
const ANNOUNCEMENT = 'announcement';
const SHOW_ANNOUNCEMENT = 'showAnnouncement';

// Use localization for visible text in a real Zimlet.
const SECTION_TITLE = 'Announcements';
const CHECKBOX_LABEL = 'Show announcements from the administrator';

// Returns the value that the administrator set, or undefined while it loads or when it is not set.
function useAdminSetting(name) {
	const { data } = useAccountInfo();
	const entry = data?.accountInfo?.zimlets?.zimlet?.find(
		item => item.zimlet?.[0]?.name === ZIMLET_NAME
	);
	const properties = entry?.zimletConfig?.[0]?.global?.flatMap(group => group.property) ?? [];

	return properties.find(property => property.name === name)?.content;
}

// Returns the value that the user saved, or undefined while it loads or when it is not set.
function useUserSetting(name) {
	const { data } = useAccountInfo();

	return data?.accountInfo?.props?.prop?.find(
		property => property.zimlet === ZIMLET_NAME && property.name === name
	)?._content;
}

// A user who has not chosen yet has no saved value, so the announcement shows.
const Announcement = () => {
	const announcement = useAdminSetting(ANNOUNCEMENT);
	const showAnnouncement = useUserSetting(SHOW_ANNOUNCEMENT);

	return announcement && showAnnouncement !== 'false' ? <p>{announcement}</p> : null;
};

// The Settings dialog passes the saved property in value and reports a change with onFieldChange.
const AnnouncementSettings = ({ value, onFieldChange }) => {
	const changeShow = useCallback(
		event =>
			onFieldChange(SHOW_ANNOUNCEMENT)({
				target: {
					value: {
						zimlet: ZIMLET_NAME,
						name: SHOW_ANNOUNCEMENT,
						_content: String(event.target.checked)
					}
				}
			}),
		[onFieldChange]
	);

	return (
		<label>
			<input
				type="checkbox"
				checked={value?.[SHOW_ANNOUNCEMENT]?._content !== 'false'}
				onChange={changeShow}
			/>
			{CHECKBOX_LABEL}
		</label>
	);
};

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			plugins.register('slot::top-mail-generic-slot', Announcement);
			plugins.register('settings', {
				id: 'myZimletAnnouncements',
				title: SECTION_TITLE,
				component: AnnouncementSettings,
				fields: {
					[SHOW_ANNOUNCEMENT]: {
						type: 'modifyProperties',
						key: SHOW_ANNOUNCEMENT,
						defaultValue: { zimlet: ZIMLET_NAME, name: SHOW_ANNOUNCEMENT, _content: 'true' }
					}
				}
			});
		}
	};
}
