/* global it expect describe */
import {
  hasValidTimeline,
  hasValidPrices,
  hasValidCalendar,
  hasEnoughPrices
} from './validation'

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
    const dates = [
      '2016-12-02',
      '2016-12-06',
      '2016-12-10'
    ]

    expect(hasEnoughPrices(prices, dates, timeline).length).toBe(0)

    dates.push('2016-12-01')

    expect(hasEnoughPrices(prices, dates, timeline)[0]).toBe('2016-12-01')

    dates.push('2016-12-11')
    expect(hasEnoughPrices(prices, dates, timeline)[1]).toBe('2016-12-11')
  })
//
//   it('should api check for market model request', function () {
//     const invalid = {
//       dataCalendar: {},
//       dataMarket: ''
//     }
//
//     expect(ValidateMarketModel(invalid).length === 0).toBe(false)
//     const invalid2 = {
//       dataCalendar: [],
//       dataMarket: [],
//       dataStock: [],
//       timeline: {}
//     }
//     expect(ValidateMarketModel(invalid2).length === 0).toBe(false)
//
//     const invalid3 = {
//       dataCalendar: [{ Date: '' }],
//       dataMarket: [{ Close: '' }],
//       dataStock: [{ Close: '' }],
//       timeline: {
//         T0T1: 1,
//         T1E: 1,
//         T2T3: 1
//       }
//     }
//     expect(ValidateMarketModel(invalid3).length === 0).toBe(false)
//
//     const valid = {
//       dataCalendar: [{ Date: '111' }],
//       dataMarket: [{ Date: '111', Close: 1234 }],
//       dataStock: [{ Date: '111', Close: 4321 }],
//       timeline: {
//         T0T1: 1,
//         T1E: 1,
//         ET2: 1,
//         T2T3: 1
//       },
//       operationColumn: 'Close',
//       dateColumn: 'Date'
//     }
//     expect(ValidateMarketModel(valid).length === 0).toBe(true)
// })
})
