import React from 'react'
import PhoneNumberInfo from './PhoneNumberInfo'
import { shallow } from 'enzyme'

describe('<PhoneNumberInfo />', () => {
  describe('init PhoneNumberInfo', () => {
    describe('page layout', () => {
      it('renders with 1 <div> element', () => {
        const props = { type: 'Home', number: '(555) 777-8888' }
        const wrapper = shallow(<PhoneNumberInfo {...props} />)
        expect(wrapper.find('div').length).toBe(1)
      })

      it('renders with 1 <i/> element', () => {
        const props = { type: 'Home', number: '(555) 777-8888' }
        const wrapper = shallow(<PhoneNumberInfo {...props} />)
        expect(wrapper.find('i').length).toBe(1)
      })

      it('renders with 1 <strong> element', () => {
        const props = { type: 'Home', number: '(555) 777-8888' }
        const wrapper = shallow(<PhoneNumberInfo {...props} />)
        expect(wrapper.find('strong').length).toBe(1)
      })

      it('renders with 1 <span> element', () => {
        const props = { type: 'Home', number: '(555) 777-8888' }
        const wrapper = shallow(<PhoneNumberInfo {...props} />)
        expect(wrapper.find('span').length).toBe(1)
      })
    })
  })

  describe('renders phone number info', () => {
    it('renders the type of phone number', () => {
      const props = { type: 'Home', number: '(555) 111-2222' }
      const wrapper = shallow(<PhoneNumberInfo {...props} />)
      expect(wrapper.find('strong').text()).toEqual('Home')
    })

    it('renders the phone number', () => {
      const props = { type: 'Home', number: '(555) 111-2222' }
      const wrapper = shallow(<PhoneNumberInfo {...props} />)
      expect(wrapper.find('span').text()).toEqual('(555) 111-2222')
    })
  })
})
