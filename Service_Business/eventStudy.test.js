/* global it expect */
import {
  regressionStandardError,
  normalReturns,
  returnsAbnormal,
  testStatistic,
  testSignificant,
  returnsAbnormalCumulative,
  extractDateWindows,
  returnsDaily,
  marketModel
} from './eventStudy'

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

it('should cumulative returns', function () {
  const abnormalReturns = [1, 1, 1]

  expect(returnsAbnormalCumulative(abnormalReturns).toString()).toBe('1,2,3')
})

it('should calculate daily returns', function () {
  const endValues = [2, 2, 3, 4] // $
  const result = [0, (3 / 2) - 1, (4 / 3) - 1]

  expect(returnsDaily(endValues).toString()).toBe(result.toString())

  const endValues2 = [{ Close: 2 }, { Close: 2 }, { Close: 3 }, { Close: 4 }]

  const result2 = [{ Close: 2, return: 0 }, { Close: 3, return: (3 / 2) - 1 }, { Close: 4, return: (4 / 3) - 1 }]

  expect(JSON.stringify(returnsDaily(endValues2, 'Close'))).toBe(JSON.stringify(result2))
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

  const result = extractDateWindows({
    date: lookupDate,
    stockData: stockAndMarketData,
    marketData: stockAndMarketData,
    timeline,
    dateField: 'Date'
  })

  expect(result.marketEstimationWindow.length).toBe(1)
  expect(result.marketEventWindow.length).toBe(2)
  expect(result.marketPostEventWindow.length).toBe(1)
})

it('Should compute Market model', function () {
  const fakeStockDataGen = n => ({ Date: n, Close: 2 ** n })
  const state = {
    dataCalendar: [{ Date: 6 }],
    dataMarket: [
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
    dataStock: [
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
    operationField: 'Close',
    dateField: 'Date'
  }

  const result = marketModel(state).resultPerDates[6]

  expect(result.eventWindowsNormalReturn.toString()).toBe('1,1,1,1')
  expect(result.eventWindowsAbnormalReturn.toString()).toBe('0,0,0,0')
  expect(result.eventWindowStatisticalTest.toString()).toBe('NaN,NaN,NaN,NaN')
  expect(result.eventWindowSignificantTest.toString()).toBe('false,false,false,false')
  // @todo calculate cumulative abnormal return
})
