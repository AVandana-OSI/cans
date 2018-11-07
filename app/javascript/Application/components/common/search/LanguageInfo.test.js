import React from 'react'
import { shallow } from 'enzyme'
import LanguageInfo from './LanguageInfo'

describe('<LanguageInfo />', () => {
  describe('init LanguageInfo', () => {
    describe('page layout', () => {
      it('renders with 1 <div> element', () => {
        const props = { languages: ['English'] }
        const wrapper = shallow(<LanguageInfo {...props} />)
        expect(wrapper.find('div').length).toBe(1)
      })

      it('renders with 1 <span> element', () => {
        const props = { languages: ['Spanish'] }
        const wrapper = shallow(<LanguageInfo {...props} />)
        expect(wrapper.find('span').length).toBe(1)
      })
    })
  })

  describe('Language Info', () => {
    it('renders one language when one or more exist', () => {
      const props = { languages: ['Russian', 'Spanish'] }
      const wrapper = shallow(<LanguageInfo {...props} />)
      expect(wrapper.html()).toContain('<div><span>Russian</span></div>')
    })

    it('does NOT render language info when languages is empty array', () => {
      const props = { languages: [] }
      const wrapper = shallow(<LanguageInfo {...props} />)
      expect(wrapper.html()).toBe(null)
    })
  })
})
