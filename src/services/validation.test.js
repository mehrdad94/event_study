/* global it expect describe */
import {
  hasValidTimeline,
  hasValidPrices,
  hasValidCalendar,
  hasEnoughPrices,
  hasValidMMStructure
} from './validation'

import {
  extractMarketModelRequiredInfo
} from './eventStudy'

describe('Should test validations', function () {
  it('should validate timeline', function () {
    const validTimeline = {
      T0T1: 1,
      T1E: 1,
      ET2: 1,
      T2T3: 1
    }

    expect(hasValidTimeline(validTimeline)).toBe(true)

    const invalidTimeLine = {
      T0T1: '1',
      T1E: 1,
      ET2: 1,
      T2T3: 1
    }

    expect(hasValidTimeline(invalidTimeLine)).toBe(false)
  })

  it('should validate price information', function () {
    const operationColumn = 'Close'
    const dateColumn = 'Date'

    const invalidPrice = [
      { [dateColumn]: '2016-12-01' }
    ]

    expect(hasValidPrices(invalidPrice, operationColumn, dateColumn)).toBe(false)

    const validPrice = [
      { [dateColumn]: '2016-12-01', [operationColumn]: 200 }
    ]

    expect(hasValidPrices(validPrice, operationColumn, dateColumn)).toBe(true)
  })

  it('should validate calendar', function () {
    const validCalendar = {
      '2016-12-01': {}
    }

    expect(hasValidCalendar(validCalendar)).toBe(true)

    const invalidCalendar = {
      '2016': ''
    }

    expect(hasValidCalendar(invalidCalendar)).toBe(false)
  })

  it('Should check all event dates have enough stock data', function () {
    const timeline = {
      T0T1: 1,
      T1E: 1,
      ET2: 1,
      T2T3: 1
    }
    const prices = [
      { Date: '2016-12-01' },
      { Date: '2016-12-02' },
      { Date: '2016-12-03' },
      { Date: '2016-12-04' },
      { Date: '2016-12-05' },
      { Date: '2016-12-06' },
      { Date: '2016-12-07' },
      { Date: '2016-12-08' },
      { Date: '2016-12-09' },
      { Date: '2016-12-10' },
      { Date: '2016-12-11' },
      { Date: '2016-12-12' }
    ]

    expect(hasEnoughPrices(prices, '2016-12-02', timeline)).toBe(true)

    expect(hasEnoughPrices(prices, '2016-12-01', timeline)).toBe(false)

    expect(hasEnoughPrices(prices, '2016-12-11', timeline)).toBe(false)
  })

  it('should validate market model request', function () {
    const timeline = {
      T0T1: 1,
      T1E: 1,
      ET2: 1,
      T2T3: 1
    }

    const prices = [
      { Date: '2016-12-01', Close: 1234 },
      { Date: '2016-12-02', Close: 1234 },
      { Date: '2016-12-03', Close: 1234 },
      { Date: '2016-12-04', Close: 1234 },
      { Date: '2016-12-05', Close: 1234 },
      { Date: '2016-12-06', Close: 1234 },
      { Date: '2016-12-07', Close: 1234 },
      { Date: '2016-12-08', Close: 1234 },
      { Date: '2016-12-09', Close: 1234 },
      { Date: '2016-12-10', Close: 1234 },
      { Date: '2016-12-11', Close: 1234 },
      { Date: '2016-12-12', Close: 1234 }
    ]

    const data = {
      calendar: {
        '2016-12-06': {
          market: prices,
          stock: prices,
          timeline
        }
      }
    }

    const validMMStructure = extractMarketModelRequiredInfo(data)

    expect(hasValidMMStructure(validMMStructure)).toBe(true)
  })
})
