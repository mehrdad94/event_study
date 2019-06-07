import regression from 'regression'
import mean from 'ramda/src/mean'
import sum from 'ramda/src/sum'
import divide from 'ramda/src/divide'
import subtract from 'ramda/src/subtract'
import __ from 'ramda/src/__'
import zip from 'ramda/src/zip'
import propEq from 'ramda/src/propEq'
import findIndex from 'ramda/src/findIndex'
import slice from 'ramda/src/slice'
import prop from 'ramda/src/prop'
import map from 'ramda/src/map'
import mapObjIndexed from 'ramda/src/mapObjIndexed'

const RETURN_PROP = 'Return'
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
 * Calculate daily returns
 * @param {array} prices - list of prices
 * @returns {array}
 */
export const returnsDaily = prices => {
  const isNotNaN = x => !isNaN(x)
  return prices.map((v, i, a) => (v / a[i - 1]) - 1).filter(isNotNaN)
}

/**
 * Add return prop to a list of prices
 * @param {array} data
 * @param {string} operationField
 * @returns {array}
 */
export const addReturns = (data, operationField) => {
  const getOperationField = prop(operationField)
  const returns = returnsDaily(data.map(getOperationField))
  return returns.map((item, index) => ({
    ...data[index + 1],
    [RETURN_PROP]: item
  }))
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

/**
 * create arrays for every part (estimation window, observation window, post event window)
 * @param date {string} - calendar dates
 * @param stockData {array<object>} - stock information
 * @param marketData {array<object>} - market information
 * @param timeline {object} - timeline properties
 * @return {object}
 */
export const extractDateWindows = ({ indexStock, indexMarket, stockData, marketData, timeline }) => {
  const { T0T1, T1E, ET2, T2T3 } = timeline

  const indexesStockEstimationWindow = [indexStock - T1E - T0T1 + 1, indexStock - T1E + 1]
  const indexesMarketEstimationWindow = [indexMarket - T1E - T0T1 + 1, indexMarket - T1E + 1]

  const indexesStockEventWindow = [indexStock - T1E + 1, indexStock + ET2 + 1]
  const indexesMarketEventWindow = [indexMarket - T1E + 1, indexMarket + ET2 + 1]

  const indexesStockPostEventWindow = [indexStock + ET2 + 1, indexStock + ET2 + T2T3 + 1]
  const indexesMarketPostEventWindow = [indexMarket + ET2 + 1, indexMarket + ET2 + T2T3 + 1]

  const stockEstimationWindow = slice(indexesStockEstimationWindow[0], indexesStockEstimationWindow[1], stockData)
  const marketEstimationWindow = slice(indexesMarketEstimationWindow[0], indexesMarketEstimationWindow[1], marketData)

  const stockEventWindow = slice(indexesStockEventWindow[0], indexesStockEventWindow[1], stockData)
  const marketEventWindow = slice(indexesMarketEventWindow[0], indexesMarketEventWindow[1], marketData)

  const stockPostEventWindow = slice(indexesStockPostEventWindow[0], indexesStockPostEventWindow[1], stockData)
  const marketPostEventWindow = slice(indexesMarketPostEventWindow[0], indexesMarketPostEventWindow[1], marketData)

  return {
    stockEstimationWindow,
    marketEstimationWindow,
    stockEventWindow,
    marketEventWindow,
    stockPostEventWindow,
    marketPostEventWindow
  }
}

/**
 * main part of our program to gather all services together
 * @param dateField {string}
 * @param operationField {string}
 * @param dataCalendar {array}
 * @param dataStock {array}
 * @param dataMarket {array}
 * @param timeline {object}
 * @return {object}
 * @todo refactor this function to simpler form
 */
export const marketModel = ({ dataCalendar, dataStock, dataMarket, timeline, dateField, operationField }) => {
  // helpers
  const getReturnField = prop(RETURN_PROP)
  const mapByReturnField = map(getReturnField)
  const findDateIndex = findIndex(propEq(dateField, dataCalendar))

  // add return prop to stock and market data
  const dataStockWithReturns = addReturns(dataStock, operationField)
  const dataMarketWithReturns = addReturns(dataMarket, operationField)

  // extract timeline window from stock and market data
  const dateIndexStock = findDateIndex(dataStockWithReturns)
  const dateIndexMarket = findDateIndex(dataMarketWithReturns)

  const timelineWindows = extractDateWindows({
    date: dataCalendar,
    stockData: dataStockWithReturns,
    marketData: dataMarketWithReturns,
    indexStock: dateIndexStock,
    indexMarket: dateIndexMarket,
    timeline,
    dateField
  })

  const timelineWindowsReturns = mapObjIndexed(mapByReturnField, timelineWindows)
  const { stockEstimationWindow, marketEstimationWindow, stockEventWindow, marketEventWindow } = timelineWindowsReturns

  // get regression error
  const regressionError = regressionStandardError(stockEstimationWindow, marketEstimationWindow)

  // get normal returns
  const normalReturn = normalReturns(marketEstimationWindow, stockEstimationWindow, marketEventWindow)

  // get abnormal return
  const abnormalReturn = returnsAbnormal(stockEventWindow, normalReturn)

  // get CARS
  const CARS = returnsAbnormalCumulative(abnormalReturn)

  // get statistical test
  const statisticalTest = testStatistic(abnormalReturn, regressionError)

  // get significant test
  const significantTest = testSignificant(statisticalTest)

  return {
    normalReturn,
    abnormalReturn,
    statisticalTest,
    significantTest,
    CARS
  }
  //   if (newsDate[ABNORMAL_RETURN] > 0.025) return Object.assign({}, Result, { type: 1 }) // good news
  //   else if (newsDate[ABNORMAL_RETURN] < -0.025) return Object.assign({}, Result, { type: -1 }) // bad news
  //   else return Object.assign({}, Result, { type: 0 }) // neutral news
}
