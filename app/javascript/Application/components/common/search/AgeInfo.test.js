import React from 'react'
import AgeInfo from './AgeInfo'
import { shallow } from 'enzyme'
import moment from 'moment'

describe('<AgeInfo />', () => {
  describe('page layout', () => {
    it('renders with 1 <div> element', () => {
      const props = { dateOfBirth: '1989-11-01' }
      const wrapper = shallow(<AgeInfo {...props} />)
      expect(wrapper.find('div.date-of-birth').length).toBe(1)
    })

    it('renders with 2 <span> elements', () => {
      const props = { dateOfBirth: '1989-11-01' }
      const wrapper = shallow(<AgeInfo {...props} />)
      expect(wrapper.find('span').length).toBe(2)
    })
  })

  describe('age info', () => {
    it('renders info when DOB is present', () => {
      const props = { dateOfBirth: '1989-11-01' }
      const wrapper = shallow(<AgeInfo {...props} />)
      expect(wrapper.html()).toContain(
        '<div class="highlighted date-of-birth"><span>11/1/1989</span><span><strong> (29 years)</strong></span></div>'
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
        `<div class="highlighted date-of-birth"><span>${formattedDob}</span><span><strong> (0 years)</strong></span></div>`
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
        `<div class="highlighted date-of-birth"><span>${formattedDob}</span><span><strong> (1 year)</strong></span></div>`
      )
    })

    describe('when dob field is the matched phrase', () => {
      it('renders date of birth in bold text', () => {
        const props = { dateOfBirth: '<em>1997-12-11</em>' }
        const wrapper = shallow(<AgeInfo {...props} />)
        expect(wrapper.find('strong.client-search-matched-field').html()).toBe(
          '<strong class="client-search-matched-field">12/11/1997</strong>'
        )
      })
    })
  })
})
