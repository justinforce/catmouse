import { Container, Sprite } from 'pixi.js'
import { Bunny } from './images'
import { AppType, InputType, SimulationType, SnakeType } from './types'
import { polarToCartesian } from './util'

const SPEED_INCREMENT = 0.5

const createSnake = ({
  app = AppType,
  x = SnakeType.x,
  y = SnakeType.y,
  speed = SnakeType.speed,
  turnSpeed = SnakeType.turnSpeed,
  rotation = SnakeType.rotation,
}) => {
  const sprite = new Sprite(app.loader.resources[Bunny].texture)
  sprite.rotation = Math.PI / 2
  sprite.anchor = { x: 0.5, y: 0.5 }
  const snake = new Container()
  snake.addChild(sprite)
  snake.x = x
  snake.y = y
  snake.speed = speed
  snake.turnSpeed = turnSpeed
  snake.rotation = rotation
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
  const { up, down, left, right, buttonA, buttonX, buttonY } = input
  /* eslint-disable no-param-reassign */
  if (up) snake.speed += SPEED_INCREMENT
  if (down) snake.speed += -SPEED_INCREMENT
  if (left) snake.rotation -= snake.turnSpeed
  if (right) snake.rotation += snake.turnSpeed
  if (buttonA || buttonY) snake.speed = 0
  if (buttonX || buttonY) snake.rotation = -Math.PI / 2
  if (buttonY) {
    snake.x = width / 2
    snake.y = height / 2
  }
  const [vx, vy] = polarToCartesian(snake.speed * delta, snake.rotation)
  snake.x += vx
  snake.y += vy
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
