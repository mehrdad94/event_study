import validate from './services/validate'
import { marketModel, extractMarketModelRequiredInfo } from './services/eventStudy'
import { MMStructureSchema } from './services/validation'

export { AAR, CAR } from './services/eventStudy'

/**
 * Process each date with market model
 * @param {object} data - request object
 * @return {object|string} - result object or validation result
 */
export const MarketModel = data => {
  const MMStructure = extractMarketModelRequiredInfo(data)

  const validationResult = validate.single(MMStructure, MMStructureSchema)

  if (!validationResult) return MMStructure.map(marketModel)
  else return validationResult
}
