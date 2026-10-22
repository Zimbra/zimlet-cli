import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { withIntl } from '../../enhancers';

// The name of the section in the list of the Settings dialog.
const SettingsTitle = () => <Text id="my-zimlet.sectionTitle" />;

export default withIntl()(SettingsTitle);
