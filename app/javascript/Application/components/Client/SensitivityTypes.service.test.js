import { SensitivityTypesService } from './SensitivityTypes.service'
import apiEndpoints from '../../App.api'

jest.mock('../../App.api')

describe('SensitivityTypesService', () => {
  describe('#fetch', () => {
    const apiGetSpy = jest.spyOn(apiEndpoints, 'apiGet')
    beforeEach(() => {
      apiGetSpy.mockReset()
    })

    describe('When pass county with id', () => {
      it('calls API with county parameter', async () => {
        const expected = []
        apiGetSpy.mockReturnValue(expected)
        const actual = await SensitivityTypesService.fetch({ id: 42 })
        expect(actual).toBe(expected)
        expect(apiGetSpy).toHaveBeenCalledTimes(1)
        expect(apiGetSpy).toHaveBeenCalledWith(`/sensitivity_types?county=42`)
      })
    })

    describe('When pass empty object or null or undefined', () => {
      it('calls API without county parameter', async () => {
        const expected = []
        apiGetSpy.mockReturnValue(expected)
        await SensitivityTypesService.fetch({})
        expect(apiGetSpy).toHaveBeenCalledTimes(1)
        expect(apiGetSpy).toHaveBeenCalledWith(`/sensitivity_types`)
        apiGetSpy.mockReset()

        await SensitivityTypesService.fetch(null)
        expect(apiGetSpy).toHaveBeenCalledTimes(1)
        expect(apiGetSpy).toHaveBeenCalledWith(`/sensitivity_types`)
        apiGetSpy.mockReset()

        await SensitivityTypesService.fetch(undefined)
        expect(apiGetSpy).toHaveBeenCalledTimes(1)
        expect(apiGetSpy).toHaveBeenCalledWith(`/sensitivity_types`)
      })
    })
  })
})
