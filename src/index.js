import validate from './services/validate'
import { model, MARKET_MODEL, MEAN_MODEL, extractMarketModelRequiredInfo, extractMeanModelRequiredInfo } from './services/eventStudy'
import { validateMMStructure, validateMeanModelStructure } from './services/validation'

export { AAR, CAR } from './services/eventStudy'
export * from './services/validation'

export const eventStudy = (data, modelType) => {
  const isInValidData = validate(data, {
    calendar: {
      presence: true,
      type: 'array'
    }
  })

  if (isInValidData) return isInValidData

  let structure
  let isValidStructure

  if (modelType === MARKET_MODEL) {
    structure = extractMarketModelRequiredInfo(data)
    isValidStructure = validateMMStructure(structure)

    if (isValidStructure) return isValidStructure

    return structure.map(s => model(s, modelType))
  } else if (modelType === MEAN_MODEL) {
    structure = extractMeanModelRequiredInfo(data)
    isValidStructure = validateMeanModelStructure(structure)

    if (isValidStructure) return isValidStructure

    return structure.map(s => model(s, modelType))
  } else throw new Error('unknown model')
}

/**
 * Process each date with market model
 * @param {object} data - request object
 * @return {object|string} - result object or validation result
 */
export const MarketModel = data => eventStudy(data, MARKET_MODEL)

/**
 * Process each date with mean model
 * @param {object} data - request object
 * @return {object|string} - result object or validation result
 */
export const MeanModel = data => eventStudy(data, MEAN_MODEL)
