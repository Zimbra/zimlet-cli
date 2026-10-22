const CALLBACK_PATH = '/<callback-path>';

export default function Zimlet(context) {
	const { zimbraBatchClient } = context;

	return {
		init() {
			const redirectUri = zimbraBatchClient.origin + CALLBACK_PATH;
			console.warn('Redirect address:', redirectUri);
		}
	};
}
