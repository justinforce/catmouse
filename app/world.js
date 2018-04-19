import { mergeDeepRight } from 'ramda';

const size = [800, 600];

const initialState = () => ({
  size,
});

const delta = state =>
  mergeDeepRight(state, {
    world: {
      size,
    },
  });

export {
  delta,
  initialState,
};
