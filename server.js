import marketModel from './routes/marketModel'
const bodyParser = require('body-parser')
export const app = require('express')()

// configuration
app.use(bodyParser.json())

// routes
app.post('/model/market', marketModel)
