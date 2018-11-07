import Immutable from 'immutable'
import { List } from 'immutable'
import { isPlacementHome } from './isPlacementHome'

describe('isPlacementHome ', () => {
  const addressWithPlacementHome = Immutable.fromJS({
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
  })

  const addressWithoutPlacementHome = Immutable.fromJS({
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
      legacy_table_name: 'ADDRS_T',
      legacy_table_description: 'Address',
    },
  })

  it('returns true if legacy table name is PLC_HM_T', () => {
    expect(isPlacementHome(addressWithPlacementHome)).toEqual(true)
  })

  it('returns false if legacy table name is not PLC_HM_T', () => {
    expect(isPlacementHome(addressWithoutPlacementHome)).toEqual(false)
  })

  it('returns false when false is passed', () => {
    expect(isPlacementHome(false)).toEqual(false)
  })

  it('returns false when null is passed', () => {
    expect(isPlacementHome(null)).toEqual(false)
  })

  it('returns false when undefined is passed', () => {
    expect(isPlacementHome(undefined)).toEqual(false)
  })

  it('returns false when empty List is passed', () => {
    expect(isPlacementHome(List())).toEqual(false)
  })
})
