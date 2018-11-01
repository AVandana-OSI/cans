import React from 'react'
import PhoneNumberInfo from './PhoneNumberInfo'
import { shallow } from 'enzyme'

describe('<PhoneNumberInfo />', () => {
  describe('init PhoneNumberInfo', () => {
    describe('page layout', () => {
      it('renders with 1 <div> element', () => {
        const wrapper = shallow(<PhoneNumberInfo />)
        expect(wrapper.find('div').length).toBe(1)
      })

      it('renders with 1 <i /> element', () => {
        const wrapper = shallow(<PhoneNumberInfo />)
        expect(wrapper.find('i').length).toBe(1)
      })

      it('renders with 1 <strong> element', () => {
        const wrapper = shallow(<PhoneNumberInfo />)
        expect(wrapper.find('strong').length).toBe(1)
      })

      it('renders with 1 <span> element', () => {
        const wrapper = shallow(<PhoneNumberInfo />)
        expect(wrapper.find('span').length).toBe(1)
      })
    })
  })
})
