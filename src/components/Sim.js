import { Application, SCALE_MODES, settings } from 'pixi.js'
import React, { useEffect, useRef } from 'react'
import startEngine from '../engine'
import startSim from '../sim'
import { Bunny, DefaultSprite } from '../images'

const BACKGROUND = 0x00bbff

const Sim = () => {
  const app = new Application({ backgroundColor: BACKGROUND })
  const ref = useRef()

  useEffect(() => {
    const originalScaleMode = settings.SCALE_MODE
    const originalSortableChildren = settings.SORTABLE_CHILDREN
    settings.SCALE_MODE = SCALE_MODES.NEAREST
    settings.SORTABLE_CHILDREN = true
    return () => {
      settings.SCALE_MODE = originalScaleMode
      settings.SORTABLE_CHILDREN = originalSortableChildren
    }
  }, [])

  useEffect(() => {
    ref.current.appendChild(app.view)
    return () => ref.current.removeChild(app.view)
  }, [app.view])

  useEffect(() => {
    app.start()
    window.app = app
    return () => {
      app.stop()
      delete window.app
    }
  }, [app])

  useEffect(() => {
    const { sim, loaded, tick, stop: stopSim } = startSim(app)
    const { width, height } = sim
    const { game, stop: stopEngine } = startEngine({ tick, width, height })
    app.loader.add([DefaultSprite, Bunny]).load(loaded)
    window.sim = sim
    window.game = game
    return () => {
      stopEngine()
      stopSim()
      delete window.game
      delete window.sim
    }
  }, [app])

  return <div ref={div => (ref.current = div)} />
}

export default Sim
