import { expect, test, beforeEach, afterEach } from "vitest";
import * as loudness from "../index.js";

let systemVolume: number;
let isMuted: boolean;

beforeEach(async () => {
  await Promise.all([
    loudness.getVolume().then((v) => {
      systemVolume = v;
    }),
    loudness.getMuted().then((m) => {
      isMuted = m;
    }),
  ]);
});

afterEach(async () => {
  await Promise.all([loudness.setVolume(systemVolume), loudness.setMuted(isMuted)]);
});

test("should set and get the volume", async () => {
  await loudness.setVolume(15);
  const vol = await loudness.getVolume();
  expect(vol).toBe(15);
});

test("should set and get the mute state", async () => {
  await loudness.setMuted(true);
  const mute = await loudness.getMuted();
  expect(mute).toBe(true);
});
