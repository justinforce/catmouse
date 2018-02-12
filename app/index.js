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

import { clamp, times } from 'ramda';
import './style.css';

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

// A ball that bounces around the screen for debugging
const ball = {
  speed: {
    x: 0.5,
    y: 0.15,
  },
  box: {
    x: 10,
    y: 10,
  },
};

// The world where the simulation takes place
const world = {
  box: {
    x: width,
    y: height,
  },
};

// All mutable state
const st = {
  ball: {
    pos: {
      x: (width / 2) - ball.box.x,
      y: (height / 2) - ball.box.y,
    },
    vel: {
      x: ball.speed.x,
      y: ball.speed.y,
    },
  },
};

// eslint-disable-next-line no-console
const debug = (...args) => console.debug(...args);

// Negates val if test is false, otherwise returns val
const negateIf = (test, val) => (test ? -val : val);

// Returns false if low < val < high, otherwise returns true.
const outOfRangeExclusive = (low, high, val) => val <= low || val >= high;

/**
 * Updates the simulation once
 */
const update = () => {
  // update ball
  (() => {
    const worldBoundary = axis => world.box[axis];
    const edgeOfWorld = axis =>
      outOfRangeExclusive(0, worldBoundary(axis), st.ball.pos[axis]);

    const velocity = (axis) => {
      const sign = Math.sign(st.ball.vel[axis]);
      const vel = sign * ball.speed[axis];
      return negateIf(edgeOfWorld(axis), vel);
    };
    const velocityX = velocity('x');
    const velocityY = velocity('y');

    const position = (axis) => {
      /**
       * Multiply velocity by stepSize to get an instantaneous velocity value
       * for this interval that automatically scales with the target frame rate.
       * This makes the simulation run at a consistent speed regardless of frame
       * rate.
       */
      const instantaneousVelocity = velocity(axis) * stepSize;
      const unclampedPosition = st.ball.pos[axis] + instantaneousVelocity;
      return clamp(0, worldBoundary(axis), unclampedPosition);
    };
    const positionX = position('x');
    const positionY = position('y');

    // side effects
    st.ball.vel.x = velocityX;
    st.ball.vel.y = velocityY;
    st.ball.pos.x = positionX;
    st.ball.pos.y = positionY;
  })();
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
  (() => {
    const { x, y } = st.ball.pos;
    const radius = ball.box.x / 2;

    // side effects
    ctx.fillStyle = 'magenta';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  })();
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

// init
canvas.width = width;
canvas.height = height;
requestAnimationFrame(step(0, 0));
