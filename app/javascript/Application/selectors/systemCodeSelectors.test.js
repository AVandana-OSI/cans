import {
  selectAddressCounties,
  selectAddressTypes,
  selectCounties,
  selectCountiesWithoutStateOfCalifornia,
  selectCountyAgencies,
  selectEthnicityTypes,
  selectHispanicOriginCodes,
  selectLanguages,
  selectRaceTypes,
  selectRelationshipTypes,
  selectScreenResponseTimes,
  selectUnableToDetermineCodes,
  systemCodeDisplayValue,
} from 'selectors/systemCodeSelectors'
import { fromJS } from 'immutable'

describe('systemCodeSelectors', () => {
  describe('systemCodeDisplayValue', () => {
    const systemCodes = fromJS([
      { code: '007', value: 'James Bond' },
      { code: '006', value: 'Alec Trevelyan' },
    ])

    it('finds the value with matching code', () => {
      expect(systemCodeDisplayValue('007', systemCodes)).toEqual('James Bond')
      expect(systemCodeDisplayValue('006', systemCodes)).toEqual(
        'Alec Trevelyan'
      )
    })

    it('returns a undefined when none is found', () => {
      expect(systemCodeDisplayValue('009', systemCodes)).toBeUndefined()
    })
  })

  describe('selectAddressCounties', () => {
    it('returns a list of address counties', () => {
      const addressCounties = [
        { county_code: '99', value: 'State Of California' },
      ]
      const otherSystemCodes = [{ county_code: '1', value: 'invalid' }]
      const state = fromJS({
        systemCodes: { addressCounties, otherSystemCodes },
      })
      expect(selectAddressCounties(state).toJS()).toEqual(addressCounties)
    })

    it('returns an empty list when address counties are empty', () => {
      const addressCounties = []
      const otherSystemCodes = [{ county_code: '1', value: 'invalid' }]
      const state = fromJS({
        systemCodes: { addressCounties, otherSystemCodes },
      })
      expect(selectAddressCounties(state).toJS()).toEqual([])
    })
  })

  describe('selectAddressTypes', () => {
    it('returns a list of address types', () => {
      const addressTypes = [{ code: '1', value: 'ABC' }]
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({ systemCodes: { addressTypes, otherSystemCodes } })
      expect(selectAddressTypes(state).toJS()).toEqual(addressTypes)
    })

    it('returns an empty list when address types are empty', () => {
      const addressTypes = []
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({ systemCodes: { addressTypes, otherSystemCodes } })
      expect(selectAddressTypes(state).toJS()).toEqual([])
    })
  })

  describe('selectCounties', () => {
    it('returns a list of counties', () => {
      const counties = [
        { code: '1', value: 'ABC' },
        { code: '99', value: 'State of California' },
      ]
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({ systemCodes: { counties, otherSystemCodes } })
      expect(selectCounties(state).toJS()).toEqual(counties)
    })

    it('returns an empty list when counties are empty', () => {
      const counties = []
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({ systemCodes: { counties, otherSystemCodes } })
      expect(selectCounties(state).toJS()).toEqual([])
    })
  })

  describe('selectCountyAgencies', () => {
    it('returns a list of counties', () => {
      const countyAgencies = [{ code: '1', value: 'ABC' }]
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({
        systemCodes: { countyAgencies, otherSystemCodes },
      })
      expect(selectCountyAgencies(state).toJS()).toEqual(countyAgencies)
    })

    it('returns an empty list when counties are empty', () => {
      const countyAgencies = []
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({
        systemCodes: { countyAgencies, otherSystemCodes },
      })
      expect(selectCountyAgencies(state).toJS()).toEqual([])
    })
  })

  describe('selectEthnicityTypes', () => {
    it('returns a list of ethnicity types', () => {
      const ethnicityTypes = [{ code: '1', value: 'ABC' }]
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({
        systemCodes: { ethnicityTypes, otherSystemCodes },
      })
      expect(selectEthnicityTypes(state).toJS()).toEqual(ethnicityTypes)
    })

    it('returns an empty list when ethnicity types are empty', () => {
      const ethnicityTypes = []
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({
        systemCodes: { ethnicityTypes, otherSystemCodes },
      })
      expect(selectEthnicityTypes(state).toJS()).toEqual([])
    })
  })

  describe('selectHispanicOriginCodes', () => {
    it('returns a list of hispanic origin codes', () => {
      const hispanicOriginCodes = [{ code: '1', value: 'ABC' }]
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({
        systemCodes: { hispanicOriginCodes, otherSystemCodes },
      })
      expect(selectHispanicOriginCodes(state).toJS()).toEqual(
        hispanicOriginCodes
      )
    })

    it('returns an empty list when origin codes are empty', () => {
      const hispanicOriginCodes = []
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({
        systemCodes: { hispanicOriginCodes, otherSystemCodes },
      })
      expect(selectHispanicOriginCodes(state).toJS()).toEqual([])
    })
  })

  describe('selectLanguages', () => {
    it('returns a list of languages', () => {
      const languages = [{ code: '1', value: 'ABC' }]
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({ systemCodes: { languages, otherSystemCodes } })
      expect(selectLanguages(state).toJS()).toEqual(languages)
    })

    it('returns an empty list when languages are empty', () => {
      const languages = []
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({ systemCodes: { languages, otherSystemCodes } })
      expect(selectLanguages(state).toJS()).toEqual([])
    })
  })

  describe('selectRaceTypes', () => {
    it('returns a list of race types', () => {
      const raceTypes = [{ county_code: '99', value: 'State Of California' }]
      const state = fromJS({ systemCodes: { raceTypes } })
      expect(selectRaceTypes(state).toJS()).toEqual(raceTypes)
    })

    it('returns an empty list when relationship types are empty', () => {
      const raceTypes = []
      const state = fromJS({ systemCodes: { raceTypes } })
      expect(selectRaceTypes(state).toJS()).toEqual([])
    })
  })

  describe('selectRelationshipTypes', () => {
    it('returns a list of relationship types', () => {
      const relationshipTypes = [
        { county_code: '99', value: 'State Of California' },
      ]
      const state = fromJS({ systemCodes: { relationshipTypes } })
      expect(selectRelationshipTypes(state).toJS()).toEqual(relationshipTypes)
    })

    it('returns an empty list when relationship types are empty', () => {
      const relationshipTypes = []
      const state = fromJS({ systemCodes: { relationshipTypes } })
      expect(selectRelationshipTypes(state).toJS()).toEqual([])
    })
  })

  describe('selectScreenResponseTimes', () => {
    it('returns a list of screen response times', () => {
      const screenResponseTimes = [
        { county_code: '99', value: 'State Of California' },
      ]
      const state = fromJS({ systemCodes: { screenResponseTimes } })
      expect(selectScreenResponseTimes(state).toJS()).toEqual(
        screenResponseTimes
      )
    })

    it('returns an empty list when screen response times are empty', () => {
      const screenResponseTimes = []
      const state = fromJS({ systemCodes: { screenResponseTimes } })
      expect(selectScreenResponseTimes(state).toJS()).toEqual([])
    })
  })

  describe('selectUnableToDetermineCodes', () => {
    it('returns a list of relationship types', () => {
      const unableToDetermineCodes = [
        { county_code: '99', value: 'State Of California' },
      ]
      const state = fromJS({ systemCodes: { unableToDetermineCodes } })
      expect(selectUnableToDetermineCodes(state).toJS()).toEqual(
        unableToDetermineCodes
      )
    })

    it('returns an empty list when relationship types are empty', () => {
      const unableToDetermineCodes = []
      const state = fromJS({ systemCodes: { unableToDetermineCodes } })
      expect(selectUnableToDetermineCodes(state).toJS()).toEqual([])
    })
  })

  describe('selectCountiesWithoutStateOfCalifornia', () => {
    it('returns a list of counties', () => {
      const counties = [{ code: '1', value: 'ABC' }]
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({ systemCodes: { counties, otherSystemCodes } })
      expect(selectCountiesWithoutStateOfCalifornia(state).toJS()).toEqual(
        counties
      )
    })

    it('removes State of California from the list', () => {
      const counties = [
        { code: '1', value: 'ABC' },
        { code: '99', value: 'State of California' },
      ]
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({ systemCodes: { counties, otherSystemCodes } })
      expect(selectCountiesWithoutStateOfCalifornia(state).toJS()).toEqual([
        counties[0],
      ])
    })

    it('returns an empty list when counties are empty', () => {
      const counties = []
      const otherSystemCodes = [{ code: '2', value: 'invalid' }]
      const state = fromJS({ systemCodes: { counties, otherSystemCodes } })
      expect(selectCountiesWithoutStateOfCalifornia(state).toJS()).toEqual([])
    })
  })
})
