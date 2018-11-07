import React from 'react'
import { shallow } from 'enzyme'
import Gender from './Gender'

describe('<Gender />', () => {
  describe('init Gender', () => {
    describe('page layout', () => {
      it('renders with 1 <div> element', () => {
        const props = {
          gender: 'female',
        }
        const wrapper = shallow(<Gender {...props} />)
        expect(wrapper.find('div').length).toBe(1)
      })
    })
  })

  describe('gender info', () => {
    it('renders the gender', () => {
      const props = {
        gender: 'female',
      }
      const wrapper = shallow(<Gender {...props} />)
      expect(wrapper.html()).toContain('<div>Female</div>')
    })

    it('it does NOT render the gender when none exists', () => {
      const props = { gender: null }
      const wrapper = shallow(<Gender {...props} />)
      expect(wrapper.html()).toBe(null)
    })
  })
})
