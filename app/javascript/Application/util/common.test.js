import { clone, isEmpty, stringify } from './common'

describe('common', () => {
  describe('#clone()', () => {
    it('copies the object fields values not the pointers ', () => {
      // given
      const original = {
        number: 123,
        obj: {
          a: 'b',
        },
        arr: [{ c: 'd' }],
      }

      // when
      const theClone = clone(original)
      original.number = 321
      original.obj.a = 'xyz'
      original.arr[0].c = 'xyz'

      // then
      expect(theClone).toEqual({
        number: 123,
        obj: {
          a: 'b',
        },
        arr: [{ c: 'd' }],
      })
    })
  })

  describe('#stringify()', () => {
    describe.each`
      value        | string
      ${1}         | ${'1'}
      ${true}      | ${'true'}
      ${undefined} | ${''}
      ${null}      | ${''}
      ${''}        | ${''}
      ${0}         | ${'0'}
      ${false}     | ${'false'}
    `('$value', ({ value, string }) => {
      test(`converts ${value} to a string`, () => {
        expect(stringify(value)).toBe(string)
      })
    })
  })

  describe('#isEmpty()', () => {
    it('should return true when input null', () => {
      expect(isEmpty(null)).toEqual(true)
    })

    it('should return true when input undefined', () => {
      expect(isEmpty(undefined)).toEqual(true)
    })

    it('should return true when input is empty String', () => {
      expect(isEmpty('')).toEqual(true)
    })

    it('should return false when input is valid String', () => {
      expect(isEmpty('2010-10-10')).toEqual(false)
    })
  })
})
