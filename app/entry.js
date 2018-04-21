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

const tick = () => {
  const newState = pipe(
    Input.delta,
    World.delta,
    Player.delta,
    Ball.delta(timeStep),
    delta,
  )(State.get());

  State.set(newState);
};

const step = (prevFrameTimestamp, prevLeftoverTime) => (now) => {
  const firstFrame = prevFrameTimestamp === 0;
  const timeToSimulate = prevLeftoverTime + (now - prevFrameTimestamp);
  const ticks = firstFrame ? 1 : Math.floor(timeToSimulate / timeStep);
  const leftoverTime = timeToSimulate % timeStep;

  requestAnimationFrame(step(now, leftoverTime));
  times(tick, ticks);
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
requestAnimationFrame(step(0, 0));
