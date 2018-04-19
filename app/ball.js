import { clamp, mergeDeepRight } from 'ramda';
import { negateIf, outOfRange } from './util';
import { stepSize } from './state';

const xSpeed = 0.5;
const ySpeed = 0.15;
const size = 5;

const worldBoundary = (index, world) => world.size[index];

const velocity = (index, state) => {
  const { ball, input, world } = state;
  const edgeOfWorld =
    outOfRange(0, worldBoundary(index, world), ball.position[index]);
  const leftDirection = input.left && !input.right ? -1 : null;
  const rightDirection = input.right && !input.left ? 1 : null;
  const currentDirection = Math.sign(ball.velocity[index]);
  const direction = leftDirection || rightDirection || currentDirection;
  const velocityVector = direction * ball.speed[index];
  return negateIf(edgeOfWorld, velocityVector);
};

const position = (index, state) => {
  /**
   * Multiply velocity by stepSize to get an instantaneous velocity value
   * for this interval that automatically scales with the target frame rate.
   * This makes the simulation run at a consistent speed regardless of frame
   * rate.
   */
  const { ball, world } = state;
  const instantaneousVelocity = velocity(index, state) * stepSize;
  const unclampedPosition = ball.position[index] + instantaneousVelocity;
  return clamp(0, worldBoundary(index, world), unclampedPosition);
};

const initialState = () => ({
  size,
  position: [0, 0],
  velocity: [xSpeed, ySpeed],
  speed: [xSpeed, ySpeed],
});

const delta = state =>
  mergeDeepRight(state, {
    ball: {
      velocity: [velocity(0, state), velocity(1, state)],
      position: [position(0, state), position(1, state)],
    },
  });

export {
  delta,
  initialState,
};
