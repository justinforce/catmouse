import { clamp, mergeDeepRight } from 'ramda';
import { addVectors, polarToCartesian, scaleVector } from './util';

const speed = 75;
const turnRate = Math.PI / 32;
const size = 5;

const initialState = (worldSize) => {
  const position = worldSize.map(axis => axis / 2);
  return {
    position,
    size,
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
const position = (state, timeStep, newVelocity) => {
  const { player, world } = state;
  const cartesianVelocity = polarToCartesian(newVelocity);
  const displacement = scaleVector((1 / timeStep), cartesianVelocity);
  const newPosition = addVectors(player.position, displacement);
  const x = clamp(0, world.size[0], newPosition[0]);
  const y = clamp(0, world.size[1], newPosition[1]);
  return [x, y];
};

const delta = timeStep => (state) => {
  /* Use the new velocity as the input to position instead of the previous one
   * to achieve semi-implicit Euler integration which should help us converge to
   * accuracy. This helps: https://gafferongames.com/post/integration_basics/ */
  const newVelocity = velocity(state);
  const newPosition = position(state, timeStep, newVelocity);
  return mergeDeepRight(state, {
    player: {
      position: newPosition,
      velocity: newVelocity,
    },
  });
};

export {
  delta,
  initialState,
};
