import React from 'react'
import { shallow } from 'enzyme'
import PersonSuggestion from './PersonSuggestion'
import AvatarImg from '../../../../../assets/images/default-profile.svg'
import FullName from './FullName'
import AddressInfo from './AddressInfo'
import AgeInfo from './AgeInfo'
import Gender from './Gender'

describe('<PersonSuggestion />', () => {
  describe('page layout', () => {
    const props = {
      fullName: 'Reap, Casey Aaron',
      dateOfBirth: '<em>1987-11-21</em>',
      gender: 'male',
      address: {
        city: 'Quincy',
        state: 'CA',
        zip: '95671',
        streetAddress: '5462 Delladonna Avenue',
        type: 'Home',
      },
      languages: ['English', 'American Sign Language'],
      isSensitive: false,
      isSealed: false,
      legacyDescriptor: {
        legacy_last_updated: '2018-07-24T15:08:37.948-0700',
        legacy_id: '0r37QVX0Bv',
        legacy_ui_id: '0048-6011-3929-9000739',
        legacy_table_name: 'CLIENT_T',
        legacy_table_description: 'Client',
      },
      clientCounties: ['Plumas'],
    }
    it('renders an <AvatarImg /> icon', () => {
      const wrapper = shallow(<PersonSuggestion {...props} />)
      expect(wrapper.find('.avatar-img').length).toBe(1)
      expect(wrapper.find('.avatar-img').props().src).toBe(AvatarImg)
    })

    it('renders a <FullName /> component', () => {
      const wrapper = shallow(<PersonSuggestion {...props} />)
      expect(wrapper.find(FullName).exists()).toBe(true)
    })

    it('renders an <AddressInfo /> component', () => {
      const wrapper = shallow(<PersonSuggestion {...props} />)
      expect(wrapper.find(AddressInfo).exists()).toBe(true)
    })

    it('renders an <AgeInfo /> component', () => {
      const wrapper = shallow(<PersonSuggestion {...props} />)
      expect(wrapper.find(AgeInfo).exists()).toBe(true)
    })

    it('renders a <Gender /> component', () => {
      const wrapper = shallow(<PersonSuggestion {...props} />)
      expect(wrapper.find(Gender).exists()).toBe(true)
    })
  })

  describe('information flags', () => {
    describe('sensitive flag', () => {
      it('renders a sensitive flag', () => {
        const props = {
          fullName: 'Reap, Casey Aaron',
          dateOfBirth: '<em>1987-11-21</em>',
          clientCounties: ['Yolo'],
          isSensitive: true,
          isSealed: false,
        }
        const wrapper = shallow(<PersonSuggestion {...props} />)
        expect(wrapper.find('div.information-flag.image-caption').html()).toBe(
          '<div class="information-flag image-caption">Sensitive</div>'
        )
      })

      it('does not render a sensitive flag', () => {
        const props = {
          fullName: 'Reap, Casey Aaron',
          dateOfBirth: '<em>1987-11-21</em>',
          clientCounties: ['Yolo'],
          isSensitive: false,
          isSealed: false,
        }
        const wrapper = shallow(<PersonSuggestion {...props} />)
        expect(wrapper.find('div.information-flag.image-caption').exists()).toBe(false)
      })
    })

    describe('sealed flag', () => {
      it('renders a sealed flag', () => {
        const props = {
          fullName: 'Reap, Casey Aaron',
          dateOfBirth: '<em>1987-11-21</em>',
          clientCounties: ['Yolo'],
          isSensitive: false,
          isSealed: true,
        }
        const wrapper = shallow(<PersonSuggestion {...props} />)
        expect(wrapper.find('div.information-flag.image-caption').html()).toBe(
          '<div class="information-flag image-caption">Sealed</div>'
        )
      })

      it('does not render a sealed flag', () => {
        const props = {
          fullName: 'Reap, Casey Aaron',
          dateOfBirth: '<em>1987-11-21</em>',
          clientCounties: ['Yolo'],
          isSensitive: false,
          isSealed: false,
        }
        const wrapper = shallow(<PersonSuggestion {...props} />)
        expect(wrapper.find('div.information-flag.image-caption').exists()).toBe(false)
      })
    })
  })
})
