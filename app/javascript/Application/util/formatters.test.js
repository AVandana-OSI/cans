import { trimSafely, addTrailingSlash } from './formatters'

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
})
