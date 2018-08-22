import { mergeDeepRight } from 'ramda';
import { angleBetween } from './util';

const initialState = () => ({});

const delta = (state) => {
  const {
    ball, input, player,
  } = state;
  if (!input.ai) return state;
  const playerBallAngle = angleBetween(player.positions[0], ball.position);
  const playerBallOffset = player.velocity[1] - playerBallAngle;
  const left = playerBallOffset > 0;
  const right = playerBallOffset < 0;
  return mergeDeepRight(state, {
    input: {
      left,
      right,
    },
  });
};

export {
  initialState,
  delta,
};
