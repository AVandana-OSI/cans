import UserAccountService from './UserAccountService'

describe('UserAccountService', () => {
  describe('#fetchCurrent', () => {
    let getSpy

    beforeEach(() => {
      getSpy = jest.spyOn(UserAccountService.httpClient, 'get')
    })

    it('has a timeout of 15 seconds', () => {
      expect(UserAccountService.httpClient.defaults.timeout).toBe(15000)
    })

    it('has a baseUrl of / or /cans', () => {
      expect(UserAccountService.httpClient.defaults.baseURL).toMatch(/(\/|\/cans)/)
    })

    it('calls backend service', () => {
      getSpy.mockReturnValue(Promise.resolve(42))
      expect(getSpy).not.toHaveBeenCalled()
      UserAccountService.fetchCurrent()
      expect(getSpy).toHaveBeenCalledWith('/user/account')
    })

    describe('when could not fetch data', () => {
      it('returns empty object', () => {
        getSpy.mockReturnValue(new Promise((resolve, reject) => setTimeout(() => reject(new Error('e')), 0)))
        UserAccountService.fetchCurrent().catch(actualResult => {
          expect(actualResult).toEqual({})
        })
      })
    })
  })
})
