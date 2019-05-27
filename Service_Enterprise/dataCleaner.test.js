/* global it expect */
import { toJson } from './dataCleaner.js'

it('Should convert csv text to JSON', function () {
  const data = `Date,Open
  2019-04-29,204.399994`
  const type = 'CSV'

  return toJson(data, type).then(result => {
    expect(result).toEqual([{ Date: '2019-04-29', Open: '204.399994' }])
  })
})
