import { getI18nByCode, getI18nValuesByPrefix } from './I18nHelper'

describe('<I18nHelper />', () => {
  describe('#getI18nByCode()', () => {
    it('filters records by code and cuts the code off', () => {
      const inputI18n = {
        'item10._title_': 'Title 10',
        'item10._description_': 'Description 10',
        'item11._title_': 'Title 11',
        'item11._description_': 'Description 11',
      }
      const actualResult = getI18nByCode(inputI18n, 'item10')
      const expectedResult = {
        _title_: 'Title 10',
        _description_: 'Description 10',
      }
      expect(actualResult).toEqual(expectedResult)
    })
  })

  describe('#getI18nValuesByPrefix()', () => {
    it('filters records by prefix and returns values only', () => {
      const inputI18n = {
        'item10._title_': 'Title 10',
        'item10._description_': 'Description 10',
        'item11._title_': 'Title 11',
        'item11._description_': 'Description 11',
      }
      const actualResult = getI18nValuesByPrefix(inputI18n, 'item10.')
      const expectedResult = ['Title 10', 'Description 10']
      expect(actualResult).toEqual(expectedResult)
    })
  })
})
