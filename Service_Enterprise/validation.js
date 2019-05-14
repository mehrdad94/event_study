import moment from 'moment'

const isValidDate = d => moment(d).isValid()

export const hasAllValidDate = (a, property) => a.every(item => isValidDate(item[property]))
