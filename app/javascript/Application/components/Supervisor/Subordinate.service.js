import { apiGet } from '../../App.api'

class SubordinateService {
  static fetch() {
    return apiGet('/staff/subordinates')
  }
}

export default SubordinateService
