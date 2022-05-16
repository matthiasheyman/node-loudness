import os from 'node:os';
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

switch (os.type()) {
	case 'Darwin':
		impl = darwin;
		break;
	case 'Linux':
		impl = linux;
		break;
	case 'Windows_NT':
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
