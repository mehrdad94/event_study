import validate from 'validate.js'
import pluck from 'ramda/src/pluck'

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

    const diffObject = firstFields.reduce((a, b) => {
      a[b] = b
      return a
    }, {})

    secondFields.forEach(item => {
      if (diffObject[item]) delete diffObject[item]
      else diffObject[item] = item
    })

    const diff = Object.keys(diffObject)

    if (!diff.length) return null
    else return `Has unmatched fields: ${diff.toString()}`
  } else {
    throw new Error('field does not exist')
  }
}

export default validate
