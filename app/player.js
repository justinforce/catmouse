import { mergeDeepRight } from 'ramda';
import { pickRandom } from './util';

const speed = 1;
const size = 5;

const initialState = (worldSize) => {
  const position = worldSize.map(dimension => dimension / 2);
  return {
    body: {
      position,
      size,
      velocity: [speed, 0],
    },
  };
};

const delta = (state) => {
  const { player } = state;
  const offsetOptions = [-10, -5, -1, 0, 0, 0, 1, 5, 10];
  const newPosition = [
    player.body.position[0] + pickRandom(offsetOptions),
    player.body.position[1] + pickRandom(offsetOptions),
  ];
  return mergeDeepRight(state, {
    player: {
      body: {
        position: newPosition,
        velocity: player.body.velocity,
      },
    },
  });
};

export {
  delta,
  initialState,
};
