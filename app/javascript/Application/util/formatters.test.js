import { trimSafely, addTrailingSlash, formatPhoneWithExtCode, formatPhoneNumber } from './formatters'

describe('formatters', () => {
  describe('#trimSafely()', () => {
    it('returns original string if null', () => {
      expect(trimSafely('hello')).toEqual('hello')
    })

    it('returns empty string if null input', () => {
      expect(trimSafely(null)).toEqual('')
    })

    it('returns empty string if undefined input', () => {
      expect(trimSafely(undefined)).toEqual('')
    })

    it('returns empty string if empty string input', () => {
      expect(trimSafely('')).toEqual('')
    })
  })

  describe('#addTrailingSlash()', () => {
    it('should add trailing slash to string', () => {
      expect(addTrailingSlash('www.home.com')).toEqual('www.home.com/')
    })

    it('should return input string when it already has a trailing slash', () => {
      expect(addTrailingSlash('/')).toEqual('/')
      expect(addTrailingSlash('www.home.com/')).toEqual('www.home.com/')
      expect(addTrailingSlash('www.home.com///')).toEqual('www.home.com///')
    })

    it('should return slash for empty input string', () => {
      expect(addTrailingSlash(undefined)).toEqual('/')
      expect(addTrailingSlash(null)).toEqual('/')
      expect(addTrailingSlash('')).toEqual('/')
    })
  })

  describe('#formatPhoneNumber()', () => {
    it('should format 10 digits string as a phone number', () => {
      expect(formatPhoneNumber('9167654321')).toEqual('916-765-4321')
    })

    describe('when input is not 10 digit', () => {
      it('should return the input', () => {
        expect(formatPhoneNumber(null)).toEqual(null)
        expect(formatPhoneNumber('')).toEqual('')
        expect(formatPhoneNumber('123')).toEqual('123')
        expect(formatPhoneNumber('9167654321000')).toEqual('9167654321000')
      })
    })
  })

  describe('#formatPhoneWithExtCode()', () => {
    describe('when no number and no extension code', () => {
      it('should return empty string', () => {
        expect(formatPhoneWithExtCode('', '')).toEqual('')
      })
    })

    describe('when no extension code', () => {
      it('should return phone number only', () => {
        expect(formatPhoneWithExtCode('9167654321', '')).toEqual('916-765-4321')
      })
    })

    describe('when extension code only', () => {
      it('should return empty string', () => {
        expect(formatPhoneWithExtCode('', '1234')).toEqual('')
      })
    })

    describe('when number and extension code', () => {
      it('should return fully formatted phone number', () => {
        expect(formatPhoneWithExtCode('9167654321', '3333')).toEqual('916-765-4321 ext. 3333')
      })
    })
  })
})
