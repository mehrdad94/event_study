import { ValidateMarketModel } from './Service_Enterprise/validation'
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
    res.status(200).json({})
  }
})
