import curry from 'ramda/src/curry'
import { UNMATCHED_TRADING_DAY_STRATEGIES } from '../config/defaults'

export const findIndexB = curry((compareFn, ar, missingStrategy = UNMATCHED_TRADING_DAY_STRATEGIES.SKIP) => {
  let m = 0
  let n = ar.length - 1
  while (m <= n) {
    let k = (n + m) >> 1
    let cmp = compareFn(ar[k])
    if (cmp === undefined) throw new Error('compare function should return a number')
    if (cmp > 0) {
      m = k + 1
    } else if (cmp < 0) {
      n = k - 1
    } else {
      return k
    }
  }

  if (missingStrategy === UNMATCHED_TRADING_DAY_STRATEGIES.NEXT_TRADING_DAY && ar[m]) return m
  else if (missingStrategy === UNMATCHED_TRADING_DAY_STRATEGIES.PREV_TRADING_DAY && ar[n]) return n
  else return -1
})
