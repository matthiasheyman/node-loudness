import {execa} from 'execa';

async function osascript(cmd: string) {
	const result = await execa('osascript', ['-e', cmd]);
	return result.stdout;
}

export async function getVolume() {
	return Number.parseInt(
		await osascript('output volume of (get volume settings)'),
		10,
	);
}

export async function setVolume(value: number) {
	await osascript(`set volume output volume ${value}`);
}

export async function getMuted() {
	return (await osascript('output muted of (get volume settings)')) === 'true';
}

export async function setMuted(value: boolean) {
	await osascript('set volume ' + (value ? 'with' : 'without') + ' output muted');
}
