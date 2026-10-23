const getDownloadUrl = (client, messageId) => client.resolve('/service/home/~/?id=' + messageId);

export default function Zimlet(context) {
	const { zimbraBatchClient } = context;

	return {
		init() {
			console.warn('Download address:', getDownloadUrl(zimbraBatchClient, '<message-id>'));
		}
	};
}
