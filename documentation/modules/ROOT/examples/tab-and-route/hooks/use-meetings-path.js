import { useClientConfig } from '@zimbra-client/hooks';
import { SLUG } from '../constants';

// Builds the address of the screen from the Video vertical name that the Modern UI is configured with.
export default function useMeetingsPath() {
	const { slugs } = useClientConfig({ slugs: 'routes.slugs' });
	return `/${slugs.videoapps}/${SLUG}`;
}
