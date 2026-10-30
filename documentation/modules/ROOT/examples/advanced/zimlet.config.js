import path from 'node:path';

// Chooses the module behind `import 'service-client'`: the mock for `zimlet watch`, the live
// client for `zimlet build`.
export default function configure(config, env) {
	const client = env.watch ? 'mock-client.js' : 'live-client.js';
	config.resolve.alias['service-client'] = path.resolve(env.cwd, 'src/api', client);
}
