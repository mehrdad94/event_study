// import { ValidateMarketModel } from './services/validation'
import { marketModel, extractMarketModelRequiredInfo } from './services/eventStudy'
import { hasValidMMStructure } from './services/validation'

/**
 * Process each date with market model
 * @param {object} data - request object
 * @return {object|string} - result object or validation result
 */
export const MarketModel = (data) => {
  const MMStructure = extractMarketModelRequiredInfo(data)
  const validationResult = hasValidMMStructure(MMStructure)
  if (validationResult) return MMStructure.map(marketModel)
  else return validationResult
}
