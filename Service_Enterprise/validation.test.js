/* global it expect */
import { hasAllValidDate } from './validation.js'

// validate dates
it('Should check all content has valid date', function () {
  const data = [
    { date: '2016-12-01' },
    { date: '2016-12-11' }
  ]
  expect(hasAllValidDate(data, 'date')).toBe(true)
})
