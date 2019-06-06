/* global it */
import { app } from './server'
const request = require('supertest')

// helper
const fakeStockDataGenerator = n => ({ Date: `${n}`, Close: 2 ** n })
const seqGenerator = n => n !== 1 ? [...seqGenerator(n - 1), n] : [n]

// data
const dataCalendar = [{ Date: '6' }]
const dataMarket = seqGenerator(11).map(fakeStockDataGenerator)
const dataStock = seqGenerator(22).map(fakeStockDataGenerator)
const timeline = {
  T0T1: 2,
  T1E: 2,
  ET2: 2,
  T2T3: 2
}
const operationField = 'Close'
const dateField = 'Date'
it('Should test market model service with invalid request params', function (done) {
  // missed the timeline
  const invalidBody = {
    dataCalendar,
    dataMarket,
    dataStock
  }

  request(app)
    .post('/model/market')
    .send(invalidBody)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(422, done)
})

it('Should test market model service with valid request', function (done) {
  const validBody = {
    dataCalendar,
    dataMarket,
    dataStock,
    timeline,
    operationField,
    dateField
  }

  request(app)
    .post('/model/market')
    .send(validBody)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done)
})
