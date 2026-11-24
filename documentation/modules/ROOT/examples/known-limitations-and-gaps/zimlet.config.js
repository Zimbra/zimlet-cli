// Adds the version parameter to the address of every built image and font, so that the server
// answers the request. Use a version inside the --zimbraXVersion range of your package.
export default function configure(config) {
	const assetRule = config.module.rules.find(rule => rule.test?.test('image.png'));
	assetRule.generator.filename =
		'fonts/[name]_[contenthash:8][ext]?zimbraXZimletCompatibleWith=4.0.0';
}
