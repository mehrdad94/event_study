import validate from './services/validate'
import { marketModel, meanModel, extractMarketModelRequiredInfo, extractMeanModelRequiredInfo } from './services/eventStudy'
import { validateMMStructure, validateMeanModelStructure } from './services/validation'

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

/**
 * Process each date with mean model
 * @param {object} data - request object
 * @return {object|string} - result object or validation result
 */
export const MeanModel = data => {
  const isInValidData = validate(data, {
    calendar: {
      presence: true,
      type: 'array'
    }
  })

  let MMStructure

  if (!isInValidData) MMStructure = extractMeanModelRequiredInfo(data)
  else return isInValidData

  const validationResult = validateMeanModelStructure(MMStructure)

  if (!validationResult) return MMStructure.map(meanModel)
  else return validationResult
}
