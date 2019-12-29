import regression from 'regression'
import mean from 'ramda/src/mean'
import sum from 'ramda/src/sum'
import repeat from 'ramda/src/repeat'
import divide from 'ramda/src/divide'
import subtract from 'ramda/src/subtract'
import __ from 'ramda/src/__'
import zip from 'ramda/src/zip'
import slice from 'ramda/src/slice'
import prop from 'ramda/src/prop'
import map from 'ramda/src/map'
import mapObjIndexed from 'ramda/src/mapObjIndexed'
import validate from './validate'
import { defaultDateColumn, defaultOperationColumn, defaultTimeLine } from '../config/defaults'
import { findIndexB } from '../helpers/helper'

const RETURN_PROP = 'Return'
export const MARKET_MODEL = 'MARKET_MODEL'
export const MEAN_MODEL = 'MEAN_MODEL'

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
 * @param {string} operationColumn
 * @returns {array}
 */
export const addReturns = (data, operationColumn) => {
  const getOperationColumn = prop(operationColumn)
  const returns = returnsDaily(data.map(getOperationColumn))
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
 * Calculate news Type
 * @param AR - abnormal return
 * @returns {number}
 */
export const getNewsType = AR => {
  if (AR > 0.025) return 1
  else if (AR < -0.025) return -1
  else return 0
}

/**
 * Calculate cumulative abnormal return by sum with previous value
 * @param {array} AR - abnormal returns
 * @return {array}
 */
export const CAR = AR => AR.reduce((a, b, i) => {
  a[i] = b + (a[i - 1] || 0)
  return a
}, [])

/**
 * create arrays for every part (estimation window, observation window, post event window)
 * @param date {string} - calendar dates
 * @param stockData {array<object>} - stock information
 * @param marketData [{array<object>}] - market information
 * @param timeline {object} - timeline properties
 * @return {object|string}
 */
export const extractDateWindows = ({ stockData, marketData, timeline, type = MARKET_MODEL }) => {
  const { T0T1, T1E, ET2, T2T3 } = timeline

  const indexesEstimationWindow = [0, T0T1]
  const indexesEventWindow = [T0T1, T0T1 + T1E + ET2]
  const indexesPostEventWindow = [T0T1 + T1E + ET2, T0T1 + T1E + ET2 + T2T3]

  const stockEstimationWindow = slice(indexesEstimationWindow[0], indexesEstimationWindow[1], stockData)
  const stockEventWindow = slice(indexesEventWindow[0], indexesEventWindow[1], stockData)
  const stockPostEventWindow = slice(indexesPostEventWindow[0], indexesPostEventWindow[1], stockData)

  let marketEstimationWindow
  let marketEventWindow
  let marketPostEventWindow

  // stock and market data should have equal dates
  if (type === MARKET_MODEL) {
    marketEstimationWindow = slice(indexesEstimationWindow[0], indexesEstimationWindow[1], marketData)
    marketEventWindow = slice(indexesEventWindow[0], indexesEventWindow[1], marketData)
    marketPostEventWindow = slice(indexesPostEventWindow[0], indexesPostEventWindow[1], marketData)

    return {
      stockEstimationWindow,
      marketEstimationWindow,
      stockEventWindow,
      marketEventWindow,
      stockPostEventWindow,
      marketPostEventWindow
    }
  } else {
    return {
      stockEstimationWindow,
      stockEventWindow,
      stockPostEventWindow
    }
  }
}
/**
 * main part of our program to gather all services together
 * @param dateColumn {string}
 * @param operationColumn {string}
 * @param date {string}
 * @param stock {array}
 * @param market {array}
 * @param timeline {object}
 * @param modelType {string}
 * @return {object}
 */
export const model = ({ date, stock, market, timeline, dateColumn, operationColumn }, modelType) => {
  // helpers
  const getReturnColumn = prop(RETURN_PROP)
  const mapByReturnColumn = map(getReturnColumn)
  const getDateColumn = prop(dateColumn)
  const isMarketModel = modelType === 'MARKET_MODEL'
  const compareDateFunction = item => {
    const currentDate = getDateColumn(item)

    if (date > currentDate) return 1
    else if (date < currentDate) return -1
    else return 0
  }
  const findDateIndex = findIndexB(compareDateFunction)

  // extract timeline window from stock and market data
  const dateIndexStock = findDateIndex(stock)
  const dateIndexMarket = isMarketModel && findDateIndex(market)

  const sliceRequiredPriceItems = index => slice(index - timeline.T1E - timeline.T0T1, index + timeline.ET2 + timeline.T2T3 + 1)

  // slice prices to gain just required data
  const slicedStock = sliceRequiredPriceItems(dateIndexStock)(stock)
  const slicedMarket = isMarketModel && sliceRequiredPriceItems(dateIndexMarket)(market)

  // stock data and market data should have equal dates
  if (isMarketModel) {
    const preEventValidation = validate.single([slicedStock, slicedMarket], { arrayWithEqualField: { field: dateColumn } })
    if (preEventValidation) return preEventValidation.toString()
  }

  // extract required info for stock and market and add return prop to stock and market data
  const stockWithReturns = addReturns(slicedStock, operationColumn)
  const marketWithReturns = isMarketModel && addReturns(slicedMarket, operationColumn)

  if (dateIndexStock === -1) return `${date} does not exist in stock dataset`
  if (isMarketModel && dateIndexMarket === -1) return `${date} does not exist in market dataset`

  const timelineWindows = extractDateWindows({
    date,
    stockData: stockWithReturns,
    marketData: marketWithReturns,
    indexStock: dateIndexStock,
    indexMarket: dateIndexMarket,
    timeline,
    type: modelType
  })

  // if timelineWindow has error
  if (typeof timelineWindows === 'string') return timelineWindows

  const timelineWindowsReturns = mapObjIndexed(mapByReturnColumn, timelineWindows)
  let { stockEstimationWindow, marketEstimationWindow, stockEventWindow, marketEventWindow } = timelineWindowsReturns

  let normalReturn
  let meanStockEstimationWindow

  if (isMarketModel) {
    // get normal returns
    normalReturn = normalReturns(marketEstimationWindow, stockEstimationWindow, marketEventWindow)
  } else {
    meanStockEstimationWindow = mean(stockEstimationWindow)
    marketEstimationWindow = repeat(meanStockEstimationWindow, stockEstimationWindow.length)
    normalReturn = repeat(meanStockEstimationWindow, stockEventWindow.length)
  }

  // get regression error
  const regressionError = regressionStandardError(stockEstimationWindow, marketEstimationWindow)

  // get abnormal return
  const abnormalReturn = returnsAbnormal(stockEventWindow, normalReturn)

  // see what kind of news was that
  const newsType = getNewsType(abnormalReturn[timeline.T1E - 1])

  // get CARS
  const CARS = CAR(abnormalReturn)

  // get statistical test
  const statisticalTest = testStatistic(abnormalReturn, regressionError)

  // get significant test
  const significantTest = testSignificant(statisticalTest)

  // get return dates
  const returnDates = timelineWindows.stockEventWindow.map(prop(dateColumn))

  return {
    date,
    normalReturn,
    abnormalReturn,
    statisticalTest,
    significantTest,
    CARS,
    newsType,
    returnDates
  }
}

/**
 * Extract required information for market model analysis
 * @param {array} calendar
 * @param {array<object>} [stock]
 * @param {array<object>} [market]
 * @param {object} [timeline]
 * @param {string} [dateColumn]
 * @param {string} [operationColumn]
 * @returns {array<object>}
 */
export const extractMarketModelRequiredInfo = ({
  calendar,
  stock,
  market,
  timeline = defaultTimeLine,
  dateColumn = defaultDateColumn,
  operationColumn = defaultOperationColumn }
) => {
  return calendar.map((event = {}) => {
    return {
      date: event.date,
      stock: event.stock || stock,
      market: event.market || market,
      timeline: event.timeline || timeline,
      dateColumn: event.dateColumn || dateColumn,
      operationColumn: event.operationColumn || operationColumn
    }
  })
}
/**
 * Extract required information for mean model analysis
 * @param {array} calendar
 * @param {array<object>} [stock]
 * @param {object} [timeline]
 * @param {string} [dateColumn]
 * @param {string} [operationColumn]
 * @returns {array<object>}
 */
export const extractMeanModelRequiredInfo = ({
  calendar,
  stock,
  timeline = defaultTimeLine,
  dateColumn = defaultDateColumn,
  operationColumn = defaultOperationColumn }
) => {
  return calendar.map((event = {}) => {
    return {
      date: event.date,
      stock: event.stock || stock,
      timeline: event.timeline || timeline,
      dateColumn: event.dateColumn || dateColumn,
      operationColumn: event.operationColumn || operationColumn
    }
  })
}
/**
 * Calculate Average Abnormal Return
 * @param {array} returns
 * @returns {array}
 */
export const AAR = returns => returns[0].map((price, pIndex) => mean(returns.map(r => r[pIndex])))
