import { apiGet } from '../../App.api'

export class SecurityService {
  static checkPermission(permission) {
    return apiGet(`/security/check_permission/${permission}`)
  }
  static refresh() {
    return apiGet('/security/refresh')
  }
}

export default SecurityService
