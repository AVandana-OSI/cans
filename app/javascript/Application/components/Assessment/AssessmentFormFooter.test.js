import React from 'react'
import AssessmentFormFooter from './AssessmentFormFooter'
import { shallow } from 'enzyme'

describe('AssessmentFormFooter', () => {
  const render = ({
    isSaveButtonEnabled = true,
    isSubmitButtonEnabled = true,
    isUnderSix = true,
    onCancelClick = jest.fn(),
    onSaveAssessment = jest.fn(),
    onSubmitAssessment = jest.fn(),
  }) =>
    shallow(
      <AssessmentFormFooter
        isSaveButtonEnabled={isSaveButtonEnabled}
        isSubmitButtonEnabled={isSubmitButtonEnabled}
        isUnderSix={isUnderSix}
        onCancelClick={onCancelClick}
        onSaveAssessment={onSaveAssessment}
        onSubmitAssessment={onSubmitAssessment}
      />
    )

  it('renders nothing if age group is not selected', () => {
    const footer = render({ isUnderSix: null })
    expect(footer.type()).toBe(null)
  })

  it('renders something if isUnderSix is false', () => {
    const footer = render({ isUnderSix: false })
    expect(footer.type()).not.toBe(null)
  })

  describe('cancel button', () => {
    it('invokes a callback', () => {
      const mockFn = jest.fn()
      const footer = render({ onCancelClick: mockFn })
      footer.find('Button#cancel-assessment').simulate('click')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('save button', () => {
    it('can invoke a callback when enabled', () => {
      const mockFn = jest.fn()
      const footer = render({ onSaveAssessment: mockFn })
      const saveButton = footer.find('Button#save-assessment')
      expect(saveButton.props().disabled).toBe(false)
      saveButton.simulate('click')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('can be disabled', () => {
      const footer = render({ isSaveButtonEnabled: false })
      expect(footer.find('Button#save-assessment').props().disabled).toBe(true)
    })
  })

  describe('submit button', () => {
    it('can invoke a callback when enabled', () => {
      const mockFn = jest.fn()
      const footer = render({ onSubmitAssessment: mockFn })
      const submitButton = footer.find('Button#submit-assessment')
      expect(submitButton.props().disabled).toBe(false)
      submitButton.simulate('click')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('can be disabled', () => {
      const footer = render({ isSubmitButtonEnabled: false })
      expect(footer.find('Button#submit-assessment').props().disabled).toBe(true)
    })
  })
})
