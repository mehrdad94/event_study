const bodyParser = require('body-parser')
export const app = require('express')()

// configuration
app.use(bodyParser.json())

// routes
app.post('/model/market', ({ body }, res) => {
  // 422
  res.status(200).json({})
})
