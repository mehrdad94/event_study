import curry from 'ramda/src/curry'

export const findIndexB = curry((compareFn, ar) => {
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
  return -1
})
