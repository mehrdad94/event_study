import partition from 'ramda/src/partition'
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
  @param {array<string>} dates
  @param {object} timeline
  @param {string} [dateProp]
  @return {boolean, array<object>} - array of invalids
*/
export const hasEnoughPrices = (prices, dates, timeline, dateProp = defaultDateColumn) => {
  const hasEnoughItems = (prices, date) => {
    const index = findIndex(propEq(dateProp, date))(prices)
    const pricesLength = prices.length
    if (index === -1) return false
    else if (timeline['T0T1'] + timeline['T1E'] - 1 > index) return false
    else return pricesLength - 1 - index >= timeline['ET2'] + timeline['T2T3']
  }
  const [, invalids] = partition(date => hasEnoughItems(prices, date), dates)
  return invalids
}

// /**
//  @param {object} data - data to validate
//  @return {object} - validated object
//  @todo refactor validation to accept a schema then do the rest of it
//  */
// export const hasValidMMStructure = (data) => {
//   if (isNil(data)) return 'You should provide value'
//   else if (isNil(data.operationColumn)) return 'Operation filed should not be empty'
//   else if (isNil(data.dateColumn)) return 'Date field should not be empty'
//   else if (!isValidDataCalendar(data)) return 'Invalid Data Calendar'
//   else if (!isValidTimeline(data)) return 'Invalid Timeline'
//   else if (!isValidDataMarket(data)) return 'Invalid Market Data'
//   else if (!isValidDataStock(data)) return 'Invalid Data Stock'
//   else return ''
// }
