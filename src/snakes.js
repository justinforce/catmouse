import { Container, Sprite } from 'pixi.js'
import { Bunny } from './images'
import { AppType, SimulationType, SnakeType } from './types'
import { polarToCartesian } from './util'

const SPEED_INCREMENT = 0.5

const createSprite = app => {
  const sprite = new Sprite(app.loader.resources[Bunny].texture)
  sprite.rotation = Math.PI / 2
  sprite.anchor = { x: 0.5, y: 0.5 }
  return sprite
}

const create = (app = AppType, snakeProps = SnakeType) => {
  const template = { ...SnakeType, ...snakeProps }
  const snake = new Container()
  const sprite = createSprite(app)
  snake.addChild(sprite)
  Object.keys(SnakeType).forEach(key => (snake[key] = template[key]))
  return snake
}

const add = (simulation = SimulationType, snakeProps = SnakeType) => {
  const { app } = simulation
  const { x, y } = snakeProps
  const snake = create(app, { x, y })
  simulation.snakes.push(snake)
  app.stage.addChild(snake)
  return snake
}

const tick = (simulation = SimulationType, delta = 1) => {
  const { input, width, height } = simulation
  simulation.snakes.forEach(snake => {
    const { up, down, left, right, buttonA, buttonX, buttonY } = input
    const tail = [{ x: snake.x, y: snake.y }, ...snake.tail].slice(
      0,
      snake.length
    )
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
    snake.tail = tail
    /* eslint-enable no-param-reassign */
  })
}

export { add as addSnake, tick as tickSnakes }
