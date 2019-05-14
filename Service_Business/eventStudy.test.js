/* global it expect */
import {
  regressionStandardError,
  normalReturns,
  returnsAbnormal,
  testStatistic,
  testSignificant,
  returnsAbnormalCumulative
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
