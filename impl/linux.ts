import {execa} from 'execa';

let defaultDeviceCache: string;
let defaultArguments: string[];

async function amixer(...arguments_: string[]) {
	const allArguments = [];
	allArguments.push(...(await getDefaultArguments()));
	if (arguments_ && arguments_.length > 0) {
		allArguments.push(...arguments_);
	}

	const result = await execa('amixer', allArguments);
	return result.stdout;
}

const reDefaultDevice = /simple mixer control '([a-z\d -]+)',\d+/i;

function parseDefaultDevice(data: string) {
	const result = reDefaultDevice.exec(data);

	if (result === null) {
		throw new Error('Alsa Mixer Error: failed to parse output');
	}

	return result[1]!;
}

const reWhichPactl = /^\/.*\/pactl$/;

async function systemHasPulseAudio() {
	try {
		const {stdout} = await execa('which', ['pactl']);
		if (reWhichPactl.test(stdout)) {
			return true;
		}
	} catch {}

	return false;
}

async function getDefaultArguments() {
	if (!defaultArguments) {
		const hasPulse = await systemHasPulseAudio();
		defaultArguments = hasPulse ? ['-D', 'pulse'] : [];
	}

	return defaultArguments;
}

async function getDefaultDevice() {
	if (defaultDeviceCache) {
		return defaultDeviceCache;
	}

	const amixerResult = await amixer();
	defaultDeviceCache = parseDefaultDevice(amixerResult);
	return defaultDeviceCache;
}

const reInfo = /[a-z][a-z ]*: playback [\d-]+ \[(\d+)%] (?:[[\d.-]+db] )?\[(on|off)]/i;

function parseInfo(data: string) {
	const result = reInfo.exec(data);

	if (result === null) {
		throw new Error('Alsa Mixer Error: failed to parse output');
	}

	return {
		volume: Number.parseInt(result[1]!, 10),
		muted: result[2] === 'off',
	};
}

async function getInfo() {
	const device = await getDefaultDevice();
	const amixerOutput = await amixer('get', device);
	return parseInfo(amixerOutput);
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
