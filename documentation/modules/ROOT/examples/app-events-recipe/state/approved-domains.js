// The domains that the user chose to send to, and whether a domain was added since the last save.
const approved = new Set();
let changed = false;

export const setApproved = domains => domains.forEach(domain => approved.add(domain));

export const isApproved = domain => approved.has(domain);

export const approve = domains =>
	domains.forEach(domain => {
		if (!approved.has(domain)) {
			approved.add(domain);
			changed = true;
		}
	});

export const hasChanges = () => changed;

export const getApproved = () => [...approved];

export const markSaved = () => {
	changed = false;
};
