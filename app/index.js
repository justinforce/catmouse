/**
 * index.js is the entry point for the program.  *
 * Design Goals:
 *
 * 1. Don't introduce new files, types, indirection, etc. unless we have to.
 *    Simple data structures and functions should be good enough.
 * 2. Favor a functional style. Avoid side effects as far as is practical.
 * 3. When side effects are required, group them all at the end of the function.
 */

// import { assoc } from 'ramda';
import './style.css';

// Width of the world
const width = 800;

// Height of the world
const height = 600;

// Target frames per second
const fps = 60;

// How much time to simulate each update
const timeStep = 1000 / fps;

// The canvas element where the world is drawn
const canvas = document.querySelector('canvas');
// const ctx = canvas.getContext('2d');

/**
 * Updates the simulation
 */
function update() {
}

/**
 * Draws the frame
 */
function draw() {
}

/**
 * Performs all of the updates required since the last frame, then draws the
 * frame.
 *
 * FIXME Relies on external variable timeStep
 * FIXME Mutates state of dt
 */
function step(dt0, lastFrame) {
  return (now) => {
    let dt;
    for (dt = dt0 + (now - lastFrame); dt >= timeStep; dt -= timeStep) {
      update();
    }
    draw();
    requestAnimationFrame(step(dt, now));
  };
}

function init() {
  canvas.width = width;
  canvas.height = height;
  requestAnimationFrame(step(0, 0));
}

init();
