import validate from './services/validate'
import { marketModel, extractMarketModelRequiredInfo } from './services/eventStudy'
import { validateMMStructure } from './services/validation'

export { AAR, CAR } from './services/eventStudy'
export * from './services/validation'

/**
 * Process each date with market model
 * @param {object} data - request object
 * @return {object|string} - result object or validation result
 */
export const MarketModel = data => {
  const isInValidData = validate(data, {
    calendar: {
      presence: true,
      type: 'array'
    }
  })

  let MMStructure

  if (!isInValidData) MMStructure = extractMarketModelRequiredInfo(data)
  else return isInValidData

  const validationResult = validateMMStructure(MMStructure)

  if (!validationResult) return MMStructure.map(marketModel)
  else return validationResult
}
