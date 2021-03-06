import spawn from 'cross-spawn-promise';
import { hasCommand, warn } from '../util';

export function install(cwd, isYarn) {
	let cmd = isYarn ? 'yarn' : 'npm';
	return spawn(cmd, ['install'], { cwd, stdio: 'ignore' });
}

export async function addScripts(obj, cwd, isYarn) {
	return {
		build: 'zimlet build',
		watch: 'zimlet watch',
		package: 'zimlet package'
	};
}

// Initializes the folder using `git init` and a proper `.gitignore` file
// if `git` is present in the $PATH.
export async function initGit(target) {
	let git = hasCommand('git');

	if (git) {
		const cwd = target;

		await spawn('git', ['init'], { cwd });
		await spawn('git', ['add', '-A'], { cwd });

		let gitUser, gitEmail;
		const defaultGitUser = 'Zimlet CLI';
		const defaultGitEmail = 'zimlet-cli@users.noreply.github.com';

		try {
			gitUser = (await spawn('git', ['config', 'user.name'])).toString();
		}
		catch (e) {
			warn(`Git config value of user.name not defined.  Defaulting to ${defaultGitUser} for initial commit message.`);
			gitUser = defaultGitUser;
		}

		try {
			gitEmail = (await spawn('git', ['config', 'user.email'])).toString();
		}
		catch (e) {
			warn(`Git config value of user.email not defined.  Defaulting to ${defaultGitEmail} for initial commit message.`);
			gitEmail = defaultGitEmail;
		}

		try {
			await spawn('git', ['commit', '-m', 'initial commit from zimlet-cli'], {
				cwd,
				env: {
					GIT_COMMITTER_NAME: gitUser,
					GIT_COMMITTER_EMAIL: gitEmail,
					GIT_AUTHOR_NAME: gitUser,
					GIT_AUTHOR_EMAIL: gitEmail
				}
			});
		}
		catch (e) {
			warn(`could not make initial git commit: ${e}`);
		}
	}
	else {
		warn('Could not locate `git` binary in `$PATH`. Skipping!');
	}
}

