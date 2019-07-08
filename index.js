// import { ValidateMarketModel } from './services/validation'
import { marketModel } from './services/eventStudy'
import { defaultTimeLine, defaultOperationColumn, defaultDateColumn } from './config/defaults'

const extractMarketModelRequiredInfo = ({
  calendar,
  stock,
  market,
  timeline = defaultTimeLine,
  dateColumn = defaultDateColumn,
  operationColumn = defaultOperationColumn }) => {
  return Object.entries(calendar).map(([date, option]) => {
    return {
      date,
      stock: option.stock || stock,
      market: option.market || market,
      timeline: option.timeline || timeline,
      dateColumn: option.dateColumn || dateColumn,
      operationColumn: option.operationColumn || operationColumn
    }
  })
}

/**
 * Process each date with market model
 * @param {object} data
 */
export const MarketModel = (data) => {
  const extractedInfo = extractMarketModelRequiredInfo(data)

  return extractedInfo.map(marketModel)
}
