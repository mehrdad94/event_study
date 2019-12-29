/* global it expect describe */
import { findIndexB } from './helper'

describe('should test helper.js', function () {
  it('should test binary search', function () {
    const items = [
      { a: 1 },
      { a: 2 },
      { a: 3 },
      { a: 4 }
    ]

    const searchValue = 3

    const compareFunction = item => {
      const value = item.a

      if (searchValue > value) return 1
      else if (searchValue < value) return -1
      else return 0
    }

    const result = findIndexB(compareFunction, items)

    expect(result).toBe(2)
  })

  it('should test binary search with invalid search vlaue ', function () {
    const items = [
      { a: 1 },
      { a: 2 },
      { a: 3 },
      { a: 4 }
    ]

    const searchValue = 5

    const compareFunction = item => {
      const value = item.a

      if (searchValue > value) return 1
      else if (searchValue < value) return -1
      else return 0
    }

    const result = findIndexB(compareFunction, items)

    expect(result).toBe(-1)
  })
})
