import {
  isoToJsDate,
  isoToLocalDate,
  localToIsoDate,
  isValidIsoDate,
  jsDateToIso,
  isFutureDate,
  getCurrentIsoDate,
  isValidDate,
  isValidLocalDate,
  localToIsoDateOrNull,
} from './dateHelper'

describe('#isoToLocalDate()', () => {
  it('returns a formatted date', () => {
    expect(isoToLocalDate('2012-05-31')).toEqual('05/31/2012')
  })

  it('returns Invalid DateTime when input is null', () => {
    expect(isoToLocalDate(null)).toEqual(null)
  })

  it('returns Invalid Date when input is undefined', () => {
    expect(isoToLocalDate(undefined)).toEqual('Invalid date')
  })

  it('returns Invalid Date when input is invalid JS Date', () => {
    expect(isoToLocalDate('Wrong Date')).toEqual('Invalid date')
  })
})

describe('#localToIsolDate()', () => {
  it('returns a formatted date', () => {
    expect(localToIsoDate('05/31/2012')).toEqual('2012-05-31')
  })

  it('returns Invalid DateTime when input is null', () => {
    expect(localToIsoDate(null)).toEqual(null)
  })

  it('returns Invalid Date when input is undefined', () => {
    expect(localToIsoDate(undefined)).toEqual('Invalid date')
  })

  it('returns Invalid Date when input is invalid Date', () => {
    expect(localToIsoDate('13/45/2018')).toEqual('Invalid date')
  })
})

describe('#jsDateToIso()', () => {
  it('returns a formatted ISO date when input is valid JS Date', () => {
    expect(jsDateToIso(isoToJsDate('2010-06-30'))).toEqual('2010-06-30')
  })

  it('returns null when input is null', () => {
    expect(jsDateToIso(null)).toEqual(null)
  })

  it('returns Invalid DateTime when input is invalid JS Date', () => {
    expect(jsDateToIso('Wrong Date')).toEqual('Invalid date')
  })
})

describe('#isoToJsDate()', () => {
  it('returns a valid JS Date when input is valid ISO Date', () => {
    const result = isoToJsDate('1970-01-01')
    const expected = jsDateToIso(result)
    expect('1970-01-01').toEqual(expected)
  })

  it('returns null when input is null', () => {
    expect(isoToJsDate(null)).toEqual(null)
  })

  it('returns null when input is invalid JS Date', () => {
    expect(isoToJsDate('Wrong Date')).toEqual(null)
  })
})

describe('#isValidIsoDate()', () => {
  it('returns true is input is valid ISO date', () => {
    expect(isValidIsoDate('1970-01-01')).toEqual(true)
    expect(isValidIsoDate('1970-01')).toEqual(true)
  })

  it('returns false when input is invalid ISO date string', () => {
    expect(isValidIsoDate('wrong date')).toEqual(false)
    expect(isValidIsoDate(null)).toEqual(false)
    expect(isValidIsoDate(undefined)).toEqual(false)
    expect(isValidIsoDate('2018-13-45')).toEqual(false)
  })

  describe('when strict flag for Iso date', () => {
    describe('when partial date', () => {
      it('returns false', () => {
        expect(isValidIsoDate('1970-01', true)).toEqual(false)
      })
    })

    describe('when complete valid date', () => {
      it('returns true', () => {
        expect(isValidIsoDate('1970-01-01', true)).toEqual(true)
      })
    })
  })
})

describe('#isValidLocalDate()', () => {
  it('returns true is input is valid Local date', () => {
    expect(isValidLocalDate('01/01/1970')).toEqual(true)
    expect(isValidLocalDate('01/01/')).toEqual(true)
  })

  it('returns false when input is invalid Local date string', () => {
    expect(isValidLocalDate('wrong date')).toEqual(false)
    expect(isValidLocalDate(null)).toEqual(false)
    expect(isValidLocalDate(undefined)).toEqual(false)
    expect(isValidLocalDate('13/45/2018')).toEqual(false)
  })

  describe('when strict flag for Local date', () => {
    describe('when partial Local date', () => {
      it('returns false', () => {
        expect(isValidLocalDate('12/31/', true)).toEqual(false)
      })
    })

    describe('when complete valid Local date', () => {
      it('returns false', () => {
        expect(isValidLocalDate('12/31/2000', true)).toEqual(true)
      })
    })
  })
})

describe('#isFutureDate()', () => {
  it('returns true if date is in the future', () => {
    expect(isFutureDate('5000-01-01')).toEqual(true)
    expect(isFutureDate('01/01/5000')).toEqual(true)
  })

  it('returns false if date is in the past', () => {
    expect(isFutureDate('1971-01-01')).toEqual(false)
  })

  it('returns false if date is a current date', () => {
    expect(isFutureDate(getCurrentIsoDate())).toEqual(false)
  })
})

describe('#isValidDate()', () => {
  it('returns false if pass not a date object', () => {
    expect(isValidDate('')).toEqual(false)
    expect(isValidDate('some text')).toEqual(false)
    expect(isValidDate(null)).toEqual(false)
  })

  it('returns true if pass date', () => {
    expect(isValidDate('12/31/2018')).toEqual(true)
    expect(isValidDate('2018-12-31')).toEqual(true)
  })

  describe('No future date allowed', () => {
    const conf = {
      allowFutureDate: false,
    }

    it('returns true if pass the past date', () => {
      expect(isValidDate('1971-12-31', conf)).toEqual(true)
    })

    it('returns false if pass the futute date', () => {
      expect(isValidDate('5000-12-31', conf)).toEqual(false)
    })
  })
})

describe('#localToIsoDateOrNull()', () => {
  it('returns null if pass not valid local date', () => {
    expect(localToIsoDateOrNull('')).toEqual(null)
    expect(localToIsoDateOrNull('12/31/____')).toEqual(null)
    expect(localToIsoDateOrNull(null)).toEqual(null)
  })

  it('returns iso date if pass valid Local date', () => {
    expect(localToIsoDateOrNull('12/31/2018')).toEqual('2018-12-31')
  })
})
