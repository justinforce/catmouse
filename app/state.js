import { clone, mergeDeepRight } from 'ramda';

// All mutable state
let state = {};

export const get = () => clone(state);
export const update = (delta) => {
  state = mergeDeepRight(state, delta);
};

let savedState = state;
export const save = () => { savedState = state; };
export const load = () => { state = savedState; };
