import { ValidateMarketModel } from './Service_Enterprise/validation'
import { marketModel } from './Service_Business/eventStudy'
import prop from 'ramda/src/prop'
const bodyParser = require('body-parser')
export const app = require('express')()

// configuration
app.use(bodyParser.json())

// routes
app.post('/model/market', ({ body }, res) => {
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
})
