import moment from 'moment'
import partition from 'ramda/src/partition'
import findIndex from 'ramda/src/findIndex'
import propEq from 'ramda/src/propEq'
import Schema from 'validate'

// Schemas
const validMarketModelRequestSchema = new Schema({
  dataCalendar: {
    type: Array,
    required: true
  },
  dataMarket: {
    type: Array,
    required: true
  },
  dataStock: {
    type: Array,
    required: true
  },
  timeline: {
    type: Object,
    required: true
  }
})

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
    else if (dataLength - 1 - index < timeline['ET2'] + timeline['T2T3']) return false
    else return true
  }
  const [, invalids] = partition(date => hasEnoughItems(data, date), calendar)
  return invalids
}

/**
  Check is request valid market model schema
  @param {object} request
  @return {array} - array of errors
*/
export const hasValidMarketModelRequestSchema = request => validMarketModelRequestSchema.validate(request)
