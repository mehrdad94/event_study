import { hasValidMarketModelRequestSchema } from './Service_Enterprise/validation'
const bodyParser = require('body-parser')
export const app = require('express')()

// configuration
app.use(bodyParser.json())

// routes
app.post('/model/market', ({ body }, res) => {
  // validation
  const rootSchemaValidation = hasValidMarketModelRequestSchema(body)

  if (rootSchemaValidation.length !== 0) {
    res.status(422).json(rootSchemaValidation)
  }

  res.status(200).json({})
})
