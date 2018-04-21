import { pipe, times, mergeDeepRight } from 'ramda';
import './style.css';
import * as Ball from './ball';
import * as Drawing from './drawing';
import * as Input from './input';
import * as State from './state';
import * as World from './world';
import * as Player from './player';

// Milliseconds to skip between simulation iterations
const timeStep = 1000 / 60;

const delta = state => mergeDeepRight(state, { step: state.step + 1 });

/**
 * Step the simulation forward a single increment. If the framerate drops, call
 * this multiple times to catch up. See handleFrame for more information.
 */
const step = () => {
  const newState = pipe(
    Input.delta,
    World.delta,
    Player.delta,
    Ball.delta(timeStep),
    delta,
  )(State.get());

  State.set(newState);
};

/**
 * Returns a function to be used as the callback to requestAnimationFrame which
 * updates the entire simulation and draws the scene for a single frame.
 */
const handleFrame = (prevFrameTimestamp, prevLeftoverTime) => (now) => {
  const firstFrame = prevFrameTimestamp === 0;
  const timeToSimulate = prevLeftoverTime + (now - prevFrameTimestamp);
  const stepCount = firstFrame ? 1 : Math.floor(timeToSimulate / timeStep);
  const leftoverTime = timeToSimulate % timeStep;

  requestAnimationFrame(handleFrame(now, leftoverTime));
  times(step, stepCount);
  Drawing.drawScene(State.get());
};

// Initialize state
const initialWorldState = World.initialState();
const initialPlayerState = Player.initialState(initialWorldState.size);
const initialState = {
  step: 0,
  ball: Ball.initialState(),
  input: Input.initialState(),
  player: initialPlayerState,
  world: initialWorldState,
};
State.set(initialState);
State.save(); // save immediately so there's something to load

// Initialize drawing
const { world } = State.get();
Drawing.setCanvasSize(world.size);

// Initialize controls
Input.press(State.save, 'i');
Input.press(State.load, 'o');
Input.toggle('left', 'ArrowLeft j J a A');
Input.toggle('right', 'ArrowRight l L d D');

// Start simulation
requestAnimationFrame(handleFrame(0, 0));
