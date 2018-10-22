import { isA11yAllowedInput, isEnterKeyPressed } from './events'

describe('events', () => {
  describe('#isA11yAllowedInput()', () => {
    describe('when not a keypress type event', () => {
      it('returns true', () => {
        expect(isA11yAllowedInput({ type: 'click' })).toBeTruthy()
      })
    })

    describe('when a keypress type event', () => {
      describe('and Enter key', () => {
        it('returns true', () => {
          expect(isA11yAllowedInput({ type: 'keypress', key: 'Enter' })).toBeTruthy()
        })
      })

      describe('and not Enter key', () => {
        it('returns false', () => {
          expect(isA11yAllowedInput({ type: 'keypress', key: 'OtherKey' })).toBeFalsy()
        })
      })
    })
  })

  describe('#isEnterKeyPressed()', () => {
    describe('when not a keypress type event', () => {
      it('returns false', () => {
        expect(isEnterKeyPressed({ type: 'click' })).toBeFalsy()
      })
    })

    describe('when a keypress type event', () => {
      describe('and Enter key', () => {
        it('returns true', () => {
          expect(isEnterKeyPressed({ type: 'keypress', key: 'Enter' })).toBeTruthy()
        })
      })

      describe('and not Enter key', () => {
        it('returns false', () => {
          expect(isEnterKeyPressed({ type: 'keypress', key: 'OtherKey' })).toBeFalsy()
        })
      })
    })
  })
})
