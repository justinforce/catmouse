import { Sprite } from 'pixi.js'
import { Bunny } from './images'
import { randIn } from './util'

const createBunny = ({ app, width, height }, x, y, speed) => {
  const bunny = new Sprite(app.loader.resources[Bunny].texture)
  bunny.anchor.set(0.5)
  bunny.x = x || randIn(0, width)
  bunny.y = y || randIn(0, height)
  bunny.speed = speed || randIn(-0.5, 0.5)
  bunny.rotation = 0
  return bunny
}

const addBunny = (simulation, x, y, speed) => {
  const { app, bunnies } = simulation
  const bunny = createBunny(simulation, x, y, speed)
  simulation.bunnies = [...bunnies, bunny] // eslint-disable-line no-param-reassign
  app.stage.addChild(bunny)
}

const tickBunnies = (simulation, delta) => {
  /* eslint-disable no-param-reassign */
  const { bunnies } = simulation
  bunnies.forEach(bunny => (bunny.rotation += bunny.speed * delta))
}

export { addBunny, createBunny, tickBunnies }
