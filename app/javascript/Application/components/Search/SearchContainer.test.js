import React from 'react'
import { SearchContainer } from './index'
import { shallow } from 'enzyme'
import SearchAssessmentHistory from './SearchAssessmentHistory'

describe('<SearchContainer />', () => {
  describe('init SearchContainer', () => {
    describe('page layout', () => {
      const getLength = (wrapper, component) => wrapper.find(component).length

      it('renders with 1 <SearchAssessmentHistory /> component', () => {
        const wrapper = shallow(<SearchContainer />)
        expect(getLength(wrapper, SearchAssessmentHistory)).toBe(1)
      })
    })
  })
})
