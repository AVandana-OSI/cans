import SubordinateService from './Subordinate.service'
import apiEndpoints from '../../App.api'

jest.mock('../../App.api')

describe('SubordinateService', () => {
  describe('#fetch', () => {
    const apiGetSpy = jest.spyOn(apiEndpoints, 'apiGet')

    it('returns array of staff people', async () => {
      const expectedStaff = ['Alice', 'Bob']
      apiGetSpy.mockReturnValue(expectedStaff)
      const actualStaff = await SubordinateService.fetch()
      expect(actualStaff).toBe(expectedStaff)
      expect(apiGetSpy).toHaveBeenCalledTimes(1)
      expect(apiGetSpy).toHaveBeenCalledWith('/staff/subordinates')
    })
  })
})
