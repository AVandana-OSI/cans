import React from 'react'
import AddressInfo from './AddressInfo'
import { shallow } from 'enzyme'

const props = {
  city: 'Sacramento',
  state: 'CA',
  zip: '95834',
  streetAddress: '1234 Hansons Way',
  type: 'Home',
}

describe('<AddressInfo />', () => {
  describe('init AddressInfo', () => {
    describe('page layout', () => {
      it('renders with 1 <div> element', () => {
        const wrapper = shallow(<AddressInfo {...props} />)
        expect(wrapper.find('div').exists()).toBe(true)
      })

      it('renders with 1 <span> element', () => {
        const wrapper = shallow(<AddressInfo {...props} />)
        expect(wrapper.find('span').exists()).toBe(true)
      })
    })
  })

  describe('renders address info', () => {
    it('renders the address', () => {
      const wrapper = shallow(<AddressInfo {...props} />)
      expect(wrapper.find('span').text()).toEqual(
        '1234 Hansons Way, Sacramento, CA 95834'
      )
    })
  })
})
