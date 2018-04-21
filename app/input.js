import { contains, mergeDeepRight } from 'ramda';

const initialState = () => ({
  input: {
    left: false,
    right: false,
  },
});

/**
 * The last known input state, to be written whenever a state change is required
 * (inputs are set or unset, e.g. a key is pressed or released) and read every
 * update via delta(). Usually we want to avoid holding state inside a module
 * like this, but Input is special because it's unpredictable--updates come when
 * the user presses and releases buttons instead of when the update comes
 * around, so cache the state in this intermediate object for easy retrieval by
 * delta() later.
 */
let state = initialState();

const delta = previousState => mergeDeepRight(previousState, state);

const press = (callback, key) => {
  const handler = (event) => { if (event.key === key) callback(); };
  window.addEventListener('keydown', handler);
};

const toggle = (input, keys) => {
  const toggler = flag => (event) => {
    const { key } = event;
    if (contains(key, keys.split(' '))) {
      const inputDelta = {
        input: {
          [input]: flag,
        },
      };
      const newState = mergeDeepRight(state, inputDelta);
      state = newState;
    }
  };
  window.addEventListener('keydown', toggler(true));
  window.addEventListener('keyup', toggler(false));
};

export {
  delta,
  initialState,
  press,
  toggle,
};
