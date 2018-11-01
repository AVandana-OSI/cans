import React from 'react'
import AgeInfo from './AgeInfo'
import { shallow } from 'enzyme'

describe('<AgeInfo />', () => {
  describe('init AgeInfo', () => {
    describe('page layout', () => {
      it('renders with 1 <div> element', () => {
        const wrapper = shallow(<AgeInfo />)
        expect(wrapper.find('div').length).toBe(1)
      })

      it('renders with 3 <span> element', () => {
        const wrapper = shallow(<AgeInfo />)
        expect(wrapper.find('span').length).toBe(3)
      })

      it('renders with 1 <em> element', () => {
        const wrapper = shallow(<AgeInfo />)
        expect(wrapper.find('em').length).toBe(1)
      })
    })
  })
})
