import { AUTO, Game } from 'phaser'

function preload() {
  this.load.setBaseURL('http://labs.phaser.io')
  this.load.image('sky', 'assets/skies/space3.png')
  this.load.image('logo', 'assets/sprites/phaser3-logo.png')
  this.load.image('red', 'assets/particles/red.png')
}

function create() {
  this.add.image(400, 300, 'sky')

  const particles = this.add.particles('red')

  const emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: 'ADD',
  })

  const logo = this.physics.add.image(400, 100, 'logo')

  logo.setVelocity(100, 200)
  logo.setBounce(1, 1)
  logo.setCollideWorldBounds(true)

  emitter.startFollow(logo)
}

// TODO Can just make this function that references this.elapsedPhysics or whatever.
const updater = tick =>
  function update(_, delta) {
    /*
     * Convert the time elapsed in ms value we get from Phaser to a scalar that
     * is closest to 1 when we hit our ideal frame rate, e.g. with a target FPS
     * of 60, a Phaser delta of 18.6 get a normalized delta of 1.116 because
     * 18.6/16.6 = 1.116. This simplifies physics because it makes speed about
     * pixels per frame which is easier for my brain. It doesn't matter if the
     * frame rate actually hits at the target in practice. All that matters is
     * the scalar is constant, i.e. I can reason about 60 FPS even if it runs
     * in 30 FPS.
     */
    const { targetFps } = this.game.loop
    const targetDelta = 1000 * (1 / targetFps)
    const normalizedDelta = delta / targetDelta
    tick(normalizedDelta)
  }

const deleteExistingNode = () => {
  const nodeID = 'engineCanvasNode'
  const node = document.querySelector(`#${nodeID}`)
  if (node) node.remove()
  return nodeID
}

export default ({ tick, width, height }) => {
  /*
   * We delete any existing node because Hot Module Replacement can result in
   * new canvases being inserted, and it seems like calling game.destroy()
   * isn't cutting it.
   */
  const nodeID = deleteExistingNode()
  const update = updater(tick)
  const game = new Game({
    width,
    height,
    type: AUTO,
    physics: {
      default: 'arcade',
    },
    scene: {
      preload,
      create,
      update,
    },
  })
  game.canvas.id = nodeID
  window.game = game
  return { game, stop: game.destroy }
}
