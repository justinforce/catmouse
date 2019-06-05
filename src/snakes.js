import { Sprite } from 'pixi.js'
import { Bunny } from './images'
import { AppType, InputType, SimulationType, SnakeType } from './types'

const createSnake = ({ app = AppType, x = 0, y = 0, vx = 0, vy = 0 }) => {
  const snake = new Sprite(app.loader.resources[Bunny].texture)
  snake.x = x
  snake.y = y
  snake.vx = vx
  snake.vy = vy
  snake.anchor = { x: 0.5, y: 0.5 }
  return snake
}

const addSnake = ({ simulation = SimulationType, x = 0, y = 0 }) => {
  const { app } = simulation
  const snake = createSnake({ app, x, y })
  simulation.snakes.push(snake)
  app.stage.addChild(snake)
  return snake
}

const tickSnake = ({
  input = InputType,
  delta = 1,
  width = 800,
  height = 600,
}) => (snake = SnakeType) => {
  const { up, down, left, right } = input
  /* eslint-disable no-param-reassign */
  if (up) snake.vy += -1 * delta
  if (down) snake.vy += 1 * delta
  if (left) snake.vx += -1 * delta
  if (right) snake.vx += 1 * delta
  snake.x += snake.vx
  snake.y += snake.vy
  snake.x = Math.max(0, snake.x)
  snake.y = Math.max(0, snake.y)
  snake.x = Math.min(snake.x, width)
  snake.y = Math.min(snake.y, height)
  /* eslint-enable no-param-reassign */
}

const tickSnakes = (simulation = SimulationType, delta = 1) => {
  const { input, width, height } = simulation
  simulation.snakes.forEach(tickSnake({ input, delta, width, height }))
}

export { addSnake, tickSnakes }
