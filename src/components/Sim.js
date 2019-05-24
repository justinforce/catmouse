import { Application } from 'pixi.js'
import React, { useEffect, useRef } from 'react'
import {
  createSimulation,
  initializeSimulation,
  tickSimulation,
} from '../simulation'

const [WIDTH, HEIGHT] = [800, 600]

const Sim = () => {
  const app = new Application()
  const ref = useRef()
  useEffect(() => {
    ref.current.appendChild(app.view)
    const simulation = createSimulation({
      app,
      width: WIDTH,
      height: HEIGHT,
    })
    const ticker = tickSimulation(simulation)
    initializeSimulation(app, simulation, () => {
      app.ticker.add(ticker)
    })
    return () => {
      app.ticker.remove(ticker)
      app.stop()
      ref.current.removeChild(app.view)
    }
  }, [app, app.view])

  return <div ref={div => (ref.current = div)} />
}

export default Sim
