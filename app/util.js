// Returns false if low < val < high, otherwise returns true.
const outOfRange = (low, high, val) => val <= low || val >= high;

// Negates val if test is false, otherwise returns val
const negateIf = (test, val) => (test ? -val : val);

// Logs and returns whatever you pass to it
// FIXME It doesn't always work like I expect. Returns the wrong value
// sometimes? I don't know why.
const debug = (...args) => {
  console.debug(...args); // eslint-disable-line no-console
  return args;
};

// Returns a random item from list
const pickRandom = list => list[Math.floor(Math.random() * list.length)];

const addVectors = (a, b) => [a[0] + b[0], a[1] + b[1]];

const polarToCartesian = vector => [
  vector[0] * Math.cos(vector[1]),
  vector[0] * Math.sin(vector[1]),
];

export {
  addVectors,
  polarToCartesian,
  debug,
  negateIf,
  outOfRange,
  pickRandom,
};
