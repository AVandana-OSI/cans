import React from 'react'
import { GlobalAlert } from './GlobalAlert'
import { globalAlertService } from '../../util/GlobalAlertService'
import { shallow } from 'enzyme'

describe('<GlobalAlert>', () => {
  describe('render', () => {
    let globalAlerts
    const findAlerts = () => globalAlerts.find('.global-alert')

    beforeEach(() => {
      globalAlerts = shallow(<GlobalAlert />)
    })

    it('does not show content when empty errors', () => {
      expect(findAlerts().length).toBe(0)
      expect(globalAlerts.render().text()).toBe('')
    })

    it('shows alert', () => {
      globalAlertService.postError({ message: 'Error message' })
      const alert = findAlerts()
      expect(alert.length).toBe(1)
      expect(alert.render().text()).toBe('Error message')
    })

    it('shows multiple alerts', () => {
      globalAlertService.postError({ message: 'Error message' })
      globalAlertService.postError({ message: 'Other Error message' })
      expect(findAlerts().length).toBe(2)
    })

    it('can close alert', () => {
      globalAlertService.postError({ message: 'Error message' })
      globalAlertService.postError({ message: 'Other Error message' })
      globalAlertService.postError({ message: 'One more Error message' })

      const closeTopAlert = () => {
        return findAlerts()
          .at(0)
          .dive()
          .find('.close-icon')
          .simulate('click')
      }

      closeTopAlert()
      const alerts = findAlerts()
      expect(alerts.length).toBe(2)
      const at0 = alerts.at(0)
      expect(at0.render().text()).toBe('Other Error message')
      const at1 = alerts.at(1)
      expect(at1.render().text()).toBe('One more Error message')

      // Close second alert
      closeTopAlert()
      // Close last alert
      closeTopAlert()
      expect(findAlerts().length).toBe(0)
    })
  })
})
