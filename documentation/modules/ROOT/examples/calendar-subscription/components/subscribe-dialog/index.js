import { createElement } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { Text } from '@zimbra/preact-i18n';
import { ModalDialog, TextInput } from '@zimbra-client/components';
import { subscribeToCalendar } from '../../api/calendars';
import { FLOW_ID } from '../../constants';
import { withIntl } from '../../enhancers';
import { isWebAddress } from '../../utils/is-web-address';
import style from './style.less';

// The dialog exists only while the flag is set, so its fields start empty every time it opens.
const SubscribeDialog = ({ zimbraBatchClient, refetchCalendars, removeSlot }) => {
	const dispatch = useDispatch();
	const [url, setUrl] = useState('');
	const [name, setName] = useState('');
	const [errorId, setErrorId] = useState(null);
	const [pending, setPending] = useState(false);

	const handleClose = useCallback(
		() => dispatch(removeSlot({ id: FLOW_ID })),
		[dispatch, removeSlot]
	);

	const handleUrl = useCallback(({ target }) => {
		setUrl(target.value);
		setErrorId(null);
	}, []);

	const handleName = useCallback(({ target }) => {
		setName(target.value);
		setErrorId(null);
	}, []);

	const handleSubscribe = useCallback(() => {
		if (!isWebAddress(url.trim())) {
			setErrorId('my-zimlet.invalidAddress');
			return;
		}

		setPending(true);
		subscribeToCalendar(zimbraBatchClient, { name: name.trim(), url: url.trim() })
			.then(() => {
				handleClose();
				// Loads the calendars again, so that the sidebar lists the new one.
				refetchCalendars();
			})
			.catch(() => {
				setErrorId('my-zimlet.subscribeFailed');
				setPending(false);
			});
	}, [url, name, zimbraBatchClient, refetchCalendars, handleClose]);

	return (
		<ModalDialog
			title={<Text id="my-zimlet.dialogTitle" />}
			actionLabel="my-zimlet.subscribeButton"
			disablePrimary={!url.trim() || !name.trim()}
			pending={pending}
			error={errorId && <Text id={errorId} />}
			onAction={handleSubscribe}
			onClose={handleClose}
			autofocusChildIndex={1}
		>
			<p class={style.description}>
				<Text id="my-zimlet.description" />
			</p>
			<TextInput
				wide
				value={url}
				onInput={handleUrl}
				placeholderId="my-zimlet.addressPlaceholder"
				aria-label={<Text id="my-zimlet.addressLabel" />}
			/>
			<TextInput
				wide
				class={style.name}
				value={name}
				onInput={handleName}
				placeholderId="my-zimlet.namePlaceholder"
				aria-label={<Text id="my-zimlet.nameLabel" />}
			/>
		</ModalDialog>
	);
};

export default withIntl()(SubscribeDialog);
