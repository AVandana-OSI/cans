import Cookies from 'universal-cookie'
import { eventBus } from './eventBus'
import { TIMEOUT_EVENT, SESSION_EXPIRATION_WARNING_TIME } from './constants'

class TimeoutService {
  run() {
    const cookies = new Cookies()
    const expirationTime = cookies.get('_ca_cans_timeout')
    if (!expirationTime) {
      window.location.reload()
      return
    }
    const instance = this
    const expirationTimeMs = parseInt(expirationTime)
    const warningTimeMs = expirationTimeMs - new Date().getTime()
    const callback = () => instance.run()
    if (warningTimeMs <= SESSION_EXPIRATION_WARNING_TIME) {
      eventBus.post(TIMEOUT_EVENT)
      setTimeout(callback, expirationTimeMs - new Date().getTime())
    } else {
      setTimeout(callback, warningTimeMs - new Date().getTime())
    }
  }
}

export const timeoutService = new TimeoutService()
