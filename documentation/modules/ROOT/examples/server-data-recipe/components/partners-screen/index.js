import { createElement } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Text } from '@zimbra/preact-i18n';
import { Button, Spinner, WarningBanner } from '@zimbra-client/blocks';
import {
	GenericMobileUIToolbar,
	GenericMobileUISidebar,
	TextInput
} from '@zimbra-client/components';
import { withIntl } from '../../enhancers';
import usePartners from '../../hooks/use-partners';
import PartnerRow from '../partner-row';
import style from './style.less';

// The screen with the list of partners, and the field that adds one.
const PartnersScreen = ({ zimbraBatchClient }) => {
	const { partners, loading, error, add, remove } = usePartners(zimbraBatchClient);
	const [email, setEmail] = useState('');
	const [adding, setAdding] = useState(false);
	const [addFailed, setAddFailed] = useState(false);

	const changeEmail = useCallback(event => setEmail(event.target.value), []);

	const addPartner = useCallback(
		event => {
			event.preventDefault();
			setAdding(true);
			setAddFailed(false);
			add(email.trim())
				.then(() => setEmail(''))
				.catch(failure => {
					console.error(failure);
					setAddFailed(true);
				})
				.finally(() => setAdding(false));
		},
		[email, add]
	);

	const removePartner = useCallback(id => remove(id).catch(console.error), [remove]);

	return (
		<div class={style.wrapper}>
			<GenericMobileUIToolbar />
			<GenericMobileUISidebar />
			<div class={style.content}>
				<h1 class={style.title}>
					<Text id="my-zimlet.title" />
				</h1>
				<p>
					<Text id="my-zimlet.intro" />
				</p>

				<form class={style.form} onSubmit={addPartner}>
					<TextInput
						class={style.input}
						type="email"
						value={email}
						placeholderId="my-zimlet.emailPlaceholder"
						aria-label={<Text id="my-zimlet.emailPlaceholder" />}
						onInput={changeEmail}
					/>
					<Button
						type="submit"
						styleType="primary"
						brand="primary"
						disabled={loading || error || adding || !email.trim()}
					>
						<Text id="my-zimlet.add" />
					</Button>
				</form>

				{addFailed && (
					<WarningBanner size="md">
						<Text id="my-zimlet.addError" />
					</WarningBanner>
				)}
				{error && (
					<WarningBanner size="md">
						<Text id="my-zimlet.loadError" />
					</WarningBanner>
				)}
				{loading && <Spinner block />}
				{!loading && !error && partners.length === 0 && (
					<p>
						<Text id="my-zimlet.empty" />
					</p>
				)}

				<ul class={style.partners}>
					{partners.map(partner => (
						<PartnerRow key={partner.id} partner={partner} onRemove={removePartner} />
					))}
				</ul>
			</div>
		</div>
	);
};

export default withIntl()(PartnersScreen);
