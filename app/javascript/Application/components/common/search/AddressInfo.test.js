import React from 'react'
import AddressInfo from './AddressInfo'
import { shallow } from 'enzyme'

describe('<AddressInfo />', () => {
  describe('init AddressInfo', () => {
    describe('page layout', () => {
      it('renders with 1 <div> element', () => {
        const wrapper = shallow(<AddressInfo />)
        expect(wrapper.find('div').exists()).toBe(1)
      })

      it('renders with 1 <i /> element', () => {
        const wrapper = shallow(<AddressInfo />)
        expect(wrapper.find('i').exists()).toBe(1)
      })

      it('renders with 1 <strong> element', () => {
        const wrapper = shallow(<AddressInfo />)
        expect(wrapper.find('strong').exists()).toBe(1)
      })

      it('renders with 1 <span> element', () => {
        const wrapper = shallow(<AddressInfo />)
        expect(wrapper.find('span').exists()).toBe(1)
      })
    })
  })
})
