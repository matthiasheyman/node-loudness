import {platform} from 'node:os';
import * as darwin from './impl/darwin.js';
import * as linux from './impl/linux.js';
import * as windows from './impl/windows/index.js';

type Loudness = {
	getMuted: () => Promise<boolean>;
	getVolume: () => Promise<number>;
	setMuted: (muted: boolean) => Promise<void>;
	setVolume: (volume: number) => Promise<void>;
};

let implementation: Loudness;

switch (platform()) {
	case 'darwin': {
		implementation = darwin;
		break;
	}

	case 'linux': {
		implementation = linux;
		break;
	}

	case 'win32': {
		implementation = windows;
		break;
	}

	default: {
		throw new Error('Your OS is currently not supported by node-loudness.');
	}
}

export async function setVolume(volume: number) {
	return implementation.setVolume(volume);
}

export async function getVolume() {
	return implementation.getVolume();
}

export async function setMuted(muted: boolean) {
	return implementation.setMuted(muted);
}

export async function getMuted() {
	return implementation.getMuted();
}
