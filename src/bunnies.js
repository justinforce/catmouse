import { Sprite } from 'pixi.js'
import { Bunny } from './images'
import { AppType, SimulationType } from './types'

const DEFAULT_SPEED = 0.05

const create = ({
  app = AppType,
  x = 0,
  y = 0,
  speed = DEFAULT_SPEED,
  rotation = 0,
  scale = { x: 1, y: 1 },
} = {}) => {
  const bunny = new Sprite(app.loader.resources[Bunny].texture)
  bunny.anchor.set(0.5)
  bunny.x = x
  bunny.y = y
  bunny.speed = speed
  bunny.rotation = rotation
  bunny.scale = scale
  return bunny
}

const add = ({
  simulation = SimulationType,
  x = 0,
  y = 0,
  speed = DEFAULT_SPEED,
  scale = { x: 1, y: 1 },
} = {}) => {
  const { app } = simulation
  const bunny = create({ app, x, y, speed, scale })
  simulation.bunnies.push(bunny) // eslint-disable-line no-param-reassign
  app.stage.addChild(bunny)
  return bunny
}

const tick = (simulation = SimulationType, delta = 1) => {
  /* eslint-disable no-param-reassign */
  const { bunnies } = simulation
  bunnies.forEach(bunny => (bunny.rotation += bunny.speed * delta))
}

export { add as addBunny, tick as tickBunnies }
