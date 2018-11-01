import React from 'react'
import { shallow } from 'enzyme'
import GenderRaceAndEthnicity from './GenderRaceAndEthnicity'

describe('<GenderRaceAndEthnicity />', () => {
  describe('init GenderRaceAndEthnicity', () => {
    describe('page layout', () => {
      it('renders with 1 <div> element', () => {
        const wrapper = shallow(<GenderRaceAndEthnicity />)
        expect(wrapper.find('div').length).toBe(1)
      })
    })
  })
})
