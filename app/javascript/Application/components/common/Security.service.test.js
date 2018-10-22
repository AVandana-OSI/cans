import { SecurityService } from './Security.service'
import apiEndpoints from '../../App.api'

jest.mock('../../App.api')

describe('SecurityService', () => {
  const apiGetSpy = jest.spyOn(apiEndpoints, 'apiGet')
  beforeEach(() => {
    apiGetSpy.mockReset()
  })

  describe('checkPermission', () => {
    it('checks object permission on backend', async () => {
      const permission = 'assessment:write:1'
      const expectedResult = 'true'
      apiGetSpy.mockReturnValue('true')
      const actualResult = await SecurityService.checkPermission(permission)
      expect(actualResult).toBe(expectedResult)
      expect(apiGetSpy).toHaveBeenCalledTimes(1)
      expect(apiGetSpy).toHaveBeenCalledWith(`/security/check_permission/${permission}`)
    })
  })

  describe('refresh', () => {
    it('makes "/security/refresh" backend call', () => {
      SecurityService.refresh()
      expect(apiGetSpy).toHaveBeenCalledTimes(1)
      expect(apiGetSpy).toHaveBeenCalledWith(`/security/refresh`)
    })
  })
})
