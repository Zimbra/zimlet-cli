import { TICKET_URL } from '../constants';

// Builds the link element for one ticket number, in the document that the processor receives.
export default function createTicketLink(doc, ticketNumber) {
	const link = doc.createElement('a');
	link.href = `${TICKET_URL}${ticketNumber}`;
	// The link text is only the ticket number, so show the address on hover.
	link.title = link.href;
	link.target = '_blank';
	link.rel = 'noopener noreferrer';
	link.textContent = ticketNumber;
	return link;
}
