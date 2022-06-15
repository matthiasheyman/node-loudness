import {platform} from 'node:os';
import * as darwin from './impl/darwin.js';
import * as linux from './impl/linux.js';
import * as windows from './impl/windows/index.js';

declare interface Loudness {
	getMuted(): Promise<boolean>;
	getVolume(): Promise<number>;
	setMuted(muted: boolean): Promise<void>;
	setVolume(volume: number): Promise<void>;
}

let impl: Loudness;

switch (platform()) {
	case 'darwin':
		impl = darwin;
		break;
	case 'linux':
		impl = linux;
		break;
	case 'win32':
		impl = windows;
		break;
	default:
		throw new Error('Your OS is currently not supported by node-loudness.');
}

export async function setVolume(volume: number) {
	return impl.setVolume(volume);
}

export async function getVolume() {
	return impl.getVolume();
}

export async function setMuted(muted: boolean) {
	return impl.setMuted(muted);
}

export async function getMuted() {
	return impl.getMuted();
}
