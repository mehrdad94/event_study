import { ValidateMarketModel } from '../services/validation'
import { marketModel } from '../services/eventStudy'
import prop from 'ramda/src/prop'

/**
 * Process every date with market model
 * @param {object} body
 * @param {object} res
 */
export default ({ body }, res) => {
  const isValidRequest = ValidateMarketModel(body)

  if (isValidRequest.length !== 0) {
    res.status(422).json({ isValidRequest })
  } else {
    const { dataCalendar, dateField } = body
    const calcMarketModel = date => marketModel({ ...body, date })

    res.status(200).json(
      dataCalendar
        .map(prop(dateField))
        .map(calcMarketModel)
    )
  }
}
