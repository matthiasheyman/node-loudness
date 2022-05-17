# node-loudness

_This was originally forked from https://github.com/LinusU/node-loudness_

A node.js library to control the systems output volume

## Usage

The library currently has support for four simple async functions. The volume is specified as an integer between 0 and 100 (inc.).

```javascript
import * as loudness from "@matthey/loudness";

await loudness.setVolume(45);

const vol = await loudness.getVolume();
// vol = 45

await loudness.setMuted(false);

const mute = await loudness.getMuted();
// mute = false
```

## OS Support

Currently macOS, Windows (>= Vista) and Linux (ALSA) is supported, please send a pull request if you are using another setup.

**Linux users: if pulse-audio is present, pulse device will be used**
