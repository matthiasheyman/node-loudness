import {execa} from 'execa';

async function amixer(...args: string[]) {
	const result = await execa('amixer', args);
	return result.stdout;
}

let defaultDeviceCache: string;
const reDefaultDevice = /simple mixer control '([a-z\d -]+)',\d+/i;

function parseDefaultDevice(data: string) {
	const result = reDefaultDevice.exec(data);

	if (result === null) {
		throw new Error('Alsa Mixer Error: failed to parse output');
	}

	return result[1]!;
}

async function getDefaultDevice() {
	if (defaultDeviceCache) {
		return defaultDeviceCache;
	}

	const amixerResult = await amixer();
	defaultDeviceCache = parseDefaultDevice(amixerResult);
	return defaultDeviceCache;
}

const reInfo
  = /[a-z][a-z ]*: playback [\d-]+ \[(\d+)%] (?:[[\d.-]+db] )?\[(on|off)]/i;

function parseInfo(data: string) {
	const result = reInfo.exec(data);

	if (result === null) {
		throw new Error('Alsa Mixer Error: failed to parse output');
	}

	return {volume: Number.parseInt(result[1]!, 10), muted: result[2] === 'off'};
}

async function getInfo() {
	return parseInfo(await amixer('get', await getDefaultDevice()));
}

export async function getVolume() {
	const info = await getInfo();
	return info.volume;
}

export async function setVolume(value: number) {
	const device = await getDefaultDevice();
	await amixer('set', device, `${value}%`);
}

export async function getMuted() {
	const info = await getInfo();
	return info.muted;
}

export async function setMuted(value: boolean) {
	const device = await getDefaultDevice();
	await amixer('set', device, value ? 'mute' : 'unmute');
}
