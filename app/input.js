import { contains, mergeDeepRight } from 'ramda';

/**
 * The initial state of the inputs
 */
export const initialState = () => ({
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

/**
 * Returns the changes to the input state as a subtree of the state tree.
 */
export const delta = previousState => mergeDeepRight(previousState, state);

/**
 * Returns a function to be used as an event callback. The callback will be
 * triggered when an event like { key: key } is passed in, e.g.
 *
 *     window.addEventListener('keydown', press(State.save, 'i'));
 *
 * and State.save will be called whenever event.key === 'i'
 */
export const press = (callback, key) => (event) => {
  if (event.key === key) callback();
};

/**
 * Returns a function to be used as an event callback. Set
 * state.input[input] = true when the flag === true, and false when
 * flag === false. By currying (input, keys) separately from flag, we can easily
 * set up handlers for enabling and disabling the input, e.g.
 *
 *     const toggler = toggle('left', 'ArrowLeft j J a A');
 *     window.addEventListener('keydown', toggler(true));
 *     window.addEventListener('keyup', toggler(false));
 *
 * And now state.input.left will be set to true when any of the specified keys
 * are pressed and false when they're released.
 */
export const toggle = (input, keys) => flag => (event) => {
  const { key } = event;
  if (contains(key, keys.split(' '))) {
    const inputDelta = {
      input: {
        [input]: flag,
      },
    };
    const newState = mergeDeepRight(state, inputDelta);

    // side effects
    state = newState;
  }
};
