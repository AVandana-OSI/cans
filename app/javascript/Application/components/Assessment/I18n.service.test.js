import { I18nService } from './I18n.service'
import apiEndpoints from '../../App.api'

jest.mock('../../App.api')

describe('I18nService', () => {
  describe('#fetch', () => {
    const apiGetSpy = jest.spyOn(apiEndpoints, 'apiGet')

    beforeEach(() => {
      apiGetSpy.mockReset()
    })

    it('returns i18n by instrument id', async () => {
      const instrumentId = 1
      const lang = 'en'
      const expectedI18n = { _title_: 'abc' }
      apiGetSpy.mockReturnValue(expectedI18n)
      const actualI18n = await I18nService.fetchByInstrumentId(instrumentId)
      expect(actualI18n).toBe(expectedI18n)
      expect(apiGetSpy).toHaveBeenCalledTimes(1)
      expect(apiGetSpy).toHaveBeenCalledWith(`/instruments/${instrumentId}/i18n/${lang}`)
    })
  })
})
