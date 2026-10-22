import { useClientConfig } from '@zimbra-client/hooks';
import { SLUG } from '../constants';

// Builds the address of the screen from the Contacts area name that the Modern UI is configured with.
export default function usePartnersPath() {
	const { slugs } = useClientConfig({ slugs: 'routes.slugs' });
	return `/${slugs.contacts}/${SLUG}`;
}
