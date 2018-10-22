import { appApi, apiEndpoints } from './App.api'

describe('ApiService', () => {
  it('has a timeout of 15000 seconds', () => {
    expect(appApi.defaults.timeout).toBe(15000)
  })

  it('has a baseUrl of /api/ or /cans', () => {
    expect(appApi.defaults.baseURL).toMatch(/(\/api|\/cans\/api)/)
  })

  describe('apiEndpoints', () => {
    describe('apiGet', () => {
      it('calls appApi', async () => {
        const apiSpy = jest.spyOn(appApi, 'get')
        apiSpy.mockReturnValue(Promise.resolve({ data: 'true' }))
        const result = await apiEndpoints.apiGet('/')
        expect(result).toEqual('true')
        expect(apiSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('apiPost', () => {
      it('calls appApi', async () => {
        const apiSpy = jest.spyOn(appApi, 'post')
        apiSpy.mockReturnValue(Promise.resolve({ data: 'true' }))
        const result = await apiEndpoints.apiPost('/', {})
        expect(result).toEqual('true')
        expect(apiSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('apiPut', () => {
      it('calls appApi', async () => {
        const apiSpy = jest.spyOn(appApi, 'put')
        apiSpy.mockReturnValue(Promise.resolve({ data: 'true' }))
        const result = await apiEndpoints.apiPut('/', {})
        expect(result).toEqual('true')
        expect(apiSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('apiDelete', () => {
      it('calls appApi', async () => {
        const apiSpy = jest.spyOn(appApi, 'delete')
        apiSpy.mockReturnValue(Promise.resolve({ data: 'true' }))
        const result = await apiEndpoints.apiDelete('/')
        expect(result).toEqual('true')
        expect(apiSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})
