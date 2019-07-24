/* global it expect */
import { MarketModel } from '../build/main.bundle'
// @todo add more test to validate event study module
const operationColumn = 'Close'
const dateColumn = 'Date'
// helper
const fakeStockDataGenerator = n => ({ Date: `${n}`, Close: 2 ** n })
const seqGenerator = n => n !== 1 ? [...seqGenerator(n - 1), n] : [n]

// data

it('Should test market model service with valid request', function () {
  const timeline = {
    T0T1: 2,
    T1E: 2,
    ET2: 2,
    T2T3: 2
  }

  const market = seqGenerator(11).map(fakeStockDataGenerator)
  const stock = seqGenerator(22).map(fakeStockDataGenerator)

  const date = '6'

  const calendar = [{
    date,
    timeline,
    market,
    stock,
    operationColumn,
    dateColumn
  }]

  const validBody = {
    calendar
  }

  const result = MarketModel(validBody)
  const { normalReturn, abnormalReturn, statisticalTest, significantTest } = result[0]
  expect(normalReturn.toString()).toBe('1,1,1,1')
  expect(abnormalReturn.toString()).toBe('0,0,0,0')
  expect(statisticalTest.toString()).toBe('NaN,NaN,NaN,NaN')
  expect(significantTest.toString()).toBe('false,false,false,false')
})

it('Should test news type', function () {
  const timeline = {
    T0T1: 5,
    T1E: 5,
    ET2: 2,
    T2T3: 2
  }

  const stock = [
    { Date: '1', Close: 100 },
    { Date: '2', Close: 110 },
    { Date: '3', Close: 100 },
    { Date: '4', Close: 130 },
    { Date: '5', Close: 120 },
    { Date: '6', Close: 100 },
    { Date: '7', Close: 110 },
    { Date: '8', Close: 105 },
    { Date: '9', Close: 98 },
    { Date: '10', Close: 95 },
    { Date: '11', Close: 105 },
    { Date: '12', Close: 40 },
    { Date: '13', Close: 105 },
    { Date: '14', Close: 120 },
    { Date: '15', Close: 100 },
    { Date: '16', Close: 105 },
    { Date: '17', Close: 102 }
  ]

  const market = [
    { Date: '1', Close: 50 },
    { Date: '2', Close: 80 },
    { Date: '3', Close: 65 },
    { Date: '4', Close: 70 },
    { Date: '5', Close: 65 },
    { Date: '6', Close: 50 },
    { Date: '7', Close: 45 },
    { Date: '8', Close: 55 },
    { Date: '9', Close: 50 },
    { Date: '10', Close: 80 },
    { Date: '11', Close: 85 },
    { Date: '12', Close: 92 },
    { Date: '13', Close: 90 },
    { Date: '14', Close: 95 },
    { Date: '15', Close: 90 },
    { Date: '16', Close: 92 },
    { Date: '17', Close: 91 }
  ]

  let date = '12'

  const negativeNewsType = {
    calendar: [{ date, timeline, market, stock, operationColumn, dateColumn }]
  }

  let result = MarketModel(negativeNewsType)
  expect(result[0].newsType).toBe(-1)

  date = '13'

  const positiveNewsType = {
    calendar: [{ date, timeline, market, stock, operationColumn, dateColumn }]
  }

  result = MarketModel(positiveNewsType)
  expect(result[0].newsType).toBe(1)
})
