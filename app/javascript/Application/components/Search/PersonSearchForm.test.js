import React from 'react'
import { PersonSearchForm } from './index'
import { shallow } from 'enzyme'
import { Card, CardHeader, CardBody } from '@cwds/components/lib/Cards'
import CardTitle from '@cwds/components/lib/Cards/CardTitle'
import Autocompleter from '../common/search/Autocompleter'

describe('<PersonSearchForm />', () => {
  describe('init PersonSearchForm', () => {
    describe('page layout', () => {
      const SEARCH_TITLE = 'Search Clients Only'
      const SEARCH_PROMPT = 'Search CWS-CMS for clients only'

      it('renders with a <Card /> component', () => {
        const wrapper = shallow(<PersonSearchForm searchTitle={SEARCH_TITLE} searchPrompt={SEARCH_PROMPT} />)
        expect(wrapper.find(Card).exists()).toBe(true)
      })

      it('renders with a <CardHeader /> component', () => {
        const wrapper = shallow(<PersonSearchForm searchTitle={SEARCH_TITLE} searchPrompt={SEARCH_PROMPT} />)
        expect(wrapper.find(CardHeader).exists()).toBe(true)
      })

      it('renders with a <CardTitle /> component', () => {
        const wrapper = shallow(<PersonSearchForm searchTitle={SEARCH_TITLE} searchPrompt={SEARCH_PROMPT} />)
        expect(wrapper.find(CardTitle).exists()).toBe(true)
      })

      it('renders with a <CardBody /> component', () => {
        const wrapper = shallow(<PersonSearchForm searchTitle={SEARCH_TITLE} searchPrompt={SEARCH_PROMPT} />)
        expect(wrapper.find(CardBody).exists()).toBe(true)
      })

      it('renders with 1 <label> element', () => {
        const wrapper = shallow(<PersonSearchForm searchTitle={SEARCH_TITLE} searchPrompt={SEARCH_PROMPT} />)
        expect(wrapper.find('label').length).toBe(1)
      })

      it('renders with 1 <Autocompleter /> component', () => {
        const wrapper = shallow(<PersonSearchForm searchTitle={SEARCH_TITLE} searchPrompt={SEARCH_PROMPT} />)
        expect(wrapper.find(Autocompleter).exists()).toBe(true)
      })
    })
  })
})
