import validate from 'validate.js'
import pluck from 'ramda/src/pluck'
import equals from 'ramda/src/equals'

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

validate.validators.arrayWithEqualField = (arrays, { field = '' }) => {
  if (field) {
    const getFields = pluck(field)

    const firstFields = getFields(arrays[0])
    const secondFields = getFields(arrays[1])

    if (equals(firstFields, secondFields)) return null
    else return 'Has unmatched fields'
  } else {
    throw new Error('field does not exist')
  }
}

export default validate
