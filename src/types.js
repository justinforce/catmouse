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

export const SimulationType = {
  app: AppType,
  bunnies: [],
}

export const InputType = {
  up: false,
  down: false,
  left: false,
  right: false,
}

export const SnakeType = {
  x: 0,
  y: 0,
  speed: 1,
  turnSpeed: 0.1,
  rotation: -Math.PI / 2,
}
