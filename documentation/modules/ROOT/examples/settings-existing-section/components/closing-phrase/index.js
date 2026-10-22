import { createElement } from 'preact';
import { useCallback } from 'preact/hooks';
import { Text } from '@zimbra/preact-i18n';
import { HelpTooltip, TextInput } from '@zimbra-client/components';
import { withIntl } from '../../enhancers';
import { CLOSING_PHRASE, MAX_LENGTH } from '../../constants';
import { toProperty, readContent } from '../../utils/property';
import style from './style.less';

// The Writing Email page gives this component the values of the page and the function that
// reports a change.
const ClosingPhrase = ({ value, onFieldChange }) => {
	const phrase = readContent(value, CLOSING_PHRASE) ?? '';

	const changePhrase = useCallback(
		event =>
			onFieldChange(CLOSING_PHRASE)({
				target: { value: toProperty(CLOSING_PHRASE, event.target.value) }
			}),
		[onFieldChange]
	);

	return (
		<div class={style.section}>
			<div class={style.label}>
				<label for="closing-phrase">
					<Text id="my-zimlet.closingPhraseLabel" />
				</label>
				<HelpTooltip position="right" customStyle={style.tooltip}>
					<p class={style.tooltipTitle}>
						<Text id="my-zimlet.closingPhraseLabel" />
					</p>
					<p>
						<Text id="my-zimlet.closingPhraseTooltip" />
					</p>
				</HelpTooltip>
			</div>
			<div class={style.body}>
				<TextInput
					id="closing-phrase"
					value={phrase}
					maxLength={MAX_LENGTH}
					onInput={changePhrase}
				/>
			</div>
		</div>
	);
};

export default withIntl()(ClosingPhrase);
