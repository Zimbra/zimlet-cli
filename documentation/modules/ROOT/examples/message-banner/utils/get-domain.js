// Returns the domain of an address in lower case, or undefined when there is none.
export const getDomain = address => address?.split('@')[1]?.toLowerCase();
