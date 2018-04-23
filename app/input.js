import { contains, mergeDeepRight } from 'ramda';
import { debug, pointInsideBox } from './util';

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

const set = (input, flag) => {
  const inputDelta = {
    input: {
      [input]: flag,
    },
  };
  const newState = mergeDeepRight(state, inputDelta);
  state = newState;
};

const toggle = (input, keys) => {
  const toggler = flag => (event) => {
    const { key } = event;
    if (contains(key, keys.split(' '))) {
      set(input, flag);
    }
  };
  window.addEventListener('keydown', toggler(true));
  window.addEventListener('keyup', toggler(false));
};

const clickToggle = (input, box, canvas) => {
  const toggler = flag => (event) => {
    if (event.touches) return;
    const point = [event.offsetX, event.offsetY];
    if (pointInsideBox(box, point)) {
      set(input, flag);
    }
  };
  canvas.addEventListener('mousedown', toggler(true));
  canvas.addEventListener('mouseup', toggler(false));
};

const touchToggle = (input, box, canvas) => {
  canvas.addEventListener('touchstart', (event) => {
    if (!event.touches[0]) return;
    const boundingRectangle = event.target.getBoundingClientRect();
    const point = [
      event.touches[0].pageX - boundingRectangle.left,
      event.touches[0].pageY - boundingRectangle.top,
    ];
    if (pointInsideBox(box, point)) {
      set(input, true);
    }
    event.target.addEventListener('touchend', () => { set(input, false); });
  });
};

export {
  clickToggle,
  delta,
  initialState,
  press,
  toggle,
  touchToggle,
};
