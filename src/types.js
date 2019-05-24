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
