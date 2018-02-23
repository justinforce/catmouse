import { clone, mergeDeepRight } from 'ramda';

/**
 * All mutable state.
 */
let state = {};

/**
 * Gets the current state.
 */
export const get = () => clone(state);

/**
 * Updates the current state by deep merging delta into state. In conflicts,
 * delta wins.
 */
export const update = (delta) => {
  const newState = mergeDeepRight(state, delta);

  // side effects
  state = newState;
};

/**
 * The last state that was saved.
 */
let savedState = state;

/**
 * Sets the current state as the save state.
 */
export const save = () => { savedState = state; };

/**
 * Sets the saved state as the current state.
 */
export const load = () => { state = savedState; };
