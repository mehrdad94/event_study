import findIndex from 'ramda/src/findIndex'
import propEq from 'ramda/src/propEq'

import { defaultDateColumn } from '../config/defaults'

export const timelineKeySchema = {
  presence: true,
  numericality: {
    strict: true,
    greaterThan: 0
  }
}

export const columnNameSchema = {
  presence: true,
  type: 'string',
  length: {
    minimum: 1
  }
}

export const priceSchema = ({ dateColumn, operationColumn }) => {
  return {
    presence: true,
    type: 'array',
    length: {
      minimum: 1
    },
    forEach: {
      [dateColumn]: columnNameSchema,
      [operationColumn]: timelineKeySchema
    }
  }
}

export const calendarSchema = {
  presence: true,
  type: 'array',
  length: {
    minimum: 1
  },
  forEach: {
    Date: columnNameSchema
  }
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

export const MMStructureSchema = {
  presence: true,
  type: 'array',
  forEach: {
    date: columnNameSchema,
    stock: priceSchema,
    market: priceSchema,
    'timeline.T0T1': timelineKeySchema,
    'timeline.T1E': timelineKeySchema,
    'timeline.ET2': timelineKeySchema,
    'timeline.T2T3': timelineKeySchema,
    dateColumn: columnNameSchema,
    operationColumn: columnNameSchema
  }
}
