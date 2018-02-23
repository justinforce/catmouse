/**
 * The entry point for the program
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
import { pipe, times } from 'ramda';
import './style.css';
import * as Ball from './ball';
import * as Input from './input';
import * as State from './state';
import { debug, pickRandom } from './util';

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

/**
 * Updates the simulation once
 */
const update = () => {
  const state = State.get();
  const delta = pipe(Input.delta, Ball.delta)(state);

  // side effects
  State.update(delta);
};

/**
 * Draws the frame
 */
const draw = () => {
  const startTime = window.performance.now(); // for debug

  const state = State.get();
  const [ballX, ballY] = state.ball.box.position;
  const radiusFactor = pickRandom([1 / 2, 1, 3]);
  const ballRadius = state.ball.box.dimensions[0] * radiusFactor;
  const ballColor = pickRandom(['cyan', 'magenta', 'yellow', 'white']);

  // side effects

  // draw background
  ctx.fillStyle = '#334';
  ctx.fillRect(0, 0, width, height);

  // draw ball
  ctx.fillStyle = ballColor;
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
  ctx.fill();

  // debug
  const endTime = window.performance.now();
  const duration = endTime - startTime;
  if (duration > stepSize) debug('Slow draw!', { duration });
};

/**
 * Returns a function to be used as the callback to window.requestAnimationFrame
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
 * Sets handler to respond to keydown events on the window.
 */
const keyDown = (handler) => {
  window.addEventListener('keydown', handler);
};

/**
 * Sets toggler(true) to be called when a key is pressed and toggler(false) to
 * be called when a key is released. toggler is expected to be a higher order
 * function that returns an event handler.
 */
const keyToggle = (toggler) => {
  window.addEventListener('keydown', toggler(true));
  window.addEventListener('keyup', toggler(false));
};

/**
 * The initial state of the world when the simulation begins
 */
const initialState = {
  stepSize,
  world: {
    box: {
      dimensions: [width, height],
    },
  },
  ball: Ball.initialState(),
  input: Input.initialState(),
};

// init (side effects)
State.init(initialState);
canvas.width = width;
canvas.height = height;
keyDown(Input.press(State.save, 'i'));
keyDown(Input.press(State.load, 'o'));
keyToggle(Input.toggle('left', 'ArrowLeft j J a A'));
keyToggle(Input.toggle('right', 'ArrowRight l L d D'));
requestAnimationFrame(step(0, 0));
