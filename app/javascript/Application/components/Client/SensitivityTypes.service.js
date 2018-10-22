import { apiGet } from '../../App.api'

export class SensitivityTypesService {
  static fetch(county) {
    const path = `/sensitivity_types${county && county.id ? `?county=${county.id}` : ''}`
    return apiGet(path)
  }
}

export default SensitivityTypesService
