import { TICKET_PATTERN } from '../constants';
import createTicketLink from '../utils/create-ticket-link';

// Replaces each ticket number in the text of a message with a link to the ticket.
export default function linkTicketNumbers(doc) {
	const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
	const textNodes = [];
	while (walker.nextNode()) {
		textNodes.push(walker.currentNode);
	}

	textNodes.forEach(textNode => {
		// Leave text that is already a link, and text that is not shown, as it is.
		if (textNode.parentElement.closest('a, style')) {
			return;
		}

		// With one capture group, split returns the ticket numbers at the odd positions.
		const parts = textNode.data.split(TICKET_PATTERN);
		if (parts.length === 1) {
			return;
		}

		textNode.replaceWith(
			...parts.map((part, i) => (i % 2 ? createTicketLink(doc, part) : doc.createTextNode(part)))
		);
	});
}
