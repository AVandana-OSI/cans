import React from 'react'
import AgeInfo from './AgeInfo'
import { shallow } from 'enzyme'
import moment from 'moment'

describe('<AgeInfo />', () => {
  describe('init AgeInfo', () => {
    describe('page layout', () => {
      it('renders with 1 <div> element', () => {
        const props = { dateOfBirth: '1989-11-01' }
        const wrapper = shallow(<AgeInfo {...props} />)
        expect(wrapper.find('div').length).toBe(1)
      })

      it('renders with 2 <span> elements', () => {
        const props = { dateOfBirth: '1989-11-01' }
        const wrapper = shallow(<AgeInfo {...props} />)
        expect(wrapper.find('span').length).toBe(2)
      })
    })
  })

  describe('Age Info', () => {
    it('renders info when DOB is present', () => {
      const props = { dateOfBirth: '1989-11-01' }
      const wrapper = shallow(<AgeInfo {...props} />)
      expect(wrapper.html()).toContain(
        '<div class="highlighted"><span>11/1/1989</span><span> (29 years)</span></div>'
      )
    })

    it('does NOT render info when DOB is NOT present', () => {
      const props = { dateOfBirth: null }
      const wrapper = shallow(<AgeInfo {...props} />)
      expect(wrapper.html()).toBe(null)
    })

    it('renders 0 years when DOB is less than 1 year from today', () => {
      const formattedDob = moment()
        .subtract(1, 'months')
        .format('MM/D/YYYY')
      const props = {
        dateOfBirth: moment()
          .subtract(1, 'months')
          .format('YYYY-MM-DD'),
      }
      const wrapper = shallow(<AgeInfo {...props} />)
      expect(wrapper.html()).toContain(
        `<div class="highlighted"><span>${formattedDob}</span><span> (0 years)</span></div>`
      )
    })

    it('renders 1 year when DOB is 1 year in the past', () => {
      const formattedDob = moment()
        .subtract(1, 'years')
        .format('MM/D/YYYY')
      const props = {
        dateOfBirth: moment()
          .subtract(1, 'years')
          .format('YYYY-MM-DD'),
      }
      const wrapper = shallow(<AgeInfo {...props} />)
      expect(wrapper.html()).toContain(
        `<div class="highlighted"><span>${formattedDob}</span><span> (1 year)</span></div>`
      )
    })
  })
})
