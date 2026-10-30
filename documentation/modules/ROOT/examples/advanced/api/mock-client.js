// Returns a fixed status, so that the Zimlet works before an administrator has allowed the domain.
export function getStatus() {
	return Promise.resolve('operational (mock data)');
}
