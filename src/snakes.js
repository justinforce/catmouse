import { GroupD8, Rectangle, Sprite, Texture } from 'pixi.js'
import { Bunny } from './images'
import { AppType, SimType, SnakeType } from './types'
import { copyProps, polarToCartesian } from './util'

const SPEED_INCREMENT = 0.5
const MIN_LENGTH = SnakeType.length
const MAX_LENGTH = 1000

const createSprite = (app = AppType, props = {}) => {
  // Texture is loaded sideways, so rotate it
  const { baseTexture, frame } = app.loader.resources[Bunny].texture
  const orig = new Rectangle(frame.x, frame.y, frame.height, frame.width)
  const trim = orig
  const texture = new Texture(baseTexture, frame, orig, trim, GroupD8.N)
  const sprite = new Sprite(texture)
  sprite.rotation = Math.PI / 2
  sprite.anchor = { x: 0.5, y: 0.5 }
  copyProps(Object.keys(props), props, sprite)
  return sprite
}

const create = (app = AppType, snakeProps = SnakeType) => {
  const template = { ...SnakeType, ...snakeProps }
  const snake = createSprite(app, { zIndex: MAX_LENGTH })
  const tail = []
  copyProps(Object.keys(SnakeType), template, snake)
  for (let t = 0; t < MAX_LENGTH; t += 1) {
    const sprite = createSprite(app, { zIndex: MAX_LENGTH - t })
    tail.push(sprite)
  }
  snake.tail = tail
  return snake
}

const add = (sim = SimType, snakeProps = SnakeType) => {
  const { app } = sim
  const { x, y } = snakeProps
  const snake = create(app, { x, y })
  sim.snakes.push(snake)
  app.stage.addChild(snake)
  snake.tail.forEach(t => app.stage.addChild(t))
  app.stage.sortChildren()
  return snake
}

const tick = (sim = SimType, delta = 1) => {
  const { input, width, height } = sim
  sim.snakes.forEach(snake => {
    const {
      up,
      down,
      left,
      right,
      buttonA,
      buttonX,
      buttonY,
      buttonL,
      buttonR,
    } = input
    const { tail } = snake
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
    if (buttonL) snake.length -= 1
    if (buttonR) snake.length += 1
    snake.length = Math.max(MIN_LENGTH, snake.length)
    const [vx, vy] = polarToCartesian(snake.speed * delta, snake.rotation)
    snake.x += vx
    snake.y += vy
    snake.x = Math.max(0, snake.x)
    snake.y = Math.max(0, snake.y)
    snake.x = Math.min(snake.x, width)
    snake.y = Math.min(snake.y, height)
    for (let t = tail.length - 1; t >= 0; t -= 1) {
      const next = tail[t - 1] || snake
      copyProps(['x', 'y', 'rotation'], next, tail[t])
      tail[t].visible = t < snake.length
    }
    /* eslint-enable no-param-reassign */
  })
}

export { add, tick }
