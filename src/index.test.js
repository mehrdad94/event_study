/* global it expect describe */
import { MarketModel, MeanModel } from './index'
// @todo add more test to validate event study module

import APPL from './data/AAPL.json'
import SP500 from './data/GSPC.json'

const operationColumn = 'Close'
const dateColumn = 'Date'
// helper
const fakeStockDataGenerator = n => ({ Date: `${n}`, Close: 2 ** n })
const seqGenerator = n => n !== 1 ? [...seqGenerator(n - 1), n] : [n]

describe('should test library', function () {
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

  it('should test mean model', function () {
    const timeline = {
      T0T1: 2,
      T1E: 2,
      ET2: 2,
      T2T3: 2
    }

    const stock = seqGenerator(11).map(fakeStockDataGenerator)

    const date = '6'

    const calendar = [{
      date,
      timeline,
      stock,
      operationColumn,
      dateColumn
    }]

    const validBody = {
      calendar
    }

    const result = MeanModel(validBody)

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

  it('should produce an error when market data and stock data does not match', function () {
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

    const data = {
      calendar: [{ date, timeline, market, stock, operationColumn, dateColumn }]
    }

    const result = MarketModel(data)[0]
    expect(typeof result).toBe('string')
  })
  it('should test library with real dataset', function () {
    const date = '2019-05-20'

    const timeline = {
      T0T1: 40,
      T1E: 10,
      ET2: 10,
      T2T3: 2
    }

    const data = {
      calendar: [{ date, timeline, market: SP500, stock: APPL, operationColumn, dateColumn }]
    }

    const result = MarketModel(data)[0]

    expect(result.returnDates).toEqual([
      '2019-05-07',
      '2019-05-08',
      '2019-05-09',
      '2019-05-10',
      '2019-05-13',
      '2019-05-14',
      '2019-05-15',
      '2019-05-16',
      '2019-05-17',
      '2019-05-20',
      '2019-05-21',
      '2019-05-22',
      '2019-05-23',
      '2019-05-24',
      '2019-05-28',
      '2019-05-29',
      '2019-05-30',
      '2019-05-31',
      '2019-06-03',
      '2019-06-04'
    ])
  })
})
