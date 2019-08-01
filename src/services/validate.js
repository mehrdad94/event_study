import validate from 'validate.js'

validate.validators.forEach = (arrayItems, itemConstraints) => {
  if (!Array.isArray(arrayItems)) return null

  const arrayItemErrors = arrayItems.reduce((errors, item, index) => {
    const constraints = { ...itemConstraints }

    if (validate.isFunction(constraints['stock'])) constraints['stock'] = constraints['stock'](item)
    if (validate.isFunction(constraints['market'])) constraints['market'] = constraints['market'](item)

    const error = validate(item, constraints)

    if (error) errors[index] = { error: error }

    return errors
  }, {})

  return validate.isEmpty(arrayItemErrors) ? null : { errors: arrayItemErrors }
}

export default validate
