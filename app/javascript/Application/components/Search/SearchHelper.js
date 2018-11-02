import { Map, List, fromJS } from 'immutable'
import {
  selectAddressTypes,
  selectEthnicityTypes,
  selectHispanicOriginCodes,
  selectLanguages,
  selectRaceTypes,
  selectUnableToDetermineCodes,
  systemCodeDisplayValue,
} from '../../selectors/systemCodeSelectors'
import { RESIDENCE_TYPE } from '../../enums/AddressType'
import { isPlacementHome } from '../../util/isPlacementHome'
import { zipFormatter } from '../../util/zipFormatter'
import { Maybe } from '../../util/maybe'

export const buildSelector = (...funcs) => {
  const selector = funcs.pop()
  return (...args) => selector(...funcs.map(f => f(...args)))
}

export const mapCounties = result => {
  const counties = result
    .get('client_counties')
    .map(county => county.get('description'))
}

export const mapLanguages = result => {
  const languages = result
    .get('languages')
    .map(language => language.get('name'))
  return languages
}

export const mapIsSensitive = result =>
  result.get('sensitivity_indicator', '').toUpperCase() === 'S'
export const mapIsSealed = result =>
  result.get('sensitivity_indicator', '').toUpperCase() === 'R'
export const mapIsProbationYouth = result =>
  result.get('open_case_responsible_agency_code', '').toUpperCase() === 'P'

export const mapRaces = result => {
  const races = result
    .get('race_ethnicity')
    .get('race_codes')
    .map(race => race.get('description'))
  console.log(`races`, races.toJS())
  return races
}

export const mapEthnicities = result =>
  buildSelector(
    selectHispanicOriginCodes,
    () => result.getIn(['race_ethnicity', 'hispanic_codes']) || List(),
    () => result.getIn(['race_ethnicity', 'hispanic_origin_code']),
    (hispanicOriginCodes, ethnicities, hispanicLatinoOriginCode) =>
      fromJS({
        hispanic_latino_origin: systemCodeDisplayValue(
          hispanicLatinoOriginCode,
          hispanicOriginCodes
        ),
        ethnicity_detail: ethnicities
          .map(ethnicity => ethnicity.get('description'))
          .toJS(),
      })
  )

const getStreetAddress = address =>
  `${address.get('street_number') || ''} ${address.get('street_name') || ''}`

const getDisplayType = (address, addressTypes) => {
  if (isPlacementHome(address)) {
    return 'Placement Home'
  } else {
    return (
      systemCodeDisplayValue(address.getIn(['type', 'id']), addressTypes) || ''
    )
  }
}

const isResidence = address => address.getIn(['type', 'id']) === RESIDENCE_TYPE

export const mapAddress = result => {
  const addressTypes = selectAddressTypes(result)

  return Maybe.of(result.get('addresses'))
    .map(as => as.first())
    .filter(isResidence)
    .map(address =>
      Map({
        city: address.get('city'),
        state: address.get('state_code'),
        zip: zipFormatter(address.get('zip')),
        streetAddress: getStreetAddress(address),
        type: getDisplayType(address, addressTypes),
      })
    )
    .valueOrElse(null)
}

export const mapPhoneNumber = result =>
  Maybe.of(result.get('addresses'))
    .map(as => as.first())
    .filter(isResidence)
    .map(address => address.get('phone_numbers'))
    .valueOrElse(List())
