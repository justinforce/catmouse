/**
 * Returns -1, 0, or 1 if left is less than, equal to, or greater than right, respectively.
 * @param {*} left The left hand operand
 * @param {*} right The right hand operand
 * @returns {number} The result of the comparison
 */
const compare = (left, right) => {
  if (left < right) return -1
  if (left > right) return 1
  return 0
}

/**
 * Returns true if obj is a string
 * @param {*} obj The object under inspection
 * @returns {boolean} True if the object is a string
 */
const isString = obj => typeof obj === 'string' || obj instanceof String

/**
 * Returns a random value from the list
 * @param {*[]} list The list of items to pick from
 * @returns {*} The randomly picked value
 */
const pick = list => list[Math.floor(Math.random() * list.length)]

/**
 * Returns a copy of the string which has the properties:
 * 1. All upper case letters converted to lower case letters
 * 2. All leading and trailing white space removed
 * @param {string} input The input string
 * @returns {string} The sanitized string
 */
const sanitize = input => (input ? input.trim().toLowerCase() : '')

const noop = () => {}

const copyProps = (props, from, to) => {
  /* eslint-disable no-param-reassign */
  props.forEach(prop => (to[prop] = from[prop]))
}

const identity = i => i

const randIn = (low, high) => low + Math.random() * (high - low)

const times = (n, cb) => {
  for (let i = 0; i < n; i += 1) cb()
}

export {
  compare,
  copyProps,
  identity,
  isString,
  noop,
  pick,
  randIn,
  sanitize,
  times,
}
