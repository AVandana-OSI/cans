import { apiGet } from '../../App.api'
import { encodedSearchAfterParams } from './searchHelper'

export class SearchService {
  static getClients({ searchTerm, sortAfter = null }) {
    let saps = []
    let endpoint = ''
    if (sortAfter) {
      saps = searchAfterParams(sortAfter)
      endpoint = `/people_searches?search_term=${searchTerm}&is_client_only=true&${saps}`
    } else {
      endpoint = `/people_searches?search_term=${searchTerm}&is_client_only=true`
    }

    return apiGet(endpoint)
  }
}
