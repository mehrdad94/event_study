/* global it expect describe */
import {
  validateTimelineKey,
  validateColumnName,
  validatePrices,
  validateCalendar,
  validateMMStructure,
  validateMeanModelStructure
} from './validation'

import {
  extractMarketModelRequiredInfo,
  extractMeanModelRequiredInfo
} from './eventStudy.js'

describe('Should test validations', function () {
  it('should validate timeline', function () {
    const invalidTimelineKey = null

    expect(validateTimelineKey(invalidTimelineKey)).toBeTruthy()

    const invalidTimelineKey1 = 'H'
    expect(validateTimelineKey(invalidTimelineKey1)).toBeTruthy()

    const invalidTimelineKey2 = -1
    expect(validateTimelineKey(invalidTimelineKey2)).toBeTruthy()

    const validTimelineKey = 1
    expect(validateTimelineKey(validTimelineKey)).toBeFalsy()
  })

  it('should validate date column', function () {
    const invalidDateColumn = 1

    expect(validateColumnName(invalidDateColumn)).toBeTruthy()

    const invalidDateColumn1 = ''

    expect(validateColumnName(invalidDateColumn1)).toBeTruthy()

    const validDateColumn = 'Date'
    expect(validateColumnName(validDateColumn)).toBeFalsy()
  })

  it('should validate price information', function () {
    const operationColumn = 'Close'
    const dateColumn = 'Date'

    const invalidPrice = [
      { [dateColumn]: '2016-12-01' }
    ]

    expect(validatePrices(invalidPrice, dateColumn, operationColumn)).toBeTruthy()

    const validPrice = [
      { [dateColumn]: '2016-12-01', [operationColumn]: 200.1 }
    ]

    expect(validatePrices(validPrice, dateColumn, operationColumn)).toBeFalsy()
  })

  it('should validate calendar', function () {
    const validCalendar = [{
      Date: '2016-12-01'
    }]

    expect(validateCalendar(validCalendar)).toBeFalsy()

    const invalidCalendar = {
      '2016': ''
    }

    expect(validateCalendar(invalidCalendar)).toBeTruthy()

    const invalidCalendar1 = [{
      Date: ''
    }]

    expect(validateCalendar(invalidCalendar1)).toBeTruthy()
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

    expect(validateMMStructure(validMMStructure)).toBeFalsy()

    const invalidData = {
      calendar: [{
        market: prices,
        stock: prices
      }]
    }

    const invalidMMStructure = extractMarketModelRequiredInfo(invalidData)

    expect(validateMMStructure(invalidMMStructure)).toBeTruthy()
  })

  it('should validate mean model request', function () {
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
        stock: prices,
        timeline
      }]
    }

    const validMMStructure = extractMeanModelRequiredInfo(data)

    expect(validateMeanModelStructure(validMMStructure)).toBeFalsy()

    const invalidData = {
      calendar: [{
        stock: prices
      }]
    }

    const invalidMMStructure = extractMeanModelRequiredInfo(invalidData)

    expect(validateMeanModelStructure(invalidMMStructure)).toBeTruthy()
  })
})
