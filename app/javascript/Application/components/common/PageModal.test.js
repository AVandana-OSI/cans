import React from 'react'
import PageModal from './PageModal'
import { shallow } from 'enzyme'

describe('<PageModal />', () => {
  const defaultProps = {
    removeButtonLabel: 'Remove',
    onCancel: () => {},
    onRemove: () => {},
    description: 'some description',
    title: 'Warning',
    warningDescription: 'warning description',
    cancelButtonLabel: 'Cancel',
  }

  describe('PageModal presence trigger', () => {
    const props = { ...defaultProps }
    it('It renders the PageModal', () => {
      const wrapper = shallow(<PageModal {...props} />)
      expect(wrapper.length).toBe(1)
    })

    it('renders modal when open falg is true', () => {
      const props = { ...defaultProps, isOpen: true }
      const wrapper = shallow(<PageModal {...props} />)
      wrapper.update()
      expect(wrapper.find('.warning-modal-body').exists()).toEqual(true)
    })

    it('does not renders modal when open falg is false', () => {
      const props = { ...defaultProps, isOpen: false }
      const wrapper = shallow(<PageModal {...props} />)
      wrapper.update()
      expect(
        wrapper
          .dive()
          .find('.warning-modal-body')
          .exists()
      ).toEqual(false)
    })
  })

  describe('PageModal content', () => {
    it('verify PageModal title', () => {
      const props = { ...defaultProps, title: 'Heading' }
      const wrapper = shallow(<PageModal {...props} />)
      wrapper.update()
      expect(wrapper.find('.warning-modal-heading').props().children).toEqual('Heading')
    })

    it('verify PageModal Description', () => {
      const props = { ...defaultProps, description: 'this is a fake warning' }
      const wrapper = shallow(<PageModal {...props} />)
      wrapper.update()
      expect(
        wrapper
          .dive()
          .find('.warning-modal-body')
          .html()
      ).toContain('this is a fake warning')
    })

    it('verify PageModal warning description', () => {
      const props = { ...defaultProps, warningDescription: 'this is a fake description' }
      const wrapper = shallow(<PageModal {...props} />)
      wrapper.update()
      expect(
        wrapper
          .dive()
          .find('.warning-modal-body')
          .html()
      ).toContain('this is a fake description')
    })
  })

  describe('PageModal Labels', () => {
    it('verify cancel button label', () => {
      const props = { ...defaultProps, cancelButtonLabel: 'Cancel' }
      const wrapper = shallow(<PageModal {...props} />)
      const CancelButtonLabel = wrapper.find('.warning-modal-logout').props().children
      expect(CancelButtonLabel).toEqual('Cancel')
      expect(CancelButtonLabel.length).toBe(6)
    })

    it('verify remove button label', () => {
      const props = { ...defaultProps, removeButtonLabel: 'Remove' }
      const wrapper = shallow(<PageModal {...props} />)
      const RemoveButtonLabel = wrapper.find('.warning-modal-stay-logged-in').props().children
      expect(RemoveButtonLabel).toEqual('Remove')
      expect(RemoveButtonLabel.length).toBe(6)
    })
  })

  describe('PageModal buttons', () => {
    it('verify cancel button render', () => {
      const wrapper = shallow(<PageModal {...defaultProps} />)
      const onCancel = wrapper.find('.warning-modal-logout')
      expect(onCancel.length).toBe(1)
    })

    it('verify remove button render', () => {
      const wrapper = shallow(<PageModal {...defaultProps} />)
      const onRemove = wrapper.find('.warning-modal-stay-logged-in')
      expect(onRemove.length).toBe(1)
    })
  })
})
