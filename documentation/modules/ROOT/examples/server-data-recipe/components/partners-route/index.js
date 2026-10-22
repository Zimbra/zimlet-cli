import { createElement } from 'preact';
import PartnersScreen from '../partners-screen';
import usePartnersPath from '../../hooks/use-partners-path';

// Returns the route handler. The router reads the path from the element that the handler returns.
export default function createPartnersRoute(zimbraBatchClient) {
	return function PartnersRoute() {
		const path = usePartnersPath();

		return <PartnersScreen path={path} zimbraBatchClient={zimbraBatchClient} />;
	};
}
