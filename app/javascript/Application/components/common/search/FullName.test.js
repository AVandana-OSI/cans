import React from 'react'
import { shallow } from 'enzyme'
import FullName from './FullName'

describe('<FullName />', () => {
  describe('page layout', () => {
    it('renders a full name div', () => {
      const props = {
        fullName: 'Livings, Anna',
      }
      const wrapper = shallow(<FullName {...props} />)
      expect(wrapper.find('div.full-name').exists()).toBe(true)
    })

    it('does not render a full name div', () => {
      const props = { fullName: null }
      const wrapper = shallow(<FullName {...props} />)
      expect(wrapper.find('div.full-name').exists()).toBe(false)
    })
  })

  describe('name info', () => {
    it('renders name info when it exists', () => {
      const props = { fullName: 'Livings, Anna' }
      const wrapper = shallow(<FullName {...props} />)
      expect(wrapper.find('div.full-name').html()).toBe('<div class="highlighted full-name">Livings, Anna</div>')
    })

    it('does not render name info when it exists', () => {})
  })

  describe('when the field has highlighted text', () => {
    it('renders bold text in the name field', () => {
      const props = {
        fullName: 'Livings, <em>Anna</em>',
      }
      const wrapper = shallow(<FullName {...props} />)
      expect(wrapper.find('.full-name').html()).toBe(
        '<div class="highlighted full-name">Livings, <strong>Anna</strong></div>'
      )
    })
  })
})
