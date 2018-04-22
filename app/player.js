import { clamp, mergeDeepRight } from 'ramda';
import { addVectors, collide, polarToCartesian, scaleVector } from './util';

const speed = 75;
const turnRate = Math.PI / 32;
const size = 10;
const minLength = 10;
const maxLength = 1000;
const lengthIncrement = 10;

const initialState = (worldSize) => {
  const positions = [worldSize.map(axis => axis / 2)];
  return {
    positions,
    size,
    length: minLength,
    velocity: [speed, 0],
  };
};

// Returns the velocity in polar
const velocity = (state) => {
  const { input, player } = state;
  const left = input.left && !input.right;
  const right = input.right && !input.left;
  const deflection = (left ? -turnRate : 0) + (right ? turnRate : 0);
  const angle = (player.velocity[1] + deflection) % (2 * Math.PI);
  const radius = player.velocity[0];
  return [radius, angle];
};

// Returns the position in cartesian
const nextPosition = (state, timeStep, newVelocity) => {
  const { player, world } = state;
  const cartesianVelocity = polarToCartesian(newVelocity);
  const displacement = scaleVector((1 / timeStep), cartesianVelocity);
  const position = addVectors(player.positions[0], displacement);
  const x = clamp(0, world.size[0], position[0]);
  const y = clamp(0, world.size[1], position[1]);
  return [x, y];
};

const nextLength = (state) => {
  const { ball, input, player } = state;
  const canChangeSize = player.length === player.positions.length;
  const up = canChangeSize && input.up ? lengthIncrement : 0;
  const down = canChangeSize && input.down ? -lengthIncrement : 0;
  const ate = collide(
    ball.position,
    ball.size,
    player.positions[0],
    player.size,
  ) ? lengthIncrement : 0;
  return clamp(minLength, maxLength, (player.length + up + down + ate));
};

const delta = timeStep => (state) => {
  /* Use the new velocity as the input to position instead of the previous one
   * to achieve semi-implicit Euler integration which should help us converge to
   * accuracy. This helps: https://gafferongames.com/post/integration_basics/ */
  const { player } = state;
  const newVelocity = velocity(state);
  const positions = [
    nextPosition(state, timeStep, newVelocity),
    ...player.positions,
  ].slice(0, player.length);
  const newLength = nextLength(state);
  return mergeDeepRight(state, {
    player: {
      positions,
      length: newLength,
      velocity: newVelocity,
    },
  });
};

export {
  delta,
  initialState,
};
