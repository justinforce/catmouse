/**
 * index.js is the entry point for the program.  *
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
const stepLength = 1000 / fps;

// The canvas element where the world is drawn
const canvas = document.querySelector('canvas');

// The rendering context
const ctx = canvas.getContext('2d');

const ball = {
  speed: {
    x: 0.15,
    y: 0.15,
  },
  box: {
    x: 10,
    y: 10,
  },
};

const world = {
  box: {
    x: width,
    y: height,
  },
};

// All mutable state is stored here
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

// Negates val if test is false, otherwise return val
const negateIf = (test, val) => (test ? -val : val);

// Returns true if val is more than, less than, or equal to either low or high
const outOfRangeExclusive = (low, high, val) => val <= low || val >= high;

/**
 * Updates the simulation for a given time interval dt.
 */
const update = dt => () => {
  // update ball
  (() => {
    // FIXME There's a better way to do this than writing axis a billion times.
    const worldBoundary = axis => world.box[axis];
    const edgeOfWorld = axis =>
      outOfRangeExclusive(ball.box.x, worldBoundary(axis), st.ball.pos[axis]);
    const velocity = axis => negateIf(edgeOfWorld(axis), st.ball.vel[axis]);
    const velocityX = velocity('x');
    const velocityY = velocity('y');
    const incrementalVelocity = axis => st.ball.pos[axis] + (velocity(axis) * dt);
    const position = axis =>
      clamp(0, worldBoundary(axis), incrementalVelocity(axis));
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
  // draw background
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, width, height);

  // draw ball
  (() => {
    const x = st.ball.pos.x - (ball.box.x / 2);
    const y = st.ball.pos.y - (ball.box.y / 2);
    const radius = ball.box.x / 2;
    ctx.fillStyle = '#efefef';
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  })();
};

/**
 * Returns a function that runs as many updates as are needed for the given
 * timestamp and accumulated unsimulated time, draws the frame, then enqueues
 * the next step on the next animation frame.
 */
const step = (t0, accumulatedTime) => (t) => {
  const dt = accumulatedTime + (t - t0);
  const requiredUpdateCount = Math.floor(dt / stepLength);
  const leftoverTime = dt % stepLength;
  times(update(dt), requiredUpdateCount);
  draw();
  requestAnimationFrame(step(t, leftoverTime));
};

// init
canvas.width = width;
canvas.height = height;
requestAnimationFrame(step(0, 0));
