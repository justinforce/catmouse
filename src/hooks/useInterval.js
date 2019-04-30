import { useEffect, useRef } from 'react'

/**
 * This function is based on https://github.com/Hermanya/use-interval (MIT License), but
 * that's not widely used and I don't want to add it as a dependency. We can
 * drop in a replacement any time. --Justin Force
 *
 * I investigated also passing ...args to useInterval to mirror the signature
 * of setInterval, but when you go to shallow compare the args array to
 * evaluate whether to run the setEffect callback again, you realize it's a
 * pain and not worth it. No ...args! --Justin Force
 */

/**
 * You can update the delay, callback, and args on the fly. This is useful for
 * putting an HTTP request to sleep if you don't need it. Just set a really
 * high delay or set the callback to undefined.
 *
 * @example
 * const MySleepyComponent = () => {
 *   const [short, long] = [1000, 2000];
 *   const [delay, setDelay] = useState(short);
 *   useInterval(() => {
 *     console.log(`Current delay: ${delay}`)
 *   }, delay);
 *   return (
 *     <button
 *       type="button"
 *       onClick={() => setDelay(delay === long ? short : long)}
 *     >
 *       {delay}
 *     </button>
 *   );
 * };
 */
const useInterval = (callback, delay) => {
  const callbackRef = useRef()
  useEffect(() => {
    callbackRef.current = callback
  })
  useEffect(() => {
    const id = setInterval(() => callbackRef.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

export default useInterval
