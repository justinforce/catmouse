import { add as addBunny, tick as tickBunnies } from './bunnies'
import { bindKeyboard, tick as tickInput } from './input'
import { add as addSnake, tick as tickSnakes } from './snakes'
import { AppType, SimType } from './types'
import { randIn, times } from './util'

export default (app = AppType) => {
  const sim = { ...SimType, app }
  const unbindKeyboard = bindKeyboard(sim)
  return {
    sim,
    stop: () => {
      unbindKeyboard()
    },
    tick: (delta = 1) => {
      tickInput(sim)
      tickSnakes(sim, delta)
      tickBunnies(sim, delta)
    },
    loaded: () => {
      const { width, height } = sim
      times(32, () => {
        const x = randIn(0, width)
        const y = randIn(0, height)
        const speed = randIn(-0.025, 0.025)
        const scale = { x: randIn(0.25, 2), y: randIn(0.25, 2) }
        addBunny({ sim, x, y, speed, scale })
      })
      addSnake(sim, { x: width / 2, y: height / 2 })
    },
  }
}
