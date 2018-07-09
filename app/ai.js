import { mergeDeepRight } from 'ramda';
import { angleBetween } from './util';

const initialState = () => ({});

const delta = (state) => {
  const {
    ball, input, player,
  } = state;
  const playerBallAngle = angleBetween(player.positions[0], ball.position);
  const playerBallOffset = player.velocity[1] - playerBallAngle;
  const left = input.ai ? playerBallOffset > 0 : input.left;
  const right = input.ai ? playerBallOffset < 0 : input.right;
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
