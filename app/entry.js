import { clamp, pipe, times, mergeDeepRight } from 'ramda';
import './style.css';
import * as Ball from './ball';
import * as Drawing from './drawing';
import * as Input from './input';
import * as Ai from './ai';
import * as State from './state';
import * as World from './world';
import * as Player from './player';

// Milliseconds to skip between simulation iterations
const timeStep = 1000 / 60;

// Cap ticks so the tab doesn't lock up after being forgotten in the background
const maxTicks = Math.floor(timeStep);

const delta = state => mergeDeepRight(state, { step: state.step + 1 });

const tick = () => {
  const newState = pipe(
    Input.delta,
    Ai.delta,
    World.delta,
    Player.delta(timeStep),
    Ball.delta(timeStep),
    delta,
  )(State.get());
  State.set(newState);
};

const step = (prevFrameTimestamp, prevLeftoverTime) => (now) => {
  const timeToSimulate = prevLeftoverTime + (now - prevFrameTimestamp);
  const ticks = clamp(0, maxTicks, Math.floor(timeToSimulate / timeStep));
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
  ai: Ai.initialState(),
  ball: Ball.initialState(),
  input: Input.initialState(),
  player: initialPlayerState,
  world: initialWorldState,
};
State.set(initialState);
State.save(); // save immediately so there's something to load (free reset!)

// Initialize drawing
const { world } = State.get();
Drawing.setCanvasSize(world.size);

// Keyboard controls
Input.press(State.save, 'i');
Input.press(State.load, 'o');
Input.hold('down', 'ArrowDown s S');
Input.hold('left', 'ArrowLeft a A');
Input.hold('right', 'ArrowRight d D');
Input.hold('up', 'ArrowUp w W ');
Input.toggle('ai', '1');

// Mouse/touch controls
const [width, height] = world.size;
const leftRightTouchBoxScale = [1 / 3, 1];
const topBottomTouchBoxScale = [1 / 4, 1 / 4];
const leftTouchBox = [
  [0, 0],
  [width * leftRightTouchBoxScale[0], height * leftRightTouchBoxScale[1]],
];
const rightTouchBox = [
  [width - (width * leftRightTouchBoxScale[0]), 0],
  [width, height * leftRightTouchBoxScale[1]],
];

const topTouchBox = [
  [(width - (width / 2)) - (width * topBottomTouchBoxScale[0]), 0],
  [(width - (width / 2)) + (width * topBottomTouchBoxScale[0]),
    height * topBottomTouchBoxScale[1]],
];

const bottomTouchBox = [
  [(width - (width / 2)) - (width * topBottomTouchBoxScale[0]),
    height - (height * topBottomTouchBoxScale[1])],
  [(width - (width / 2)) + (width * topBottomTouchBoxScale[0]),
    height],
];

Input.clickHold('left', leftTouchBox, Drawing.canvas);
Input.clickHold('right', rightTouchBox, Drawing.canvas);
Input.clickHold('up', topTouchBox, Drawing.canvas);
Input.clickHold('down', bottomTouchBox, Drawing.canvas);
Input.touchHold('left', leftTouchBox, Drawing.canvas);
Input.touchHold('right', rightTouchBox, Drawing.canvas);
Input.touchHold('up', topTouchBox, Drawing.canvas);
Input.touchHold('down', bottomTouchBox, Drawing.canvas);

// Prevent context menu from long pressing canvas
Drawing.canvas.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

// Start simulation
requestAnimationFrame(step(0, 0));
