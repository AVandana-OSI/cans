import React from 'react'
import { shallow } from 'enzyme'
import LanguageInfo from './LanguageInfo'

describe('<LanguageInfo />', () => {
  describe('init LanguageInfo', () => {
    describe('page layout', () => {
      it('renders with 1 <div> element', () => {
        const wrapper = shallow(<LanguageInfo />)
        expect(wrapper.find('div').length).toBe(1)
      })

      it('renders with 1 <strong> element', () => {
        const wrapper = shallow(<LanguageInfo />)
        expect(wrapper.find('strong').length).toBe(1)
      })

      it('renders with 1 <span> element', () => {
        const wrapper = shallow(<LanguageInfo />)
        expect(wrapper.find('span').length).toBe(1)
      })
    })
  })
})
