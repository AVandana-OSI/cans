import { SearchService } from './Search.service'
import apiEndpoints, { apiGet } from '../../App.api'
import { searchResponse } from './search.mocks'

jest.mock('../../App.api')

describe('SearchService', () => {
  describe('#getClients', () => {
    const apiGetSpy = jest.spyOn(apiEndpoints, 'apiGet')

    it('gets client results from Dora', async () => {
      const searchTerm = 'annie'
      apiGetSpy.mockReturnValue(searchResponse)
      const actualSearchResults = await SearchService.getClients({ searchTerm })
      expect(actualSearchResults).toBe(searchResponse)
      expect(apiGetSpy).toHaveBeenCalledTimes(1)
      expect(apiGetSpy).toHaveBeenCalledWith(`/people_searches?search_term=${searchTerm}&is_client_only=true`)

      apiGetSpy.mockReset()
    })
  })
})
