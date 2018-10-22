import { CountiesService } from './Counties.service'
import apiEndpoints from '../../App.api'

jest.mock('../../App.api')

describe('CountiesService', () => {
  describe('#fetchCounties', () => {
    const apiGetSpy = jest.spyOn(apiEndpoints, 'apiGet')
    beforeEach(() => {
      apiGetSpy.mockReset()
    })

    it('returns array of Counties', async () => {
      const expectedCounties = []
      apiGetSpy.mockReturnValue(expectedCounties)
      const actualCounties = await CountiesService.fetchCounties()
      expect(actualCounties).toBe(expectedCounties)
      expect(apiGetSpy).toHaveBeenCalledTimes(1)
      expect(apiGetSpy).toHaveBeenCalledWith(`/counties`)
    })
  })
})
