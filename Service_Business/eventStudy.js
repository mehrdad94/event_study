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
import pick from 'ramda/src/pick'
import values from 'ramda/src/values'
import indexBy from 'ramda/src/indexBy'
import mapObjIndexed from 'ramda/src/mapObjIndexed'
import groupBy from 'ramda/src/groupBy'

const zipMany = array => {
  const result = []
  if (!array || !array[0] || !Array.isArray(array[0])) return result
  const len = array[0].length

  for (let i = 0; i < len; i++) {
    const temp = []
    for (let j = 0; j < array.length; j++) {
      temp.push(array[j][i])

      if (j === array.length - 1) result.push(temp)
    }
  }

  return result
}

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
 * @param {array} endValues - list of prices
 * @param {string} [prop] - property for array objects
 * @param {string} [storeProp] - return the object with that key in it
 * @returns {array}
 */
export const returnsDaily = (endValues, prop, storeProp = 'return') => {
  const isNotNaN = x => !isNaN(x)
  const inNotNaNObject = (x, prop) => !isNaN(x[prop])
  if (typeof endValues[0] === 'object') {
    return endValues.map((v, i, a) => {
      if (i === 0) return Object.assign({}, v, { [storeProp]: NaN })
      const returnVal = (v[prop] / a[i - 1][prop]) - 1

      return Object.assign({}, v, { [storeProp]: returnVal })
    }).filter(item => inNotNaNObject(item, storeProp))
  } else {
    return endValues.map((v, i, a) => (v / a[i - 1]) - 1).filter(isNotNaN)
  }
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
 * @param dateField {string} - date field in json data
 * @param [aggregate] {function} - it will apply to end window results
 * @return {object}
 */
export const extractDateWindows = ({ date, stockData, marketData, timeline, dateField }) => {
  const { T0T1, T1E, ET2, T2T3 } = timeline
  const findDateIndex = findIndex(propEq(dateField, date))
  const indexStock = findDateIndex(stockData)
  const indexMarket = findDateIndex(marketData)

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
 * @return {{dates: {array}, resultPerDates: {object}}}
 */
export const marketModel = ({ dateField, operationField, dataCalendar, dataStock, dataMarket, timeline }) => {
  const RETURN = 'RETURN'
  const NORMAL_RETURN = 'NORMAL_RETURN'
  const ABNORMAL_RETURN = 'ABNORMAL_RETURN'
  const CAR = 'CAR'
  const STATISTICAL_TEST = 'STATISTICAL_TEST'
  const SIGNIFICANT_TEST = 'SIGNIFICANT_TEST'

  const dateProp = prop(dateField)
  const returnProp = prop(RETURN)
  const indexByDate = dateField => indexBy(prop(dateField))
  const dates = dataCalendar.map(prop(dateField))
  const getRegressionError = ({ stockEstimationWindow, marketEstimationWindow }) => {
    return regressionStandardError(stockEstimationWindow, marketEstimationWindow)
  }

  const getReturns = data => data.map(returnProp)

  const calcNormalReturn = ({ stockEstimationWindow, marketEstimationWindow, marketEventWindow }) => {
    return normalReturns(marketEstimationWindow, stockEstimationWindow, marketEventWindow)
  }

  const calcAbnormalReturn = ({ stockEventWindow }, normalReturn) => {
    return returnsAbnormal(stockEventWindow, normalReturn)
  }

  const calcStatisticTest = (RT, index) => {
    return testStatistic(RT, regressionStandardErrors[index])
  }

  const stockData = returnsDaily(dataStock, operationField, RETURN)
  const marketData = values(pick(stockData.map(dateProp), indexByDate(dateField)(returnsDaily(dataMarket, operationField, RETURN))))
  // remove mismatch dates from market data with stock data
  const windowsPerDate = dates.map(date => extractDateWindows({
    date,
    stockData,
    marketData,
    timeline,
    dateField
  }))
  const windowsReturns = dates.map((date, i) => mapObjIndexed(getReturns, windowsPerDate[i]))

  const regressionStandardErrors = windowsReturns.map(getRegressionError)

  const normalReturn = dates.map((date, i) => calcNormalReturn(windowsReturns[i]))

  const abnormalReturn = dates.map((date, i) => calcAbnormalReturn(windowsReturns[i], normalReturn[i]))

  const CARs = dates.map((date, i) => returnsAbnormalCumulative(abnormalReturn[i]))

  const statisticalTests = abnormalReturn.map(calcStatisticTest)

  const significantTests = statisticalTests.map(testSignificant)

  const windowsWithAllData = windowsPerDate.map((v, windowIndex) => {
    const { stockEventWindow } = v
    const editedStockEventWindow = stockEventWindow.map((item, priceIndex) => {
      const RV = windowsReturns[windowIndex]['stockEventWindow'][priceIndex]
      const NR = normalReturn[windowIndex][priceIndex]
      const ABR = abnormalReturn[windowIndex][priceIndex]
      const car = CARs[windowIndex][priceIndex]
      const ST = statisticalTests[windowIndex][priceIndex]
      const significantTest = significantTests[windowIndex][priceIndex]

      return Object.assign({}, item, {
        [RETURN]: RV,
        [NORMAL_RETURN]: NR,
        [ABNORMAL_RETURN]: ABR,
        [CAR]: car,
        [STATISTICAL_TEST]: ST,
        [SIGNIFICANT_TEST]: significantTest
      })
    })
    return Object.assign({}, v, {
      stockEventWindow: editedStockEventWindow
    })
  }).reduce((a, b, i) => {
    a[dates[i]] = b
    return a
  }, {})

  const goodBadNeutralNewsCar = groupBy(prop('type'), dates.map((date, dateIndex) => {
    const { stockEventWindow } = windowsWithAllData[date]
    const newsDateIndex = findIndex(propEq(dateField, date))(stockEventWindow)
    const newsDate = stockEventWindow[newsDateIndex]

    const Result = {
      [dateField]: date,
      index: newsDateIndex,
      CAR: CARs[dateIndex]
    }

    if (newsDate[ABNORMAL_RETURN] > 0.025) return Object.assign({}, Result, { type: 1 }) // good news
    else if (newsDate[ABNORMAL_RETURN] < -0.025) return Object.assign({}, Result, { type: -1 }) // bad news
    else return Object.assign({}, Result, { type: 0 }) // neutral news
  }))

  const calcCarAverage = arrOfDays => zipMany(arrOfDays.map(prop('CAR'))).map(ar => mean(ar))

  const goodBadNeutralNewsCarAverage = mapObjIndexed(calcCarAverage, goodBadNeutralNewsCar)

  // calculate CAR
  const getResultPerDates = (o, index) => ({
    Date: dates[index],
    RegressionError: regressionStandardErrors[index],
    eventWindowsNormalReturn: normalReturn[index],
    eventWindowsAbnormalReturn: abnormalReturn[index],
    eventWindowStatisticalTest: statisticalTests[index],
    eventWindowSignificantTest: significantTests[index],
    eventWindowCAR: CARs[index],
    eventWindowsDates: windowsPerDate[index].marketEventWindow.map(dateProp),
    stockEventWindow: o.stockEventWindow,
    marketEventWindow: o.marketEventWindow
  })

  const resultPerDates = indexByDate(dateField)(windowsReturns.map(getResultPerDates))

  return {
    dates,
    resultPerDates,
    windowsWithAllData,
    goodBadNeutralNewsCarAverage
  }
}
