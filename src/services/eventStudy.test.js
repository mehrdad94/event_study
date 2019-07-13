/* global it expect describe */
import {
  regressionStandardError,
  normalReturns,
  addReturns,
  returnsAbnormal,
  testStatistic,
  testSignificant,
  returnsAbnormalCumulative,
  extractDateWindows,
  returnsDaily,
  getNewsType,
  marketModel
} from './eventStudy'
import findIndex from 'ramda/src/findIndex'
import propEq from 'ramda/src/propEq'

describe('event study main service', function () {
  it('should test standard error', function () {
    const y = [2, 3, 9, 1, 8, 7, 5]
    const x = [6, 5, 11, 7, 5, 4, 4]

    expect(regressionStandardError(y, x).toFixed(6)).toBe('3.305719')
  })

  it('should test normal return function', function () {
    const marketReturns = [1, 2, 3]
    const stockReturns = [1, 2, 3]
    const observationMarketReturns = [5, 6, 7]

    expect(normalReturns(marketReturns, stockReturns, observationMarketReturns).toString()).toBe('5,6,7')
  })

  it('should test abnormal returns', function () {
    const realStockReturn = [1, 1, 1]
    const normalStockReturn = [1, 1, 1]

    expect(returnsAbnormal(realStockReturn, normalStockReturn).toString()).toBe('0,0,0')
  })

  it('should perform test statistic', function () {
    const abnormalReturns = [1, 2, 1]
    const regressionError = 2

    expect(testStatistic(abnormalReturns, regressionError).toString()).toBe('0.5,1,0.5')
  })

  it('should test significance of abnormal returns', function () {
    const testStatistics = [1, 2, 1]

    expect(testSignificant(testStatistics).toString()).toBe('false,true,false')
  })

  it('should test news type from abnormal return', function () {
    let AR = 1

    expect(getNewsType(AR)).toBe(1)

    AR = -1

    expect(getNewsType(AR)).toBe(-1)

    AR = 0

    expect(getNewsType(AR)).toBe(0)
  })

  it('should cumulative returns', function () {
    const abnormalReturns = [1, 1, 1]

    expect(returnsAbnormalCumulative(abnormalReturns).toString()).toBe('1,2,3')
  })

  it('should calculate daily returns', function () {
    const endValues = [2, 2, 3, 4] // $
    const result = [0, (3 / 2) - 1, (4 / 3) - 1]

    expect(returnsDaily(endValues).toString()).toBe(result.toString())
  })

  it('should add return prop to list of prices', function () {
    const operationColumn = 'Close'
    const fakePriceGen = n => ({ [operationColumn]: n })
    const data = [fakePriceGen(2), fakePriceGen(2)]
    const result = addReturns(data, operationColumn)
    expect(result[0]).toEqual({
      [operationColumn]: 2,
      Return: 0
    })
  })
  it('should test date extraction', function () {
    const fakeDateGen = n => ({ Date: n.toString() })
    const lookupDate = '3'
    const stockAndMarketData = [fakeDateGen(1), fakeDateGen(2), fakeDateGen(3), fakeDateGen(4), fakeDateGen(5)]
    const timeline = {
      T0T1: 1,
      T1E: 1,
      ET2: 1,
      T2T3: 1
    }

    const findDateIndex = findIndex(propEq('Date', lookupDate))
    const dateIndex = findDateIndex(stockAndMarketData)

    const result = extractDateWindows({
      date: lookupDate,
      stockData: stockAndMarketData,
      marketData: stockAndMarketData,
      timeline,
      indexStock: dateIndex,
      indexMarket: dateIndex,
      dateColumn: 'Date'
    })

    expect(result.marketEstimationWindow.length).toBe(1)
    expect(result.marketEventWindow.length).toBe(2)
    expect(result.marketPostEventWindow.length).toBe(1)
  })

  it('Should compute Market model', function () {
    const fakeStockDataGen = n => ({ Date: n, Close: 2 ** n })
    const state = {
      date: 6,
      market: [
        fakeStockDataGen(1),
        fakeStockDataGen(2),
        fakeStockDataGen(3),
        fakeStockDataGen(4),
        fakeStockDataGen(5),
        fakeStockDataGen(6),
        fakeStockDataGen(7),
        fakeStockDataGen(8),
        fakeStockDataGen(9),
        fakeStockDataGen(10),
        fakeStockDataGen(11)],
      stock: [
        fakeStockDataGen(1),
        fakeStockDataGen(2),
        fakeStockDataGen(3),
        fakeStockDataGen(4),
        fakeStockDataGen(5),
        fakeStockDataGen(6),
        fakeStockDataGen(7),
        fakeStockDataGen(8),
        fakeStockDataGen(9),
        fakeStockDataGen(10),
        fakeStockDataGen(11)],
      timeline: {
        T0T1: 2,
        T1E: 2,
        ET2: 2,
        T2T3: 2
      },
      operationColumn: 'Close',
      dateColumn: 'Date'
    }

    const result = marketModel(state)

    expect(result.normalReturn.toString()).toBe('1,1,1,1')
    expect(result.abnormalReturn.toString()).toBe('0,0,0,0')
    expect(result.statisticalTest.toString()).toBe('NaN,NaN,NaN,NaN')
    expect(result.significantTest.toString()).toBe('false,false,false,false')
    expect(result.newsType).toBe(0)
  })
})
