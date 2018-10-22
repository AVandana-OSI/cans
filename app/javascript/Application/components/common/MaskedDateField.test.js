import React from 'react'
import { mount } from 'enzyme'
import MaskedDateField from './MaskedDateField'
import { getCurrentIsoDate, isoToLocalDate } from '../../util/dateHelper'

describe('<MaskedDateField>', () => {
  describe('when future date allowed', () => {
    let value = null
    const getDateField = () =>
      mount(
        <MaskedDateField
          onChange={event => {
            value = event.target.value
          }}
        />
      )
    describe('when invalid date', () => {
      it('does not provide value on change', () => {
        const dateField = getDateField()
        dateField.find('input').simulate('change', { target: { value: '21/35/2017' } })
        expect(dateField.state('isValid')).toBe(false)
        expect(!value).toBe(true)
      })
    })

    describe('when valid date', () => {
      it('does provide valid iso date', () => {
        const dateField = getDateField()
        dateField.find('input').simulate('change', { target: { value: '12/31/5000' } })
        expect(!dateField.state('error')).toBe(true)
        expect(value).toBe('5000-12-31')
      })
    })
  })

  describe('when future date not allowed', () => {
    let value = null
    const getDateField = () =>
      mount(
        <MaskedDateField
          value={'5000-01-01'}
          onChange={event => {
            value = event.target.value
          }}
          isFutureDatesAllowed={false}
        />
      )
    describe('when input future date', () => {
      it('does not provide value on change', () => {
        const dateField = getDateField()
        dateField.find('input').simulate('change', { target: { value: '12/31/5000' } })
        expect(dateField.state('isValid')).toBe(false)
        expect(!value).toBe(true)
      })
    })

    describe('when input past or current date', () => {
      it('does provide valid iso date', () => {
        const dateField = getDateField()
        const input = dateField.find('input')
        input.simulate('change', { target: { value: '12/31/1971' } })
        expect(dateField.state('isValid')).toBe(true)
        expect(value).toBe('1971-12-31')

        const currentIsoDate = getCurrentIsoDate()
        input.simulate('change', { target: { value: isoToLocalDate(currentIsoDate) } })
        expect(value).toBe(currentIsoDate)
      })
    })
  })
})
