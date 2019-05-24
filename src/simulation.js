import { Application } from 'pixi.js'
import { addBunny, tickBunnies } from './bunnies'
import { Bunny } from './images'
import { randIn, times } from './util'

const createSimulation = ({
  app = new Application(),
  width = 800,
  height = 600,
  bunnies = [],
} = {}) => ({
  app,
  width,
  height,
  bunnies,
})

const initializeSimulation = (app, simulation, callback) => {
  app.loader.add(Bunny).load(() => {
    times(150, () => {
      const x = randIn(0, simulation.width)
      const y = randIn(0, simulation.height)
      const speed = randIn(-0.5, 0.5)
      addBunny({ simulation, x, y, speed })
    })
    callback()
  })
}

const tickSimulation = simulation => delta => {
  tickBunnies(simulation, delta)
}

const defaultSimulation = createSimulation()

export {
  createSimulation,
  defaultSimulation,
  initializeSimulation,
  tickSimulation,
}
