const csv = require('csvtojson/v2')

/**
  this function will transform string to JSON
  @param {string} data
  @param {string} type
  @return {promise}
*/
export const toJson = (data, type = 'CSV') => {
  if (type === 'CSV') return csv().fromString(data)
  else return new Promise()
}
