/* global it expect describe */
import validate from './validate'

import {
  timelineKeySchema,
  columnNameSchema,
  priceSchema,
  calendarSchema,
  hasEnoughPrices,
  MMStructureSchema
} from './validation'

import {
  extractMarketModelRequiredInfo
} from './eventStudy.js'

describe('Should test validations', function () {
  it('should validate timeline', function () {
    const invalidTimelineKey = null

    expect(validate.single(invalidTimelineKey, timelineKeySchema)).toBeTruthy()

    const invalidTimelineKey1 = 'H'
    expect(validate.single(invalidTimelineKey1, timelineKeySchema)).toBeTruthy()

    const invalidTimelineKey2 = -1
    expect(validate.single(invalidTimelineKey2, timelineKeySchema)).toBeTruthy()

    const validTimelineKey = 1
    expect(validate.single(validTimelineKey, timelineKeySchema)).toBeFalsy()
  })

  it('should validate date column', function () {
    const invalidDateColumn = 1

    expect(validate.single(invalidDateColumn, columnNameSchema)).toBeTruthy()

    const invalidDateColumn1 = ''

    expect(validate.single(invalidDateColumn1, columnNameSchema)).toBeTruthy()

    const validDateColumn = 'Date'
    expect(validate.single(validDateColumn, columnNameSchema)).toBeFalsy()
  })

  it('should validate price information', function () {
    const operationColumn = 'Close'
    const dateColumn = 'Date'

    const invalidPrice = [
      { [dateColumn]: '2016-12-01' }
    ]

    expect(validate.single(invalidPrice, priceSchema({ dateColumn, operationColumn }))).toBeTruthy()

    const validPrice = [
      { [dateColumn]: '2016-12-01', [operationColumn]: 200.1 }
    ]

    expect(validate.single(validPrice, priceSchema({ dateColumn, operationColumn }))).toBeFalsy()
  })

  it('should validate calendar', function () {
    const validCalendar = [{
      Date: '2016-12-01'
    }]

    expect(validate.single(validCalendar, calendarSchema)).toBeFalsy()

    const invalidCalendar = {
      '2016': ''
    }

    expect(validate.single(invalidCalendar, calendarSchema)).toBeTruthy()

    const invalidCalendar1 = [{
      Date: ''
    }]

    expect(validate.single(invalidCalendar1, calendarSchema)).toBeTruthy()
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
      calendar: [{
        date: '2016-12-06',
        market: prices,
        stock: prices,
        timeline
      }]
    }

    const validMMStructure = extractMarketModelRequiredInfo(data)

    expect(validate.single(validMMStructure, MMStructureSchema)).toBeFalsy()

    const invalidData = {
      calendar: [{
        market: prices,
        stock: prices
      }]
    }

    const invalidMMStructure = extractMarketModelRequiredInfo(invalidData)

    expect(validate.single(invalidMMStructure, MMStructureSchema)).toBeTruthy()
  })
})
