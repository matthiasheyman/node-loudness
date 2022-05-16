import { execa } from 'execa'
import path from 'node:path'

const executablePath = path.join(
  path.dirname(import.meta.url),
  'adjust_get_current_system_volume_vista_plus.exe'
)

async function runProgram (...args) {
  return (await execa(executablePath, args)).stdout
}

async function getVolumeInfo () {
  const data = await runProgram()
  const args = data.split(' ')

  return {
    volume: parseInt(args[0], 10),
    muted: Boolean(parseInt(args[1], 10))
  }
}

export async function getVolume () {
  return (await getVolumeInfo()).volume
}

export async function setVolume (val) {
  await runProgram(String(val))
}

export async function getMuted () {
  return (await getVolumeInfo()).muted
}

export async function setMuted (val) {
  await runProgram(val ? 'mute' : 'unmute')
}
