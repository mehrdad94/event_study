import marketModel from './routes/marketModel'
import bodyParser from 'body-parser'
import express from 'express'
import config from './config'
export const app = express()

// configuration
app.use(bodyParser.json())

// routes
app.post('/model/market', marketModel)

app.listen(config.port, config.host, () => {
  console.log(`Server listening on http://${config.host}:${config.port}`)
})
