import { Application, SCALE_MODES, settings } from 'pixi.js'
import React, { useEffect, useRef } from 'react'
import {
  createSimulation,
  initializeSimulation,
  tickSimulation,
} from '../simulation'

const BACKGROUND = 0x00bbff

const Sim = () => {
  const app = new Application({ backgroundColor: BACKGROUND })
  const ref = useRef()

  useEffect(() => {
    settings.SCALE_MODE = SCALE_MODES.NEAREST
  }, [])

  useEffect(() => {
    ref.current.appendChild(app.view)
    return () => ref.current.removeChild(app.view)
  }, [app.view])

  useEffect(() => {
    app.start()
    return app.stop
  }, [app])

  useEffect(() => {
    const simulation = createSimulation({ app })
    const ticker = tickSimulation(simulation)
    const terminateSimulation = initializeSimulation(app, simulation, () => {
      app.ticker.add(ticker)
    })
    return () => {
      app.ticker.remove(ticker)
      terminateSimulation()
    }
  }, [app])

  return <div ref={div => (ref.current = div)} />
}

export default Sim
