import { checkPropTypes } from 'prop-types'
import { staff } from './staff.mocks.test'
import { staffPropType } from './StaffHelper'

describe('StaffHelper', () => {
  describe('staffPropType', () => {
    const checkStaffPropType = staff => checkPropTypes({ staff: staffPropType }, { staff }, 'staff', 'MyComponent')

    it('returns no error for valid staff', () => {
      staff.forEach(person => {
        expect(checkStaffPropType(person)).toBeUndefined()
      })
    })

    it('returns an error if there is no staff_person', () => {
      const person = { ...staff[0], staff_person: null }
      expect(() => checkStaffPropType(person)).toThrow()
    })

    it('returns an error if there is no clients_count', () => {
      const person = { ...staff[0], clients_count: null }
      expect(() => checkStaffPropType(person)).toThrow()
    })

    it('returns an error if there is no no_prior_cans_count', () => {
      const person = { ...staff[0], no_prior_cans_count: null }
      expect(() => checkStaffPropType(person)).toThrow()
    })

    it('returns an error if there is no in_progress_count', () => {
      const person = { ...staff[0], in_progress_count: null }
      expect(() => checkStaffPropType(person)).toThrow()
    })

    it('returns an error if there is no completed_count', () => {
      const person = { ...staff[0], completed_count: null }
      expect(() => checkStaffPropType(person)).toThrow()
    })
  })
})
