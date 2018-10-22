import React from 'react'
import { TimeoutWarning } from './TimeoutWarning'
import { shallow } from 'enzyme'
import { eventBus } from './../../util/eventBus'
import { TIMEOUT_EVENT } from './../../util/constants'
import { Button } from 'reactstrap'
import { SecurityService } from './Security.service'

describe('<TimeoutWarning />', () => {
  const props = {}

  describe('timeout warning presence trigger', () => {
    it('<TimeoutWarning /> is present when session expiration event is received', () => {
      const wrapper = shallow(<TimeoutWarning {...props} />)
      eventBus.post(TIMEOUT_EVENT)
      expect(wrapper.instance().state.isOpened).toBeTruthy()
    })

    it('<TimeoutWarning /> is not present when session expiration event is received', () => {
      const wrapper = shallow(<TimeoutWarning {...props} />)
      expect(wrapper.instance().state.isOpened).toBeFalsy()
    })
  })

  describe('timeout buttons', () => {
    it('"Logout" button does logout on click', () => {
      TimeoutWarning.prototype.logout = jest.fn()
      const wrapper = shallow(<TimeoutWarning {...props} />)
      wrapper
        .find(Button)
        .at(0)
        .simulate('click')
      expect(TimeoutWarning.prototype.logout).toBeCalled()
    })

    it('"Refresh" button calls refresh endpoint on click', () => {
      const wrapper = shallow(<TimeoutWarning {...props} />)
      SecurityService.refresh = jest.fn()
      wrapper
        .find(Button)
        .at(1)
        .simulate('click')
      expect(SecurityService.refresh).toBeCalled()
    })
  })
})
