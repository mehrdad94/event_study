/* global it expect describe */
import { UNMATCHED_TRADING_DAY_STRATEGIES } from '../config/defaults'
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

  it('should test binary search with invalid search value ', function () {
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

  it('should find next closest item index', function () {
    const items = [
      { a: 1 },
      { a: 4 },
      { a: 5 },
      { a: 6 },
      { a: 8 }
    ]

    const searchValue = 2

    const compareFunction = item => {
      const value = item.a

      if (searchValue > value) return 1
      else if (searchValue < value) return -1
      else return 0
    }

    const result = findIndexB(compareFunction, items, UNMATCHED_TRADING_DAY_STRATEGIES.NEXT_TRADING_DAY)

    expect(result).toBe(1)
  })

  it('should find next closest item with overflow value', function () {
    const items = [
      { a: 1 },
      { a: 4 },
      { a: 5 },
      { a: 6 },
      { a: 8 }
    ]

    const searchValue = 10

    const compareFunction = item => {
      const value = item.a

      if (searchValue > value) return 1
      else if (searchValue < value) return -1
      else return 0
    }

    const result = findIndexB(compareFunction, items, UNMATCHED_TRADING_DAY_STRATEGIES.NEXT_TRADING_DAY)

    expect(result).toBe(-1)
  })

  it('should find previous closest item index', function () {
    const items = [
      { a: 1 },
      { a: 4 },
      { a: 5 },
      { a: 6 },
      { a: 8 }
    ]

    const searchValue = 7

    const compareFunction = item => {
      const value = item.a

      if (searchValue > value) return 1
      else if (searchValue < value) return -1
      else return 0
    }

    const result = findIndexB(compareFunction, items, UNMATCHED_TRADING_DAY_STRATEGIES.PREV_TRADING_DAY)

    expect(result).toBe(3)
  })

  it('should find previous closest item with overflow value', function () {
    const items = [
      { a: 1 },
      { a: 4 },
      { a: 5 },
      { a: 6 },
      { a: 8 }
    ]

    const searchValue = 0

    const compareFunction = item => {
      const value = item.a

      if (searchValue > value) return 1
      else if (searchValue < value) return -1
      else return 0
    }

    const result = findIndexB(compareFunction, items, UNMATCHED_TRADING_DAY_STRATEGIES.PREV_TRADING_DAY)

    expect(result).toBe(-1)
  })
})
