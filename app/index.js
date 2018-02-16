/**
 * index.js is the entry point for the program
 *
 * Design Goals:
 *
 * 1. Don't introduce new files, types, indirection, etc. unless we have to.
 *    Simple data structures and functions should be good enough.
 * 2. Favor a functional style. Avoid side effects as far as is practical.
 * 3. When side effects are required, group them all at the end of the function.
 * 4. Favor vectors with property names x/y as it will encourage generic
 *    functions.
 */

import { filter, gt, head, indexOf, keys, split, times } from 'ramda';
import './style.css';
import * as Ball from './ball';
import { debug } from './util';

// Width of the world
const width = 800;

// Height of the world
const height = 600;

// Target frames per second
const fps = 60;

// How much time to simulate each update
const stepSize = 1000 / fps;

// The canvas element where the world is drawn
const canvas = document.querySelector('canvas');

// The rendering context
const ctx = canvas.getContext('2d', { alpha: false });

// All mutable state
let state = {
  stepSize,
  world: {
    box: {
      dimensions: [width, height],
    },
  },
  ball: Ball.initialState(),
  input: {
    left: false,
    right: false,
  },
};

/**
 * Updates the simulation once
 */
const update = () => {
  const ballDelta = Ball.delta(state);
  state = { ...state, ...ballDelta };
};

/**
 * Draws the frame
 */
const draw = () => {
  const startTime = window.performance.now();

  // draw background
  ctx.fillStyle = '#334';
  ctx.fillRect(0, 0, width, height);

  // draw ball
  const [x, y] = state.ball.box.position;
  const radius = state.ball.box.dimensions[0] / 2;

  // side effects
  ctx.fillStyle = 'magenta';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();

  const endTime = window.performance.now();
  const duration = endTime - startTime;

  // debug
  if (duration > stepSize) debug('Slow draw!', { duration });
};

/**
 * Returns a functor to be used as the callback to window.requestAnimationFrame
 * which enqueues the next step on the next animation frame, runs as many
 * updates as are needed for the given prevFrameTime and prevLeftoverTime, then
 * draws the frame.
 */
const step = (prevFrameTime, prevLeftoverTime) => (now) => {
  const isFirstFrame = prevFrameTime === 0;
  const timeToSimulate = prevLeftoverTime + (now - prevFrameTime);
  const updateCount = isFirstFrame ? 1 : Math.floor(timeToSimulate / stepSize);
  const leftoverTime = timeToSimulate % stepSize;

  // side effects. requestAnimationFrame first to get it enqueued ASAP.
  requestAnimationFrame(step(now, leftoverTime));
  times(update, updateCount);
  draw();

  // debug
  if (updateCount > 1) debug('Frame skipped!', { timeToSimulate, updateCount });
};

/**
 * Map input flags to keys. Multiple keys per input for multiple control
 * schemes.
 */
const inputToKeys = {
  left: split(' ', 'ArrowLeft j J a A'),
  right: split(' ', 'ArrowRight l L d D'),
};

/**
 * Returns a functor that sets the state of the input defined in inputToKeys to
 * the value specified as flagValue.
 */
const handleKey = flagValue => (event) => {
  const { key } = event;
  const hasKey = inputToKey => gt(indexOf(key, inputToKey), 0);
  const input = head(keys(filter(hasKey, inputToKeys)));

  // side effects
  state.input[input] = flagValue;
};

// init
canvas.width = width;
canvas.height = height;
window.addEventListener('keydown', handleKey(true));
window.addEventListener('keyup', handleKey(false));
requestAnimationFrame(step(0, 0));
