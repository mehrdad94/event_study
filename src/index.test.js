/* global it expect describe */
import { MarketModel, MeanModel } from './index'
// @todo add more test to validate event study module
import { UNMATCHED_TRADING_DAY_STRATEGIES } from './config/defaults'

import APPL from './data/AAPL.json'
import SP500 from './data/GSPC.json'
import APPLFull from './data/AAPLFull.json'
import SP500Full from './data/GSPCFull.json'

const operationColumn = 'Close'
const dateColumn = 'Date'
// helper
const fakeStockDataGenerator = n => {
  if (n < 10) n = '0' + n
  if (n > 30) throw new Error('does not support more than 30 range')
  return ({ Date: `2019-05-${n}`, Close: 2 ** n })
}
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

    const date = '2019-05-06'

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

    const date = '2019-05-06'

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
      { Date: '2019-05-01', Close: 100 },
      { Date: '2019-05-02', Close: 110 },
      { Date: '2019-05-03', Close: 100 },
      { Date: '2019-05-04', Close: 130 },
      { Date: '2019-05-05', Close: 120 },
      { Date: '2019-05-06', Close: 100 },
      { Date: '2019-05-07', Close: 110 },
      { Date: '2019-05-08', Close: 105 },
      { Date: '2019-05-09', Close: 98 },
      { Date: '2019-05-10', Close: 95 },
      { Date: '2019-05-11', Close: 105 },
      { Date: '2019-05-12', Close: 40 },
      { Date: '2019-05-13', Close: 105 },
      { Date: '2019-05-14', Close: 120 },
      { Date: '2019-05-15', Close: 100 },
      { Date: '2019-05-16', Close: 105 },
      { Date: '2019-05-17', Close: 102 }
    ]

    const market = [
      { Date: '2019-05-01', Close: 50 },
      { Date: '2019-05-02', Close: 80 },
      { Date: '2019-05-03', Close: 65 },
      { Date: '2019-05-04', Close: 70 },
      { Date: '2019-05-05', Close: 65 },
      { Date: '2019-05-06', Close: 50 },
      { Date: '2019-05-07', Close: 45 },
      { Date: '2019-05-08', Close: 55 },
      { Date: '2019-05-09', Close: 50 },
      { Date: '2019-05-10', Close: 80 },
      { Date: '2019-05-11', Close: 85 },
      { Date: '2019-05-12', Close: 92 },
      { Date: '2019-05-13', Close: 90 },
      { Date: '2019-05-14', Close: 95 },
      { Date: '2019-05-15', Close: 90 },
      { Date: '2019-05-16', Close: 92 },
      { Date: '2019-05-17', Close: 91 }
    ]

    let date = '2019-05-12'

    const negativeNewsType = {
      calendar: [{ date, timeline, market, stock, operationColumn, dateColumn }]
    }

    let result = MarketModel(negativeNewsType)
    expect(result[0].newsType).toBe(-1)

    date = '2019-05-13'

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
      { Date: '2019-05-01', Close: 100 },
      { Date: '2019-05-02', Close: 110 },
      { Date: '2019-05-03', Close: 100 },
      { Date: '2019-05-04', Close: 130 },
      { Date: '2019-05-05', Close: 120 },
      { Date: '2019-05-06', Close: 100 },
      { Date: '2019-05-07', Close: 110 },
      { Date: '2019-05-08', Close: 105 },
      { Date: '2019-05-10', Close: 95 },
      { Date: '2019-05-11', Close: 105 },
      { Date: '2019-05-12', Close: 40 },
      { Date: '2019-05-13', Close: 105 },
      { Date: '2019-05-14', Close: 120 },
      { Date: '2019-05-15', Close: 100 },
      { Date: '2019-05-16', Close: 105 },
      { Date: '2019-05-17', Close: 102 }
    ]

    const market = [
      { Date: '2019-05-01', Close: 50 },
      { Date: '2019-05-02', Close: 80 },
      { Date: '2019-05-03', Close: 65 },
      { Date: '2019-05-04', Close: 70 },
      { Date: '2019-05-05', Close: 65 },
      { Date: '2019-05-06', Close: 50 },
      { Date: '2019-05-07', Close: 45 },
      { Date: '2019-05-08', Close: 55 },
      { Date: '2019-05-09', Close: 50 },
      { Date: '2019-05-10', Close: 80 },
      { Date: '2019-05-11', Close: 85 },
      { Date: '2019-05-12', Close: 92 },
      { Date: '2019-05-13', Close: 90 },
      { Date: '2019-05-14', Close: 95 },
      { Date: '2019-05-15', Close: 90 },
      { Date: '2019-05-16', Close: 92 },
      { Date: '2019-05-17', Close: 91 }
    ]

    let date = '2019-05-12'

    const data = {
      calendar: [{ date, timeline, market, stock, operationColumn, dateColumn }]
    }

    const result = MarketModel(data)[0]
    expect(result).toContain('2019-05-09')
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

  it('should return error if date does not exist', function () {
    const date = '2018-09-29'

    const timeline = {
      T0T1: 40,
      T1E: 10,
      ET2: 10,
      T2T3: 2
    }

    const data = {
      calendar: [{ date, timeline, market: SP500Full, stock: APPLFull, operationColumn, dateColumn }]
    }

    const result = MarketModel(data)[0]

    expect(result).toBe('2018-09-29 does not exist in stock dataset')
  })

  it('should perform operation on next trading date', function () {
    const date = '2018-09-29'
    const nextTradingDay = '2018-10-01'
    const timeline = {
      T0T1: 40,
      T1E: 10,
      ET2: 10,
      T2T3: 2
    }

    const data = {
      calendar: [{ date, timeline, market: SP500Full, stock: APPLFull, operationColumn, dateColumn, unmatchedTradingDayStrategy: UNMATCHED_TRADING_DAY_STRATEGIES.NEXT_TRADING_DAY }]
    }

    const result = MarketModel(data)[0]

    expect(result.date).toBe(nextTradingDay)
  })

  it('should perform operation on previous trading date', function () {
    const date = '2018-09-29'
    const prevTradingDay = '2018-09-28'
    const timeline = {
      T0T1: 40,
      T1E: 10,
      ET2: 10,
      T2T3: 2
    }

    const data = {
      calendar: [{ date, timeline, market: SP500Full, stock: APPLFull, operationColumn, dateColumn, unmatchedTradingDayStrategy: UNMATCHED_TRADING_DAY_STRATEGIES.PREV_TRADING_DAY }]
    }

    const result = MarketModel(data)[0]

    expect(result.date).toBe(prevTradingDay)
  })
})
