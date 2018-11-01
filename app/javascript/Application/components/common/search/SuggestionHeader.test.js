import React from 'react'
import SuggestionHeader from './SuggestionHeader'
import { shallow } from 'enzyme'

describe('<SuggestionHeader />', () => {
  describe('init SuggestionHeader', () => {
    describe('page layout', () => {
      it('renders with 1 <div> element', () => {
        const wrapper = shallow(<SuggestionHeader />)
        expect(wrapper.find('div').length).toBe(1)
      })

      it('renders with 1 <strong> element', () => {
        const wrapper = shallow(<SuggestionHeader />)
        expect(wrapper.find('strong').length).toBe(1)
      })
    })
  })
})
