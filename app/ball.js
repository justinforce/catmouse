import { clamp } from 'ramda';
import { negateIf, outOfRange } from './util';

const xSpeed = 0.5;
const ySpeed = 0.15;
const radius = 5;
const diameter = radius * 2;

const worldBoundary = (index, state) => state.world.box.dimensions[index];

const velocity = (index, state) => {
  const edgeOfWorld =
    outOfRange(0, worldBoundary(index, state), state.ball.box.position[index]);
  const leftDirection = state.input.left && !state.input.right ? -1 : null;
  const rightDirection = state.input.right && !state.input.left ? 1 : null;
  const currentDirection = Math.sign(state.ball.box.velocity[index]);
  const direction = leftDirection || rightDirection || currentDirection;
  const velocityVector = direction * state.ball.speed[index];
  return negateIf(edgeOfWorld, velocityVector);
};

const position = (index, state) => {
  /**
   * Multiply velocity by stepSize to get an instantaneous velocity value
   * for this interval that automatically scales with the target frame rate.
   * This makes the simulation run at a consistent speed regardless of frame
   * rate.
   */
  const instantaneousVelocity = velocity(index, state) * state.stepSize;
  const unclampedPosition = state.ball.box.position[index] + instantaneousVelocity;
  return clamp(0, worldBoundary(index, state), unclampedPosition);
};

export const initialState = () => ({
  box: {
    position: [0, 0],
    dimensions: [diameter, diameter],
    velocity: [xSpeed, ySpeed],
  },
  speed: [xSpeed, ySpeed],
});

export const delta = state => ({
  ball: {
    ...state.ball,
    box: {
      ...state.ball.box,
      velocity: [velocity(0, state), velocity(1, state)],
      position: [position(0, state), position(1, state)],
    },
  },
});
