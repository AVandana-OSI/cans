import React from 'react'
import { shallow } from 'enzyme'
import LegacyInfo from './LegacyInfo'

describe('<LegacyInfo />', () => {
  describe('init LegacyInfo', () => {
    describe('page layout', () => {
      it('renders with 1 <div> element', () => {
        const props = {
          legacy_ui_id: '1111-2222-3333-7777777',
        }
        const wrapper = shallow(<LegacyInfo {...props} />)
        expect(wrapper.find('div').length).toBe(1)
      })
    })
  })

  describe('LegacyInfo', () => {
    it('renders the legacy ui id', () => {
      const props = {
        legacy_ui_id: '1111-2222-3333-7777777',
      }
      const wrapper = shallow(<LegacyInfo {...props} />)
      expect(wrapper.html()).toContain('<div>1111-2222-3333-7777777</div>')
    })

    it('it does NOT render the legacy ui id when none exists', () => {
      const props = {
        legacy_ui_id: null,
      }
      const wrapper = shallow(<LegacyInfo {...props} />)
      expect(wrapper.html()).toBe(null)
    })
  })
})
