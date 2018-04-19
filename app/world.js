import { mergeDeepRight } from 'ramda';

const size = [800, 600];

const initialState = () => ({
  step: 0,
  body: {
    size,
  },
});

const delta = state =>
  mergeDeepRight(state, {
    world: {
      body: {
        size,
      },
    },
  });

export {
  delta,
  initialState,
};
