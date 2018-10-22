import { validate, validateCase, validateCaseNumbersAreUnique, isFormValid } from './ClientFormValidator'

describe('ClientFormValidator', () => {
  describe('#validate()', () => {
    it('first_name', () => {
      expect(validate('first_name', '')).toBe(false)
      expect(validate('first_name', 'Mike')).toBe(true)
    })

    it('last_name', () => {
      expect(validate('first_name', '')).toBe(false)
      expect(validate('first_name', 'Mike')).toBe(true)
    })

    it('middle_name', () => {
      expect(validate('middle_name', '')).toBe(true)
      expect(validate('middle_name', 'Mike')).toBe(true)
    })

    it('suffix', () => {
      expect(validate('suffix', '')).toBe(true)
      expect(validate('suffix', 'Mr')).toBe(true)
    })

    it('external_id', () => {
      expect(validate('external_id', '1234567891234567890')).toBe(true)
      expect(validate('external_id', '1234-5678-9123-4567890')).toBe(true)
      expect(validate('external_id', '12345678912345678900')).toBe(false)
      expect(validate('external_id', '123456789')).toBe(false)
      expect(validate('external_id', '1234--5678-9123-4567890')).toBe(false)
      expect(validate('external_id', '76cv39d6')).toBe(false)
      expect(validate('external_id', 'vgh7321 ')).toBe(false)
      expect(validate('external_id', '#34la7sd')).toBe(false)
      expect(validate('external_id', '   ')).toBe(false)
    })

    it('dob', () => {
      expect(validate('dob', '2012/10/12')).toBe(true)
      expect(validate('dob', null)).toBe(false)
      expect(validate('dob', undefined)).toBe(false)
      expect(validate('dob', '')).toBe(false)
    })

    it('county', () => {
      expect(validate('county', { id: '1' })).toBe(true)
      expect(validate('county', {})).toBe(false)
      expect(validate('county', null)).toBe(false)
      expect(validate('county', undefined)).toBe(false)
      expect(validate('county', '')).toBe(false)
    })

    it('unknown field name', () => {
      expect(validate('unknownFieldName', { id: '1' })).toBe(false)
      expect(validate('unknownFieldName', {})).toBe(false)
      expect(validate('unknownFieldName', null)).toBe(false)
      expect(validate('unknownFieldName', undefined)).toBe(false)
      expect(validate('unknownFieldName', '')).toBe(false)
      expect(validate('unknownFieldName', 'string')).toBe(false)
    })
  })

  describe('#validateCase()', () => {
    describe('when new case', () => {
      it('should return true for empty cases', () => {
        expect(validateCase({ external_id: undefined })).toBeTruthy()
        expect(validateCase({ external_id: null })).toBeTruthy()
        expect(validateCase({ external_id: '' })).toBeTruthy()
      })

      it('should return true for valid case numbers', () => {
        expect(validateCase({ external_id: '4321-321-4321-87654321' })).toBeTruthy()
        expect(validateCase({ external_id: '1234-123-1234-12345678' })).toBeTruthy()
      })
    })

    describe('when existent case', () => {
      it('should return false for empty cases', () => {
        expect(validateCase({ id: 123, external_id: undefined })).toBeFalsy()
        expect(validateCase({ id: 123, external_id: null })).toBeFalsy()
        expect(validateCase({ id: 123, external_id: '' })).toBeFalsy()
      })

      it('should return false for invalid case numbers', () => {
        expect(validateCase({ id: 123, external_id: '/' })).toBeFalsy()
        expect(validateCase({ id: 123, external_id: 'a%' })).toBeFalsy()
        expect(
          validateCase({ id: 123, external_id: '123456789012345678901234567890123456789012345678901' })
        ).toBeFalsy()
      })

      it('should return true for valid case numbers', () => {
        expect(validateCase({ id: 123, external_id: '4321-321-4321-87654321' })).toBeTruthy()
        expect(validateCase({ id: 123, external_id: '1234-123-1234-12345678' })).toBeTruthy()
      })
    })
  })

  describe('#validateCaseNumbersAreUnique()', () => {
    it('should return empty array for a single case input', () => {
      expect(validateCaseNumbersAreUnique([])).toEqual([])
      expect(validateCaseNumbersAreUnique([{}])).toEqual([])
    })

    it('should return empty array for cases array with only unique ids', () => {
      expect(validateCaseNumbersAreUnique([{ external_id: '1' }, { external_id: '2' }])).toEqual([])
    })

    it('should return indices of non unique cases', () => {
      const cases = [
        { external_id: 'unique0' },
        { external_id: '1' },
        { external_id: '2' },
        { external_id: '2' },
        { external_id: 'unique1' },
        { external_id: '1' },
        { external_id: '2' },
        { external_id: 'unique2' },
      ]
      expect(validateCaseNumbersAreUnique(cases).sort()).toEqual([1, 2, 3, 5, 6])
    })
  })

  describe('#isFormValid()', () => {
    it('returns false when invalid', () => {
      expect(
        isFormValid({
          first_name: '',
          last_name: '',
          dob: '',
          external_id: '',
          county: '',
          cases: [],
        })
      ).toBe(false)
    })

    it('returns true when valid', () => {
      expect(
        isFormValid({
          first_name: 'Amber',
          middle_name: 'Marie',
          last_name: 'Jersey',
          suffix: 'Mrs.',
          dob: '10/12/2012',
          external_id: '1234567891234567890',
          county: { id: 1 },
          cases: [
            {
              external_id: '123',
            },
          ],
        })
      ).toBe(true)
    })
  })
})
