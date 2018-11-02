import { Maybe } from 'utils/maybe'

// Helper Functions - These are just a couple helper functions to test with
// Number -> Number
const add1 = x => x + 1
// Number -> Maybe(Number)
const sqrt = x => Maybe.of(x < 0 ? null : Math.sqrt(x))

describe('Maybe', () => {
  describe('isSomething and isNothing', () => {
    it('isSomething when it holds a value', () => {
      expect(Maybe.of(10).isSomething()).toEqual(true)
      expect(Maybe.of('Hello').isSomething()).toEqual(true)
      expect(Maybe.of([1, 2, 3]).isSomething()).toEqual(true)
    })

    it('is not Nothing when it holds a value', () => {
      expect(Maybe.of(10).isNothing()).toEqual(false)
      expect(Maybe.of('Hello').isNothing()).toEqual(false)
      expect(Maybe.of([1, 2, 3]).isNothing()).toEqual(false)
    })

    /*
      Maybes can hold falsey values as well. A Maybe should only be Nothing if
      it truly contains "nothing". Consider a function that adds 1 to a client's
      age, if the client has an age). We would expect:
        10 => 11
        null => null
        0 => 1
      Without `Maybe.of(0).isSomething() === true` this would be impossible.
    */
    it('isSomething even when its value is falsey', () => {
      expect(Maybe.of(false).isSomething()).toEqual(true)
      expect(Maybe.of(0).isSomething()).toEqual(true)
      expect(Maybe.of(false).isNothing()).toEqual(false)
      expect(Maybe.of(0).isNothing()).toEqual(false)
    })

    it('isNothing when it holds null or undefined', () => {
      expect(Maybe.of(null).isNothing()).toEqual(true)
      expect(Maybe.of(null).isSomething()).toEqual(false)
      expect(Maybe.of(undefined).isNothing()).toEqual(true)
      expect(Maybe.of(undefined).isSomething()).toEqual(false)
    })
  })

  describe('map', () => {
    it('transforms the contained value', () => {
      expect(
        Maybe.of(10)
          .map(add1)
          .map(add1)._value
      ).toEqual(12)
    })

    it('returns a new Maybe without mutating the original value', () => {
      const maybe = Maybe.of(10)

      maybe.map(add1).map(add1)
      expect(maybe._value).toEqual(10)
    })

    it('preserves nothings when mapped', () => {
      expect(
        Maybe.of(null)
          .map(add1)
          .map(add1)
          .isNothing()
      ).toEqual(true)
    })
  })

  describe('valueOrElse', () => {
    it('provides the underlying value', () => {
      expect(Maybe.of('Hello').valueOrElse()).toEqual('Hello')
      expect(
        Maybe.of(10)
          .map(add1)
          .valueOrElse(0)
      ).toEqual(11)
    })

    it('provides the default value when isNothing', () => {
      expect(Maybe.of(null).valueOrElse('Hello')).toEqual('Hello')
      expect(
        Maybe.of(undefined)
          .map(add1)
          .map(add1)
          .valueOrElse(0)
      ).toEqual(0)
    })
  })

  describe('join', () => {
    it('flattens nested Maybes', () => {
      const nested = Maybe.of(Maybe.of(10))
      expect(nested.valueOrElse()).not.toEqual(10)
      expect(nested.join()._value).toEqual(10)
    })

    it('preserves Nothings when joining', () => {
      const nested = Maybe.of(null)
      expect(nested.join().isNothing()).toEqual(true)
    })

    it('only flattens a single level at a time', () => {
      const nested = Maybe.of(Maybe.of(Maybe.of('Hello')))

      expect(nested.join().join()._value).toEqual('Hello')
    })
  })

  describe('chain', () => {
    it('maps and joins', () => {
      expect(Maybe.of(9).chain(sqrt)._value).toEqual(3)
      expect(
        Maybe.of(null)
          .chain(sqrt)
          .isNothing()
      ).toEqual(true)
      expect(
        Maybe.of(-1)
          .chain(sqrt)
          .isNothing()
      ).toEqual(true)
    })
  })

  describe('filter', () => {
    const isPositive = x => x > 0
    const isEven = x => x % 2 === 0

    it('removes values if the predicate is false', () => {
      const maybe = Maybe.of(-10)
      expect(maybe.isSomething()).toEqual(true)
      expect(maybe.filter(isPositive).isNothing()).toEqual(true)
    })

    it('preserves values if the predicate is true', () => {
      expect(
        Maybe.of(10)
          .filter(isPositive)
          .isSomething()
      ).toEqual(true)
    })

    it('filters Nothings into Nothings', () => {
      expect(
        Maybe.of(null)
          .filter(() => true)
          .isNothing()
      ).toEqual(true)
    })

    it('satisfies distributivity', () => {
      expect(
        Maybe.of(10).filter(x => isPositive(x) && isEven(x))._value
      ).toEqual(
        Maybe.of(10)
          .filter(isPositive)
          .filter(isEven)._value
      )
    })
  })
})
