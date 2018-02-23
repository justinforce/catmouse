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
export const save = () => { savedState = clone(state); };

/**
 * Sets the saved state as the current state.
 */
export const load = () => { state = savedState; };

/**
 * Initializes the state, given an initialState.
 */
export const init = (initialState) => {
  // side effects
  update(initialState);

  /**
   * If you try to load() without doing a save() first, there's nothing to load.
   * So go ahead and save the initial state. Now loading the state will just
   * reset the simulation.
   */
  save();
};
