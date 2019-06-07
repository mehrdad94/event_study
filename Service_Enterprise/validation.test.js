/* global it expect */
import { hasAllValidDate, hasValidCalendar, ValidateMarketModel } from './validation.js'

// validate dates
it('Should check all content has valid date otherwise return invalids', function () {
  const data = [
    { date: '2016-12-01' },
    { date: '2016-12-11' }
  ]
  expect(hasAllValidDate(data, 'date', 'yyyy-mm-dd').length).toBe(0)

  data.push({ date: 'jjfkdsklwei' })

  expect(hasAllValidDate(data, 'date')[0].date).toBe('jjfkdsklwei')
})

it('Should check all event dates has enough stock data', function () {
  const timeline = {
    T0T1: 1,
    T1E: 1,
    ET2: 1,
    T2T3: 1
  }
  const data = [
    { date: '2016-12-01' },
    { date: '2016-12-02' },
    { date: '2016-12-03' },
    { date: '2016-12-04' },
    { date: '2016-12-05' },
    { date: '2016-12-06' },
    { date: '2016-12-07' },
    { date: '2016-12-08' },
    { date: '2016-12-09' },
    { date: '2016-12-10' },
    { date: '2016-12-11' },
    { date: '2016-12-12' }
  ]
  const calendar = [
    { date: '2016-12-02' },
    { date: '2016-12-06' },
    { date: '2016-12-10' }
  ]

  expect(hasValidCalendar(data, calendar, timeline).length).toBe(0)

  calendar.push({ date: '2016-12-01' })

  expect(hasValidCalendar(data, calendar, timeline)[0].date).toBe('2016-12-01')

  calendar.push({ date: '2016-12-11' })
  expect(hasValidCalendar(data, calendar, timeline)[1].date).toBe('2016-12-11')
})

it('should api check for market model request', function () {
  const invalid = {
    dataCalendar: {},
    dataMarket: ''
  }

  expect(ValidateMarketModel(invalid).length === 0).toBe(false)
  const invalid2 = {
    dataCalendar: [],
    dataMarket: [],
    dataStock: [],
    timeline: {}
  }
  expect(ValidateMarketModel(invalid2).length === 0).toBe(false)

  const invalid3 = {
    dataCalendar: [{ Date: '' }],
    dataMarket: [{ Close: '' }],
    dataStock: [{ Close: '' }],
    timeline: {
      T0T1: 1,
      T1E: 1,
      T2T3: 1
    }
  }
  expect(ValidateMarketModel(invalid3).length === 0).toBe(false)

  const valid = {
    dataCalendar: '111',
    dataMarket: [{ Date: '111', Close: 1234 }],
    dataStock: [{ Date: '111', Close: 4321 }],
    timeline: {
      T0T1: 1,
      T1E: 1,
      ET2: 1,
      T2T3: 1
    },
    operationField: 'Close',
    dateField: 'Date'
  }
  expect(ValidateMarketModel(valid).length === 0).toBe(true)
})
