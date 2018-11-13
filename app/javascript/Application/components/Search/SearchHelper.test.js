import { fromJS } from 'immutable'
import {
  mapLanguages,
  mapRaces,
  mapIsSensitive,
  mapIsSealed,
  mapPhoneNumber,
  mapAddress,
  encodedSearchAfterParams,
} from './searchHelper'
import { RESIDENCE_TYPE } from '../../enums/AddressType'
import { sort } from 'fp-ts/lib/Array'

describe('searchHelper', () => {
  const languages = [{ code: '1', value: 'English' }, { code: '2', value: 'French' }, { code: '3', value: 'Italian' }]
  const ethnicityTypes = [
    { code: '1', value: 'European' },
    { code: '2', value: 'French' },
    { code: '3', value: 'Romanian' },
  ]
  const raceTypes = [{ code: '1', value: 'Race 1' }, { code: '2', value: 'Race 2' }, { code: '3', value: 'Race 3' }]
  const unableToDetermineCodes = [
    { code: 'A', value: 'Abandoned' },
    { code: 'I', value: 'Unknown' },
    { code: 'K', value: 'Unknown' },
  ]
  const hispanicOriginCodes = [{ code: 'Y', value: 'yes' }, { code: 'N', value: 'no' }]

  const addressTypes = [{ code: RESIDENCE_TYPE, value: 'address type' }]

  const systemCodes = {
    addressTypes,
    ethnicityTypes,
    hispanicOriginCodes,
    languages,
    raceTypes,
    unableToDetermineCodes,
  }

  describe('mapLanguages', () => {
    it('maps languages object to values, sorting by primary', () => {
      const result = fromJS({
        languages: [
          { id: '3', name: 'Italian', primary: true }, // Italian
          { id: '2', name: 'French', primary: false }, // French
          { id: '1', name: 'English', primary: true }, // English
        ],
      })
      const languageResult = mapLanguages(result)

      expect(languageResult.toJS()).toEqual(['Italian', 'English', 'French'])
    })
  })

  describe('mapIsSensitive', () => {
    it('returns true if the result is sensitive', () => {
      const result = fromJS({
        sensitivity_indicator: 'S',
      })
      const sensitiveResult = mapIsSensitive(result)

      expect(sensitiveResult).toEqual(true)
    })

    it('returns false if the result is not sensitive', () => {
      const result = fromJS({
        sensitivity_indicator: 'R',
      })
      const sensitiveResult = mapIsSensitive(result)

      expect(sensitiveResult).toEqual(false)
    })
  })

  describe('mapIsSealed', () => {
    it('returns true if the result is sealed', () => {
      const result = fromJS({
        sensitivity_indicator: 'R',
      })
      const sensitiveResult = mapIsSealed(result)

      expect(sensitiveResult).toEqual(true)
    })

    it('returns false if the result is not sealed', () => {
      const result = fromJS({
        sensitivity_indicator: 'S',
      })
      const sensitiveResult = mapIsSealed(result)

      expect(sensitiveResult).toEqual(false)
    })
  })

  describe('mapPhoneNumber', () => {
    it('returns phone numbers', () => {
      const result = fromJS({
        addresses: [
          {
            id: 'TSWY42i0V4',
            city: 'Sacramento',
            state: {
              id: '1828',
              description: 'California',
            },
            state_code: 'CA',
            state_name: 'California',
            county: {
              id: '1101',
              description: 'Sacramento',
            },
            zip: null,
            type: {
              id: '32',
              description: 'Residence',
            },
            street_number: '10',
            street_name: 'Main St',
            active: 'true',
            legacy_descriptor: {
              legacy_id: 'TSWY42i0V4',
              legacy_ui_id: '1673-3395-1268-0001926',
              legacy_last_updated: '2004-11-16T17:25:53.407-0800',
              legacy_table_name: 'PLC_HM_T',
              legacy_table_description: 'Placement Home',
            },
            phone_numbers: [
              {
                number: '9200002665',
                type: 'Home',
              },
              {
                number: '9230003403',
                type: 'Work',
              },
              {
                number: '8720007345',
                type: 'Cell',
              },
            ],
          },
        ],
      })

      expect(mapPhoneNumber(result).toJS()).toEqual([
        { number: '9200002665', type: 'Home' },
        { number: '9230003403', type: 'Work' },
        { number: '8720007345', type: 'Cell' },
      ])
    })
  })

  describe('mapAddress', () => {
    it('returns the city, state, zip, type, and a joined street address', () => {
      const result = fromJS({
        addresses: [
          {
            city: 'city',
            state_code: 'state',
            zip: 'zip',
            type: { id: RESIDENCE_TYPE },
            street_number: '123',
            street_name: 'C Street',
          },
        ],
      })
      const systemCodesImmutable = fromJS({ systemCodes })
      const addressResult = mapAddress(result, systemCodesImmutable)

      expect(addressResult.toJS()).toEqual({
        city: 'city',
        state: 'state',
        zip: 'zip',
        type: 'address type',
        streetAddress: '123 C Street',
      })
    })

    it('returns null list when typeId is not 32', () => {
      const result = fromJS({
        addresses: [
          {
            city: 'city',
            state_code: 'state',
            zip: 'zip',
            type: { id: '5' },
            street_number: '123',
            street_name: 'C Street',
          },
        ],
      })
      const systemCodesImmutable = fromJS({ systemCodes })
      const addressResult = mapAddress(result, systemCodesImmutable)

      expect(addressResult).toEqual(null)
    })

    it('returns the first address from addresses object', () => {
      const result = fromJS({
        addresses: [
          {
            city: 'city',
            state_code: 'state',
            zip: 'zip',
            type: { id: RESIDENCE_TYPE },
            street_number: '123',
            street_name: 'C Street',
          },
          {
            city: 'city2',
            state_code: 'state2',
            zip: 'zip2',
            type: { id: RESIDENCE_TYPE },
            street_number: '12345',
            street_name: 'K Street',
          },
        ],
      })
      const systemCodesImmutable = fromJS({ systemCodes })
      const addressResult = mapAddress(result, systemCodesImmutable)

      expect(addressResult.toJS()).toEqual({
        city: 'city',
        state: 'state',
        zip: 'zip',
        type: 'address type',
        streetAddress: '123 C Street',
      })
    })

    it('returns address type Placement Home if the legacy table name is PLC_HM_T', () => {
      const result = fromJS({
        addresses: [
          {
            city: 'city',
            state_code: 'state',
            zip: 'zip',
            type: { id: RESIDENCE_TYPE },
            street_number: '123',
            street_name: 'C Street',
            legacy_descriptor: {
              legacy_id: 'TSWY42i0V4',
              legacy_ui_id: '1673-3395-1268-0001926',
              legacy_last_updated: '2004-11-16T17:25:53.407-0800',
              legacy_table_name: 'PLC_HM_T',
              legacy_table_description: 'Placement Home',
            },
          },
        ],
      })
      const systemCodesImmutable = fromJS({ systemCodes })
      const addressResult = mapAddress(result, systemCodesImmutable)

      expect(addressResult.toJS()).toEqual({
        city: 'city',
        state: 'state',
        zip: 'zip',
        type: 'Placement Home',
        streetAddress: '123 C Street',
      })
    })
  })

  describe('mapRaces', () => {
    it('maps race objects to values', () => {
      const result = fromJS({
        race_ethnicity: {
          race_codes: [
            { id: '3', description: 'Romanian' },
            { id: '2', description: 'French' },
            { id: '1', description: 'European' },
          ],
        },
      })
      const systemCodesImmutable = fromJS({
        systemCodes: { unableToDetermineCodes },
      })
      const racesResult = mapRaces(result, systemCodesImmutable)

      expect(racesResult.toJS()).toEqual(['Romanian', 'French', 'European'])
    })

    it('maps races to "Abandoned" if unableToDetermineCode is "A"', () => {
      const result = fromJS({
        race_ethnicity: {
          unable_to_determine_code: 'A',
        },
      })
      const systemCodesImmutable = fromJS({
        systemCodes: { unableToDetermineCodes },
      })
      const racesResult = mapRaces(result, systemCodesImmutable)

      expect(racesResult.toJS()).toEqual(['Abandoned'])
    })

    it('maps races to "Unknown" if unableToDetermineCode is "I"', () => {
      const result = fromJS({
        race_ethnicity: {
          unable_to_determine_code: 'I',
        },
      })
      const systemCodesImmutable = fromJS({
        systemCodes: { unableToDetermineCodes },
      })
      const racesResult = mapRaces(result, systemCodesImmutable)

      expect(racesResult.toJS()).toEqual(['Unknown'])
    })

    it('maps races to "Unknown" if unableToDetermineCode is "K"', () => {
      const result = fromJS({
        race_ethnicity: {
          unable_to_determine_code: 'K',
        },
      })
      const systemCodesImmutable = fromJS({
        systemCodes: { unableToDetermineCodes },
      })
      const racesResult = mapRaces(result, systemCodesImmutable)

      expect(racesResult.toJS()).toEqual(['Unknown'])
    })
  })
})

describe('encodedSearchAfterParams', () => {
  it('returns url encoded query string params', () => {
    const sortAfter = [125.48025, 'person-summary#9GE4pyI0N3']

    expect(encodedSearchAfterParams(sortAfter)).toBe(
      'search_after%5B%5D=125.48025&search_after%5B%5D=person-summary%239GE4pyI0N3'
    )
  })
})
