import axios from 'axios'
import { handleError } from '../../util/ApiErrorHandler'

class UserAccountService {
  static httpClient = axios.create({
    baseURL: process.env.CANS_BASE_PATH || '/',
    timeout: 15000,
  })

  static cachedUser = null

  static fetchCurrent() {
    this.cachedUser =
      this.cachedUser ||
      this.httpClient
        .get('/user/account')
        .then(response => response.data)
        .catch(handleError)

    return this.cachedUser
  }
}

export default UserAccountService
