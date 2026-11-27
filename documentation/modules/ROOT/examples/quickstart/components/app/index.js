// Required in every file that uses JSX, because JSX is compiled into createElement calls.
import { createElement } from 'preact';
// Shows translated text instead of hard-coded strings.
import { Text } from '@zimbra/preact-i18n';
import { withIntl } from '../../enhancers';
import style from './style';

// The page users see after opening the tab.
const App = () => {
	return (
		<div class={style.wrapper}>
			<div class={style.main}>
				{/* Text shows the greeting from the translation file, so it can be localized. */}
				<Text id="my-zimlet.helloWorld" />
				<p>
					<Text id="my-zimlet.intro" />
				</p>
			</div>
		</div>
	);
};

// Required so <Text /> can find the translations.
export default withIntl()(App);
