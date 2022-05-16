/* eslint-env mocha */
import test from 'ava';
import * as loudness from '../index.js';

let systemVolume: number;
let isMuted: boolean;

test.before(async () => {
	await Promise.all([
		loudness.getVolume().then(v => {
			systemVolume = v;
		}),
		loudness.getMuted().then(m => {
			isMuted = m;
		}),
	]);
});

test.after(async () => {
	await Promise.all([
		loudness.setVolume(systemVolume),
		loudness.setMuted(isMuted),
	]);
});

test('should set and get the volume', async t => {
	await loudness.setVolume(15);
	const vol = await loudness.getVolume();
	t.is(vol, 15);
});

test('should set and get the mute state', async t => {
	await loudness.setMuted(true);
	const mute = await loudness.getMuted();
	t.is(mute, true);
});
