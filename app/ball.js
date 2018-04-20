import { clamp, mergeDeepRight } from 'ramda';
import { negateIf, outOfRange } from './util';

const xSpeed = 0.5;
const ySpeed = 0.15;
const size = 5;

const worldBoundary = (axis, world) => world.size[axis];

const axisVelocity = (axis, state) => {
  const { ball, input, world } = state;
  const edgeOfWorld =
    outOfRange(0, worldBoundary(axis, world), ball.position[axis]);
  const left = axis === 0 && input.left && !input.right ? -1 : null;
  const right = axis === 0 && input.right && !input.left ? 1 : null;
  const currentDirection = Math.sign(ball.velocity[axis]);
  const direction = left || right || currentDirection;
  const velocityVector = direction * ball.speed[axis];
  return negateIf(edgeOfWorld, velocityVector);
};

const velocity = state => [
  axisVelocity(0, state),
  axisVelocity(1, state),
];

const axisPosition = (stepSize, axis, state, inputVelocity) => {
  /**
   * Multiply velocity by stepSize to get an instantaneous velocity value
   * for this interval that automatically scales with the target frame rate.
   * This makes the simulation run at a consistent speed regardless of frame
   * rate.
   */
  const { ball, world } = state;
  const instantaneousVelocity = inputVelocity[axis] * stepSize;
  const unclampedPosition = ball.position[axis] + instantaneousVelocity;
  return clamp(0, worldBoundary(axis, world), unclampedPosition);
};

const position = (stepSize, state, inputVelocity) => [
  axisPosition(stepSize, 0, state, inputVelocity),
  axisPosition(stepSize, 1, state, inputVelocity),
];

const initialState = () => ({
  size,
  position: [0, 0],
  velocity: [xSpeed, ySpeed],
  speed: [xSpeed, ySpeed],
});

const delta = stepSize => (state) => {
  const vel = velocity(state);
  const pos = position(stepSize, state, vel);
  return mergeDeepRight(state, {
    ball: {
      velocity: vel,
      position: pos,
    },
  });
};

export {
  delta,
  initialState,
};
