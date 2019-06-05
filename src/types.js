import { Texture } from 'pixi.js'
import { Bunny, DefaultSprite } from './images'

const DEFAULT_TEXTURE = Texture.from(DefaultSprite)

export const AppType = {
  loader: {
    resources: {
      [Bunny]: {
        texture: DEFAULT_TEXTURE,
      },
    },
  },
  stage: { addChild: () => {} },
}

const inputs = {
  up: false,
  down: false,
  left: false,
  right: false,
  buttonA: false,
  buttonB: false,
  buttonX: false,
  buttonY: false,
}

export const InputType = {
  ...inputs,
  keyboard: { ...inputs },
  gamepad: { ...inputs },
}

export const SimulationType = {
  app: AppType,
  input: InputType,
  bunnies: [],
}

export const SnakeType = {
  x: 0,
  y: 0,
  speed: 1,
  turnSpeed: 0.1,
  rotation: -Math.PI / 2,
}
