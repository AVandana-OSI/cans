import { apiGet } from '../../App.api'

export class I18nService {
  static fetchByInstrumentId(id, lang = 'en') {
    return apiGet(`/instruments/${id}/i18n/${lang}`)
  }
}

export default I18nService
