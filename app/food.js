import { find, mergeDeepRight } from 'ramda';

const initialState = () => ({
  positions: [],
});

const newPositions = (state) => {
  /*
   * 1. Prune any eaten positions
   * 2. Add any applicable positions
   */
  const survivors = find((position) => {
  }, state.food.positions);
};

const delta = state =>
  mergeDeepRight(state, { positions: newPositions(state) });

export {
  delta,
  initialState,
};
