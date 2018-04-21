import { clamp, mergeDeepRight } from 'ramda';
import { addVectors, polarToCartesian } from './util';

const speed = 5;
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

const velocity = (state) => {
  const { input, player } = state;
  const left = input.left && !input.right;
  const right = input.right && !input.left;
  const dAngle = (left ? -turnRate : 0) + (right ? turnRate : 0);
  const rawAngle = player.velocity[1] + dAngle;
  const angle = rawAngle > (2 * Math.PI) ? 0 : rawAngle;
  const radius = player.velocity[0];
  return [radius, angle];
};

const position = (state, inputVelocity) => {
  const { player, world } = state;
  const cartesianVelocity = polarToCartesian(inputVelocity);
  const newPosition = addVectors(player.position, cartesianVelocity);
  const newX = clamp(0, world.size[0], newPosition[0]);
  const newY = clamp(0, world.size[1], newPosition[1]);
  return [newX, newY];
};

const delta = (state) => {
  const newVelocity = velocity(state);
  const newPosition = position(state, vel);
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
