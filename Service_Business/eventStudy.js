import regression from 'regression'
import mean from 'ramda/src/mean'
import sum from 'ramda/src/sum'
import divide from 'ramda/src/divide'
import subtract from 'ramda/src/subtract'
import __ from 'ramda/src/__'
import zip from 'ramda/src/zip'

/**
 * Calculate standard regression error
 * @param {array} y - y points
 * @param {array} x - x points
 * @return {number} - standard regression error
 * @example
 * regressionStandardError(stock, market)
 * @private
 */
export const regressionStandardError = (y, x) => {
  const meanY = mean(y)
  const meanX = mean(x)
  const subtractMeanY = subtract(meanY)
  const subtractMeanX = subtract(meanX)
  const square = x => x ** 2
  const sumSubMeanYSquare = sum(y.map(subtractMeanY).map(square))
  const sumSubMeanXSquare = sum(x.map(subtractMeanX).map(square))
  const divideByLength = divide(__, y.length - 2)

  const sumSubtractedMultiSubtractedSquare = function () {
    let result = []

    x.forEach((item, index) => {
      result.push((item - meanX) * (y[index] - meanY))
    })

    return square(sum(result))
  }

  return Math.sqrt(divideByLength(sumSubMeanYSquare - (sumSubtractedMultiSubtractedSquare() / sumSubMeanXSquare)))
}

/**
 * Calculate normal returns from observation market returns
 * @param {array} marketReturns - market returns for calculating CAPM regression
 * @param {array} stockReturns - stock returns for calculating CAMP regression
 * @param {array} observationMarketReturns - market prices used for prediction in CAPM regression
 * @return {array} - prediction normal returns
 * @private
 */
export const normalReturns = (marketReturns, stockReturns, observationMarketReturns) => {
  const linearRegression = regression.linear(zip(marketReturns, stockReturns), { precision: 8 })
  const equation = linearRegression.equation
  const predict = x => equation[0] * x + equation[1]
  return observationMarketReturns.map(predict)
}

/**
 * subtract real stock return from normal estimated return
 * to find abnormal return
 * @param {array} realStockReturn
 * @param {array} normalStockReturn
 * @return {array}
 */
export const returnsAbnormal = (realStockReturn, normalStockReturn) => zip(realStockReturn, normalStockReturn).map(a => subtract(...a))

/**
 * test statistic is for calculating event significant
 * @param {array} AR - abnormal returns
 * @param {number} regressionError - regression error
 * @return {array} - AR / regressionError
 */
export const testStatistic = (AR, regressionError) => AR.map(item => divide(item, regressionError))

/**
 * Calculate was event significant
 * @param {array} TS - test statistics
 * @return {array<boolean>}
 */
export const testSignificant = TS => TS.map(item => Math.abs(item) > 1.96)

/**
 * Calculate cumulative abnormal return by sum with previous value
 * @param {array} AR - abnormal returns
 * @return {array}
 */
export const returnsAbnormalCumulative = AR => AR.reduce((a, b, i) => {
  a[i] = b + (a[i - 1] || 0)
  return a
}, [])
