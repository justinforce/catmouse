import { filter, head, indexOf, keys, mergeDeepRight, split } from 'ramda';

/**
 * Map input flags to keys. Multiple keys per input for multiple control
 * schemes, e.g. You can press the left arrow or J or A to turn left.
 */
const inputToKeys = {
  left: split(' ', 'ArrowLeft j J a A'),
  right: split(' ', 'ArrowRight l L d D'),
};

/**
 * The initial state of the inputs
 */
export const initialState = () => ({
  left: false,
  right: false,
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
let inputState = initialState();

/**
 * Sets the state by merging the given state delta with the current state and
 * setting the state to that new value.
 *
 * TODO This set and the one in index.js should be DRY-ed
 */
const set = (delta) => {
  inputState = mergeDeepRight(inputState, delta);
};

/**
 * Returns a functor that sets the state of the input defined in inputToKeys to
 * the value specified as flagValue.
 *
 * N.B. Because this happens as an event callback instead of every step of the
 * simulation, it has to directly write its state to something so that the
 * update function can read it via the delta function and always get the latest
 * inputs.
 */
export const handleKey = flagValue => (event) => {
  const { key } = event;
  const hasKey = inputToKey => indexOf(key, inputToKey) > -1;
  const input = head(keys(filter(hasKey, inputToKeys)));
  const inputDelta = {
    [input]: flagValue,
  };

  // side effects
  set(inputDelta);
};

/**
 * Returns the changes to the input state as a subtree of the state tree.
 */
export const delta = () => ({ input: inputState });
