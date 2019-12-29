import validate from './validate'

const timelineKeySchema = {
  presence: true,
  numericality: {
    strict: true,
    greaterThan: 0
  }
}

export const validateTimelineKey = value => validate.single(value, timelineKeySchema)

const columnNameSchema = {
  presence: true,
  type: 'string',
  length: {
    minimum: 1
  }
}

export const validateColumnName = value => validate.single(value, columnNameSchema)

const priceSchema = ({ dateColumn, operationColumn }) => {
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

export const validatePrices = (value, dateColumn, operationColumn) => validate.single(value, priceSchema({ dateColumn, operationColumn }))

const calendarSchema = {
  presence: true,
  type: 'array',
  length: {
    minimum: 1
  },
  forEach: {
    Date: columnNameSchema
  }
}

export const validateCalendar = value => validate.single(value, calendarSchema)


const MarketModelStructureSchema = {
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

const MeanModelStructureSchema = {
  presence: true,
  type: 'array',
  forEach: {
    date: columnNameSchema,
    stock: priceSchema,
    'timeline.T0T1': timelineKeySchema,
    'timeline.T1E': timelineKeySchema,
    'timeline.ET2': timelineKeySchema,
    'timeline.T2T3': timelineKeySchema,
    dateColumn: columnNameSchema,
    operationColumn: columnNameSchema
  }
}

export const validateMMStructure = value => validate.single(value, MarketModelStructureSchema)
export const validateMeanModelStructure = value => validate.single(value, MeanModelStructureSchema)
