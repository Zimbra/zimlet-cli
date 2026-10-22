import { useCallback, useEffect, useState } from 'preact/hooks';
import { createPartner, ensurePartnersFolder, listPartners, removePartner } from '../api/contacts';

// Loads the partners and gives the screen one function for each change.
// Every change reloads the list, so the screen always shows what the server holds.
export default function usePartners(zimbraBatchClient) {
	const [folderId, setFolderId] = useState(null);
	const [partners, setPartners] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const load = useCallback(
		() =>
			ensurePartnersFolder(zimbraBatchClient)
				.then(id => {
					setFolderId(id);
					return listPartners(zimbraBatchClient, id);
				})
				.then(list => {
					setPartners(list);
					setError(null);
				})
				.catch(setError)
				.finally(() => setLoading(false)),
		[zimbraBatchClient]
	);

	useEffect(() => {
		load();
	}, [load]);

	// The functions return the promise, so the screen can show the error of a failed change.
	const add = useCallback(
		email => createPartner(zimbraBatchClient, folderId, email).then(load),
		[zimbraBatchClient, folderId, load]
	);

	const remove = useCallback(
		id => removePartner(zimbraBatchClient, id).then(load),
		[zimbraBatchClient, load]
	);

	return { partners, loading, error, add, remove };
}
