import React from 'react'
import SuggestionHeader from './SuggestionHeader'
import { shallow } from 'enzyme'

describe('<SuggestionHeader />', () => {
  describe('init SuggestionHeader', () => {
    describe('page layout', () => {
      it('renders with 1 <div> element', () => {
        const props = {
          currentNumberOfResults: 10,
          total: 10,
          searchTerm: 'casey',
        }
        const wrapper = shallow(<SuggestionHeader {...props} />)
        expect(wrapper.find('div').length).toBe(1)
      })

      it('renders with 1 <strong> element', () => {
        const props = {
          currentNumberOfResults: 10,
          total: 10,
          searchTerm: 'casey',
        }
        const wrapper = shallow(<SuggestionHeader {...props} />)
        expect(wrapper.find('strong').length).toBe(1)
      })
    })

    describe('renders text in the suggestion header', () => {
      it('renders the number of results', () => {
        const props = {
          currentNumberOfResults: 10,
          total: 10,
          searchTerm: 'casey',
        }
        const wrapper = shallow(<SuggestionHeader {...props} />)
        expect(wrapper.find('strong').text()).toEqual(`Showing 1-10 of 10 results for "casey"`)
      })

      it('renders no results when currentNumberOfResults is less than 1', () => {
        const props = {
          currentNumberOfResults: 0,
          total: 0,
          searchTerm: 'casey',
        }
        const wrapper = shallow(<SuggestionHeader {...props} />)
        expect(wrapper.find('strong').text()).toEqual(`No results were found for "casey"`)
      })

      it('renders null when the total is null', () => {
        const props = {
          currentNumberOfResults: 0,
          total: null,
          searchTerm: 'casey',
        }
        const wrapper = shallow(<SuggestionHeader {...props} />)
        expect(wrapper.find('div').exists()).toBe(false)
      })
    })
  })
})
