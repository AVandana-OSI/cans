import { eventBus } from './eventBus'
import { alertType } from '../components/common'

const ALERT_EVENT = 'ALERT_EVENT'

class GlobalAlertService {
  subscribe = callback => {
    eventBus.subscribe(ALERT_EVENT, callback)
  }

  postError = ({ message }) => {
    eventBus.post(ALERT_EVENT, {
      type: alertType.DANGER,
      message: message || 'An error has occurred',
    })
  }
}

export const globalAlertService = new GlobalAlertService()
