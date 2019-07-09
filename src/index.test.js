/* global it expect */
import { MarketModel } from './index'
// @todo add more test to validate event study module
const operationColumn = 'Close'
const dateColumn = 'Date'
// helper
const fakeStockDataGenerator = n => ({ Date: `${n}`, Close: 2 ** n })
const seqGenerator = n => n !== 1 ? [...seqGenerator(n - 1), n] : [n]

// data
const timeline = {
  T0T1: 2,
  T1E: 2,
  ET2: 2,
  T2T3: 2
}

const market = seqGenerator(11).map(fakeStockDataGenerator)
const stock = seqGenerator(22).map(fakeStockDataGenerator)

const date = '6'

const calendar = {
  [date]: { timeline, market, stock, operationColumn, dateColumn }
}

it('Should test market model service with valid request', function () {
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
