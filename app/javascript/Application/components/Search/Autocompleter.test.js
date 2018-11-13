import React from 'react'
import { shallow, mount } from 'enzyme'
import { BrowserRouter, Redirect } from 'react-router-dom'
import { shape } from 'prop-types'
import Autocompleter from './Autocompleter'
import Autocomplete from 'react-autocomplete'
import SuggestionHeader from '../common/search/SuggestionHeader'
import PersonSuggestion from '../common/search/PersonSuggestion'
import SearchPagination from '../common/search/SearchPagination'

describe('<Autocompleter />', () => {
  describe('page layout', () => {
    it('renders an <Autocomplete /> component', () => {
      const props = {
        id: 'client-search-autocompleter',
        debounce: () => {},
        onClear: () => {},
        results: [],
        totalResults: 0,
        totalPages: 0,
      }
      const wrapper = shallow(<Autocompleter {...props} />)

      expect(wrapper.find(Autocomplete).exists()).toBe(true)
    })
  })

  describe('<Autocomplete /> component', () => {
    describe('when the searchTerm is searchable', () => {
      it('calls onChangeInput', () => {
        const props = {
          id: 'client-search-autocompleter',
          debounce: () => {},
          onClear: () => {},
          results: [],
          totalResults: 0,
          totalPages: 0,
        }
        const handleChangeSpy = jest.spyOn(Autocompleter.prototype, 'onChangeInput')

        const wrapper = mount(<Autocompleter {...props} />)

        const autocompleteInput = wrapper.find(Autocomplete).find('#client-search-autocompleter')
        autocompleteInput.instance().value = 'annie'
        autocompleteInput.simulate('change')

        expect(handleChangeSpy).toHaveBeenCalledTimes(1)
      })

      it('calls debouncer', () => {
        const spy = jest.fn()
        const props = {
          id: 'client-search-autocompleter',
          debounce: spy,
          onClear: () => {},
          results: [],
          totalResults: 0,
          totalPages: 0,
        }
        const wrapper = mount(<Autocompleter {...props} />)

        const autocompleteInput = wrapper.find(Autocomplete).find('#client-search-autocompleter')
        autocompleteInput.instance().value = 'annie'
        autocompleteInput.simulate('change')

        expect(spy).toHaveBeenCalledTimes(1)
      })

      it('does not call onClear', () => {
        const spy = jest.fn()
        const props = {
          id: 'client-search-autocompleter',
          debounce: () => {},
          onClear: spy,
          results: [],
          totalResults: 0,
          totalPages: 0,
        }
        const wrapper = mount(<Autocompleter {...props} />)
        const autocompleteInput = wrapper.find(Autocomplete).find('#client-search-autocompleter')
        autocompleteInput.instance().value = 'annie'
        autocompleteInput.simulate('change')

        expect(spy).toHaveBeenCalledTimes(0)
      })

      describe('when there are client results', () => {
        const props = {
          id: 'client-search-autocompleter',
          debounce: () => {},
          onClear: () => {},
          results: [
            {
              gender: 'female',
              races: [],
              isSealed: false,
              isSensitive: false,
              legacy_id: '9GE4pyI0N3',
              clientCounties: ['Lake'],
              address: {
                city: 'Sacramento',
                state: 'CA',
                zip: null,
                streetAddress: ' 2nd street',
                type: 'Placement Home',
              },
              phoneNumber: null,
              legacyDescriptor: {
                legacy_last_updated: '2018-07-24T15:08:37.948-0700',
                legacy_id: '9GE4pyI0N3',
                legacy_ui_id: '0526-0682-6736-6001429',
                legacy_table_name: 'CLIENT_T',
                legacy_table_description: 'Client',
              },
              isCsec: false,
              dateOfBirth: '2000-10-11',
              fullName: 'Fronek, <em>Annie</em>',
              languages: ['English'],
              isProbationYouth: false,
              sort: [125.47486, 'person-summary#9GE4pyI0N3'],
              isDeceased: false,
            },
          ],
          totalResults: 0,
          totalPages: 0,
        }

        it('renders a <SuggestionHeader /> on focus', () => {
          const wrapper = mount(<Autocompleter {...props} />)
          wrapper.setState({ searchTerm: 'annie' })
          wrapper
            .find(Autocomplete)
            .find('#client-search-autocompleter')
            .simulate('focus')

          expect(wrapper.find(SuggestionHeader).exists()).toBe(true)
        })

        it('renders a <PersonSuggestion /> on focus', () => {
          const wrapper = mount(<Autocompleter {...props} />)
          wrapper.setState({ searchTerm: 'annie' })
          wrapper
            .find(Autocomplete)
            .find('#client-search-autocompleter')
            .simulate('focus')

          expect(wrapper.find(PersonSuggestion).exists()).toBe(true)
        })

        it('renders a <SearchPagination /> on focus', () => {
          const wrapper = mount(<Autocompleter {...props} />)
          wrapper.setState({ searchTerm: 'annie' })
          wrapper
            .find(Autocomplete)
            .find('#client-search-autocompleter')
            .simulate('focus')

          expect(wrapper.find(SearchPagination).exists()).toBe(true)
        })
      })

      describe('when there are no client results', () => {
        const props = {
          id: 'client-search-autocompleter',
          debounce: () => {},
          onClear: () => {},
          results: [],
          totalResults: 0,
          totalPages: 0,
        }

        it('renders a <SuggestionHeader /> on focus', () => {
          const wrapper = mount(<Autocompleter {...props} />)
          wrapper.setState({ searchTerm: 'annie' })
          wrapper
            .find(Autocomplete)
            .find('#client-search-autocompleter')
            .simulate('focus')

          expect(wrapper.find(SuggestionHeader).exists()).toBe(true)
        })

        it('does not render a <PersonSuggestion /> on focus', () => {
          const wrapper = mount(<Autocompleter {...props} />)
          wrapper.setState({ searchTerm: 'annie' })
          wrapper
            .find(Autocomplete)
            .find('#client-search-autocompleter')
            .simulate('focus')

          expect(wrapper.find(PersonSuggestion).exists()).toBe(false)
        })

        it('renders a <SearchPagination /> on focus', () => {
          const wrapper = mount(<Autocompleter {...props} />)
          wrapper.setState({ searchTerm: 'annie' })
          wrapper
            .find(Autocomplete)
            .find('#client-search-autocompleter')
            .simulate('focus')

          expect(wrapper.find(SearchPagination).exists()).toBe(true)
        })
      })
    })

    describe('when the searchTerm is not searchable', () => {
      it('calls onChangeInput', () => {
        const props = {
          id: 'client-search-autocompleter',
          debounce: () => {},
          onClear: () => {},
          results: [],
          totalResults: 0,
          totalPages: 0,
        }
        const handleChangeSpy = jest.spyOn(Autocompleter.prototype, 'onChangeInput')
        const wrapper = mount(<Autocompleter {...props} />)
        const autocompleteInput = wrapper.find(Autocomplete).find('#client-search-autocompleter')
        autocompleteInput.instance().value = 'a'
        autocompleteInput.simulate('change')

        expect(handleChangeSpy).toHaveBeenCalledTimes(1)
      })

      it('does not call debouncer', () => {
        const spy = jest.fn()
        const props = {
          id: 'client-search-autocompleter',
          debounce: spy,
          onClear: () => {},
          results: [],
          totalResults: 0,
          totalPages: 0,
        }
        const wrapper = mount(<Autocompleter {...props} />)
        const autocompleteInput = wrapper.find(Autocomplete).find('#client-search-autocompleter')
        autocompleteInput.instance().value = 'a'
        autocompleteInput.simulate('change')

        expect(spy).toHaveBeenCalledTimes(0)
      })

      it('calls onClear', () => {
        const spy = jest.fn()
        const props = {
          id: 'client-search-autocompleter',
          debounce: () => {},
          onClear: spy,
          results: [],
          totalResults: 0,
          totalPages: 0,
        }
        const wrapper = mount(<Autocompleter {...props} />)
        const autocompleteInput = wrapper.find(Autocomplete).find('#client-search-autocompleter')
        autocompleteInput.instance().value = 'a'
        autocompleteInput.simulate('change')

        expect(spy).toHaveBeenCalledTimes(1)
      })

      describe('when there are no client results', () => {
        const props = {
          id: 'client-search-autocompleter',
          debounce: () => {},
          onClear: () => {},
          results: [],
          totalResults: 0,
          totalPages: 0,
        }

        it('does not render a <SuggestionHeader /> on focus', () => {
          const wrapper = mount(<Autocompleter {...props} />)
          wrapper
            .find(Autocomplete)
            .find('#client-search-autocompleter')
            .simulate('focus')

          expect(wrapper.find(SuggestionHeader).exists()).toBe(false)
        })

        it('does not render a <PersonSuggestion /> on focus', () => {
          const wrapper = mount(<Autocompleter {...props} />)
          wrapper
            .find(Autocomplete)
            .find('#client-search-autocompleter')
            .simulate('focus')

          expect(wrapper.find(PersonSuggestion).exists()).toBe(false)
        })

        it('does not render a <SearchPagination /> on focus', () => {
          const wrapper = mount(<Autocompleter {...props} />)
          wrapper
            .find(Autocomplete)
            .find('#client-search-autocompleter')
            .simulate('focus')

          expect(wrapper.find(SearchPagination).exists()).toBe(false)
        })
      })
    })
  })

  it('should redirect when person suggestion is clicked', () => {
    const props = {
      id: 'client-search-autocompleter',
      debounce: () => {},
      onClear: () => {},
      results: [
        {
          gender: 'female',
          races: [],
          isSealed: false,
          isSensitive: false,
          legacy_id: '9GE4pyI0N3',
          clientCounties: ['Lake'],
          address: {
            city: 'Sacramento',
            state: 'CA',
            zip: null,
            streetAddress: ' 2nd street',
            type: 'Placement Home',
          },
          phoneNumber: null,
          legacyDescriptor: {
            legacy_last_updated: '2018-07-24T15:08:37.948-0700',
            legacy_id: '9GE4pyI0N3',
            legacy_ui_id: '0526-0682-6736-6001429',
            legacy_table_name: 'CLIENT_T',
            legacy_table_description: 'Client',
          },
          isCsec: false,
          dateOfBirth: '2000-10-11',
          fullName: 'Fronek, <em>Annie</em>',
          languages: ['English'],
          isProbationYouth: false,
          sort: [125.47486, 'person-summary#9GE4pyI0N3'],
          isDeceased: false,
        },
      ],
      totalResults: 0,
      totalPages: 0,
    }
    // Instantiate router context
    const router = {
      history: new BrowserRouter().history,
      route: {
        location: {},
        match: {},
      },
    }
    const wrapper = mount(<Autocompleter {...props} />, {
      context: { router },
      childContextTypes: { router: shape({}) },
    })
    wrapper.setState({ searchTerm: 'annie' })
    wrapper
      .find(Autocomplete)
      .find('#client-search-autocompleter')
      .simulate('focus')

    const personSuggestion = wrapper.find(PersonSuggestion)
    personSuggestion.simulate('click')

    expect(wrapper.find(Redirect).exists()).toBe(true)
  })
})
