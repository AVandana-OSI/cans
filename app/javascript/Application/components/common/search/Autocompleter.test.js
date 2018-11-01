import React from 'react'
import { shallow } from 'enzyme'
import { Redirect } from 'react-router-dom'
import Autocompleter from './Autocompleter'
import Autocomplete from 'react-autocomplete'
import SuggestionHeader from './SuggestionHeader'
import PersonSuggestion from './PersonSuggestion'

describe('<Autocompleter />', () => {
  describe('init Autocompleter', () => {
    describe('page layout', () => {
      it('renders with 1 <Autocomplete /> component', () => {
        const wrapper = shallow(<Autocompleter />)
        expect(wrapper.find(Autocomplete).exists()).toBe(true)
      })

      it('renders with 1 <SuggestionHeader /> component', () => {
        const wrapper = shallow(<Autocompleter />)
        expect(wrapper.find(SuggestionHeader).exists()).toBe(true)
      })

      it('renders with 1 <PersonSuggestion /> component', () => {
        const wrapper = shallow(<Autocompleter />)
        expect(wrapper.find(PersonSuggestion).exists()).toBe(true)
      })

      it('renders with 1 <Redirect /> component', () => {
        const wrapper = shallow(<Autocompleter />)
        expect(wrapper.find(Redirect).exists()).toBe(true)
      })
    })
  })
})
