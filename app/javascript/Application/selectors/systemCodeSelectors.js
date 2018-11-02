import { Map, List } from 'immutable'

export const systemCodeDisplayValue = (code, systemCodes = List()) =>
  systemCodes
    .find(systemCode => systemCode.get('code') === code, null, Map())
    .get('value')

export const systemCodeIdValue = (value, systemCodes = List()) =>
  systemCodes
    .find(systemCode => systemCode.get('value') === value, null, Map())
    .get('code')

const selectCodes = type => state => state.getIn(['systemCodes', type])

export const selectAddressCounties = selectCodes('addressCounties')
export const selectAddressTypes = selectCodes('addressTypes')
export const selectCounties = selectCodes('counties')
export const selectCountyAgencies = selectCodes('countyAgencies')
export const selectEthnicityTypes = selectCodes('ethnicityTypes')
export const selectHispanicOriginCodes = selectCodes('hispanicOriginCodes')
export const selectLanguages = selectCodes('languages')
export const selectRaceTypes = selectCodes('raceTypes')
export const selectRelationshipTypes = selectCodes('relationshipTypes')
export const selectScreenResponseTimes = selectCodes('screenResponseTimes')
export const selectUnableToDetermineCodes = selectCodes(
  'unableToDetermineCodes'
)
export const selectCsecTypes = selectCodes('csecTypes')
export const selectCommunicationMethods = selectCodes('communicationMethods')

export const selectCountiesWithoutStateOfCalifornia = state =>
  selectCounties(state).filter(
    code => code.get('value') !== 'State of California'
  )
