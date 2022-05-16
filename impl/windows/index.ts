import path from 'node:path';
import {execa} from 'execa';

const executablePath = path.join(
	path.dirname(import.meta.url),
	'adjust_get_current_system_volume_vista_plus.exe',
);

async function runProgram(...args: string[]) {
	const result = await execa(executablePath, args);
	return result.stdout;
}

async function getVolumeInfo() {
	const data = await runProgram();
	const args = data.split(' ');

	return {
		volume: Number.parseInt(args[0]!, 10),
		muted: Boolean(Number.parseInt(args[1]!, 10)),
	};
}

export async function getVolume() {
	const volumeInfo = await getVolumeInfo();
	return volumeInfo.volume;
}

export async function setVolume(value: number) {
	await runProgram(String(value));
}

export async function getMuted() {
	const volumeInfo = await getVolumeInfo();
	return volumeInfo.muted;
}

export async function setMuted(value: boolean) {
	await runProgram(value ? 'mute' : 'unmute');
}
