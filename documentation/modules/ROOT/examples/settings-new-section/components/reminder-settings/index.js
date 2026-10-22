import { createElement } from 'preact';
import { useCallback, useEffect } from 'preact/hooks';
import { Text } from '@zimbra/preact-i18n';
import { ChoiceInput } from '@zimbra-client/blocks';
import { TextInput } from '@zimbra-client/components';
import { withIntl } from '../../enhancers';
import { ENABLED, DAYS, MIN_DAYS, MAX_DAYS } from '../../constants';
import { toProperty, readContent } from '../../utils/property';
import style from './style.less';

const isValidDays = text => {
	const days = Number(text);
	return /^\d+$/.test(text) && days >= MIN_DAYS && days <= MAX_DAYS;
};

// The Settings dialog gives the section the values and the functions that report a change.
const ReminderSettings = ({ activeId, value, onFieldChange, handleValidityOfTabs }) => {
	const enabled = readContent(value, ENABLED) === 'true';
	const days = readContent(value, DAYS);
	const invalid = enabled && !isValidDays(days);

	const change = useCallback(
		(name, content) => onFieldChange(name)({ target: { value: toProperty(name, content) } }),
		[onFieldChange]
	);
	const changeEnabled = useCallback(
		event => change(ENABLED, String(event.target.checked)),
		[change]
	);
	const changeDays = useCallback(event => change(DAYS, event.target.value), [change]);

	// Tells the dialog to disable Save while the section holds a value that cannot be saved.
	useEffect(() => {
		handleValidityOfTabs(activeId, invalid);
	}, [activeId, handleValidityOfTabs, invalid]);

	return (
		<div class={style.section}>
			<p>
				<Text id="my-zimlet.intro" />
			</p>
			<label class={style.row}>
				<ChoiceInput type="checkbox" checked={enabled} onChange={changeEnabled} />
				<Text id="my-zimlet.enable" />
			</label>
			<div class={style.row}>
				<label for="reply-reminder-days">
					<Text id="my-zimlet.daysBefore" />
				</label>
				<TextInput
					id="reply-reminder-days"
					type="number"
					class={style.days}
					min={MIN_DAYS}
					max={MAX_DAYS}
					value={days}
					disabled={!enabled}
					invalid={invalid}
					onInput={changeDays}
				/>
				<Text id="my-zimlet.daysUnit" />
			</div>
			{invalid && (
				<p class={style.error} role="alert">
					<Text id="my-zimlet.daysError" />
				</p>
			)}
		</div>
	);
};

export default withIntl()(ReminderSettings);
