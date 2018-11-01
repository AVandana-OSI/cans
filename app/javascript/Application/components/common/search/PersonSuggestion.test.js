import React from 'react'
import { shallow } from 'enzyme'
import PersonSuggestion from './PersonSuggestion'
import AvatarImg from '../../../../../assets/images/default-profile.svg'
import AddressInfo from './AddressInfo'
import AgeInfo from './AgeInfo'
import GenderRaceAndEthnicity from './GenderRaceAndEthnicity'
import Languages from './LanguageInfo'
import PhoneNumberInfo from './PhoneNumberInfo'

describe('<PersonSuggestion />', () => {
  describe('init PersonSuggestion', () => {
    describe('page layout', () => {
      it('renders with 1 <AvatarImg /> icon', () => {
        const wrapper = shallow(<PersonSuggestion />)
        expect(wrapper.find(AvatarImg).length).toBe(1)
      })

      it('renders with a <AddressInfo /> component', () => {
        const wrapper = shallow(<PersonSuggestion />)
        expect(wrapper.find(AddressInfo).exists()).toBe(true)
      })

      it('renders with a <AgeInfo /> component', () => {
        const wrapper = shallow(<PersonSuggestion />)
        expect(wrapper.find(AgeInfo).exists()).toBe(true)
      })

      it('renders with a <GenderRaceAndEthnicity /> component', () => {
        const wrapper = shallow(<PersonSuggestion />)
        expect(wrapper.find(GenderRaceAndEthnicity).exists()).toBe(true)
      })

      it('renders with a <Languages /> component', () => {
        const wrapper = shallow(<PersonSuggestion />)
        expect(wrapper.find(Languages).exists()).toBe(true)
      })

      it('renders with a <PhoneNumberInfo /> component', () => {
        const wrapper = shallow(<PersonSuggestion />)
        expect(wrapper.find(PhoneNumberInfo).exists()).toBe(true)
      })
    })
  })
})
