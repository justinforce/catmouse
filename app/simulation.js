import { clone, mergeDeepRight, pipe, times } from 'ramda';
import * as Ball from './ball';
import * as Drawing from './drawing';
import * as Input from './input';
import * as Player from './player';
import * as World from './world';
import { debug } from './util';

// All of the state in the entire world (except for things that keep track of a
// little of their own state like Input because it's asynchronous).
let state = {};

// The last state that was saved
let savedState;

// Target frames per second
const fps = 60;

// How much time to simulate each update
const stepSize = 1000 / fps;

const set = (newState) => { state = newState; };
const get = () => clone(state);
const save = () => { savedState = clone(state); };
const load = () => { set(savedState); };

const init = () => {
  const initialWorldState = World.initialState();
  const initialPlayerState = Player.initialState(initialWorldState.size);
  const initialState = {
    step: 0,
    ball: Ball.initialState(),
    input: Input.initialState(),
    player: initialPlayerState,
    world: initialWorldState,
  };

  set(initialState);
  save(); // save immediately so there's something to load--like a reset button
  return initialState;
};

const delta = (inputState) => {
  const newStep = inputState.step + 1;
  return mergeDeepRight(inputState, {
    step: newStep,
  });
};

const update = () => {
  const newState = pipe(
    Input.delta,
    World.delta,
    Player.delta,
    Ball.delta,
    delta,
  )(state);

  set(newState);
};

/**
 * Returns a function to be used as the callback to
 * window.requestAnimationFrame. The returned function
 *
 * 1. Enqueues the next step on the next animation frame
 * 2. Runs as many updates as are needed for the given prevFrameTime and
 *    prevLeftoverTime
 * 3. Draws the frame
 */
const step = (prevFrameTime, prevLeftoverTime) => (now) => {
  const isFirstFrame = prevFrameTime === 0;
  const timeToSimulate = prevLeftoverTime + (now - prevFrameTime);
  const updateCount = isFirstFrame ? 1 : Math.floor(timeToSimulate / stepSize);
  const leftoverTime = timeToSimulate % stepSize;

  // requestAnimationFrame first to get it enqueued ASAP.
  requestAnimationFrame(step(now, leftoverTime));
  times(update, updateCount);

  const drawStart = window.performance.now();
  Drawing.drawScene(state);
  const drawEnd = window.performance.now();
  const drawTime = drawEnd - drawStart;

  if (updateCount > 1) debug('Frame skipped!', { timeToSimulate, updateCount });
  if (drawTime > stepSize) debug('Slow draw!', { drawTime });
};

export {
  get,
  init,
  load,
  save,
  step,
  stepSize,
  update,
};
