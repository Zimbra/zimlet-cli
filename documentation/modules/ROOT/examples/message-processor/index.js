import linkTicketNumbers from './processors/link-ticket-numbers';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// The handler returns the processor. The message viewer calls the processor with the message.
			plugins.register('messageProcessors:emailProcessor', () => linkTicketNumbers);
		}
	};
}
