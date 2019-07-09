import findIndex from 'ramda/src/findIndex'
import propEq from 'ramda/src/propEq'
import is from 'ramda/src/is'
import isNil from 'ramda/src/isNil'
import { defaultDateColumn } from '../config/defaults'

/**
 * Validate timeline object
 * @param {object} timeline
 * @returns {boolean}
 */
export const hasValidTimeline = timeline => {
  return (!isNil(timeline) &&
    is(Number, timeline['T0T1']) &&
    is(Number, timeline['T1E']) &&
    is(Number, timeline['ET2']) &&
    is(Number, timeline['T2T3']))
}

/**
 * Check every price to contain operation column and date column
 * @param {array<object>} prices
 * @param {string} operationColumn
 * @param {string} dateColumn
 * @returns {boolean}
 */
export const hasValidPrices = (prices, operationColumn, dateColumn) => {
  return (!isNil(prices) &&
    is(Array, prices)) &&
    prices.length > 0 &&
    prices.every(item => is(Number, item[operationColumn]) && is(String, item[dateColumn]))
}

/**
 * Check calendar to have proper structure
 * @param {object} dataCalendar
 * @returns {boolean}
 */
export const hasValidCalendar = (dataCalendar) => {
  return (!isNil(dataCalendar) &&
    is(Object, dataCalendar)) &&
    Object.keys(dataCalendar).length > 0 &&
    Object.values(dataCalendar).every(item => is(Object, item))
}
/**
  Check every date in calendar has enough data (from timeline)
  @param {array<object>} prices
  @param {string} date
  @param {object} timeline
  @param {string} [dateProp]
  @return {boolean, array<object>} - array of invalids
*/
export const hasEnoughPrices = (prices, date, timeline, dateProp = defaultDateColumn) => {
  const index = findIndex(propEq(dateProp, date))(prices)
  const pricesLength = prices.length

  if (index === -1) return false
  else if (timeline['T0T1'] + timeline['T1E'] - 1 > index) return false
  else return pricesLength - 1 - index >= timeline['ET2'] + timeline['T2T3']
}

/**
 Validate request data to have proper structure
 @param {object} MMInfo - data to validate
 @return {string|boolean} - Invalid prop
 */
export const hasValidMMStructure = (MMInfo) => {
  MMInfo.forEach(({ date, stock, market, timeline, dateColumn, operationColumn }, index) => {
    const errorTrace = ` ERROR: in ${index} index, with date: ${date}`
    if (isNil(date)) return `Date can not be empty. ${errorTrace}`
    else if (!hasValidTimeline) return `Invalid Timeline. ${errorTrace}`
    else if (!hasEnoughPrices(stock, date, timeline)) return `Invalid Stock Data. ${errorTrace}`
    else if (!hasEnoughPrices(market, date, timeline)) return `Invalid Market Data. ${errorTrace}`
    else if (isNil(dateColumn)) return `Date Column can not be empty. ${errorTrace}`
    else if (isNil(operationColumn)) return `Operation Column should not be empty. ${errorTrace}`
  })

  return true
}
