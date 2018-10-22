import { apiGet } from '../../App.api'

export class CountiesService {
  static fetchCounties() {
    return apiGet(`/counties`)
  }
}

export default CountiesService
