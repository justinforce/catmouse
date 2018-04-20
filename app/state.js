import { clone } from 'ramda';

// All of the state in the entire world (except for things that keep track of a
// little of their own state like Input because it's asynchronous).
let state = {};

// The last state that was saved
let savedState;

const set = (newState) => { state = newState; };
const get = () => clone(state);
const save = () => { savedState = clone(state); };
const load = () => { set(savedState); };

export {
  get,
  load,
  save,
  set,
};
