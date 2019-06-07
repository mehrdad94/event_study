import moment from 'moment'
import partition from 'ramda/src/partition'
import findIndex from 'ramda/src/findIndex'
import propEq from 'ramda/src/propEq'
import is from 'ramda/src/is'
import isNil from 'ramda/src/isNil'

const isValidDate = (d, f) => moment(d, f).isValid()

/**
  Check every item in an array has a valid date
  @param {array<object>} array - array of items
  @param {string} property - which property in object
  @param {string} format - date format
*/
export const hasAllValidDate = (array, property, format) => {
  const [, invalids] = partition(item => isValidDate(item[property], format), array)
  return invalids
}

/**
  Check every date in calendar has enough data (from timeline)
  @param {array<object>} data
  @param {array<object>} calendar
  @param {object} timeline
  @param {string} [dateProp]
  @return {boolean, array<object>} - array of invalids
*/
export const hasValidCalendar = (data, calendar, timeline, dateProp = 'date') => {
  const hasEnoughItems = (data, date) => {
    const index = findIndex(propEq(dateProp, date[dateProp]))(data)
    const dataLength = data.length
    if (index === -1) return false
    else if (timeline['T0T1'] + timeline['T1E'] - 1 > index) return false
    else return dataLength - 1 - index >= timeline['ET2'] + timeline['T2T3']
  }
  const [, invalids] = partition(date => hasEnoughItems(data, date), calendar)
  return invalids
}

const isValidDataMarket = ({ dataMarket, operationField, dateField }) => {
  return (!isNil(dataMarket) &&
          is(Array, dataMarket)) &&
          dataMarket.length > 0 &&
          dataMarket.every(item => is(Number, item[operationField]) && is(String, item[dateField]))
}
const isValidDataStock = ({ dataStock, operationField, dateField }) => {
  return (!isNil(dataStock) &&
    is(Array, dataStock)) &&
    dataStock.length > 0 &&
    dataStock.every(item => is(Number, item[operationField]) && is(String, item[dateField]))
}
const isValidDataCalendar = ({ dataCalendar }) => {
  return (!isNil(dataCalendar) && is(String, dataCalendar))
}
const isValidTimeline = ({ timeline }) => {
  return (!isNil(timeline) &&
          is(Number, timeline['T0T1']) &&
          is(Number, timeline['T1E']) &&
          is(Number, timeline['ET2']) &&
          is(Number, timeline['T2T3']))
}
/**
 Check api request information for market model request
 @param {object} data - data to validate
 @return {object} - validated object
 @todo refactor validation to accept a schema then do the rest of it
 */
export const ValidateMarketModel = (data) => {
  if (isNil(data)) return 'You should provide value'
  else if (isNil(data.operationField)) return 'Operation filed should not be empty'
  else if (isNil(data.dateField)) return 'Date field should not be empty'
  else if (!isValidDataCalendar(data)) return 'Invalid Data Calendar'
  else if (!isValidTimeline(data)) return 'Invalid Timeline'
  else if (!isValidDataMarket(data)) return 'Invalid Market Data'
  else if (!isValidDataStock(data)) return 'Invalid Data Stock'
  else return ''
}
