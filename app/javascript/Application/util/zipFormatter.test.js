import { zipFormatter } from './zipFormatter'

describe('zipFormatter ', () => {
  it('should return an 12345 when zip 12345 is returned from search', () => {
    expect(zipFormatter('95833')).toEqual('95833')
  })

  it('should return an empty string when zip 0 is returned from search', () => {
    expect(zipFormatter('0')).toEqual('')
  })
})
