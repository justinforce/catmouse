import { Application } from 'pixi.js'
import React, { useEffect, useRef } from 'react'
import { addBunny, tickBunnies } from '../bunnies'
import { Bunny } from '../images'
import { times } from '../util'

const [WIDTH, HEIGHT] = [800, 600]

const createSimulation = app => ({
  app,
  width: WIDTH,
  height: HEIGHT,
  bunnies: [],
})

const initializeSimulation = (app, simulation, callback) => {
  app.loader.add(Bunny).load(() => {
    times(150, () => addBunny(simulation))
    callback()
  })
}

const tickSimulation = simulation => delta => {
  tickBunnies(simulation, delta)
}

const Sim = () => {
  const app = new Application()
  const ref = useRef()
  useEffect(() => {
    ref.current.appendChild(app.view)
    const simulation = createSimulation(app)
    initializeSimulation(app, simulation, () => {
      app.ticker.add(tickSimulation(simulation))
    })
    return () => ref.current.removeChild(app.view)
  }, [app, app.view])

  return <div ref={div => (ref.current = div)} />
}

export default Sim
