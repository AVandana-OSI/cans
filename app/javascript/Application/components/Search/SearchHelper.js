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

export const mapLanguages = result =>
  buildSelector(
    selectLanguages,
    () => result.get('languages') || List(),
    (statusCodes, languages) =>
      languages
        .sort((first, second) => second.get('primary') - first.get('primary'))
        .map(language =>
          systemCodeDisplayValue(language.get('id'), statusCodes)
        )
  )

export const mapIsSensitive = result =>
  result.get('sensitivity_indicator', '').toUpperCase() === 'S'
export const mapIsSealed = result =>
  result.get('sensitivity_indicator', '').toUpperCase() === 'R'
export const mapIsProbationYouth = result =>
  result.get('open_case_responsible_agency_code', '').toUpperCase() === 'P'

export const mapRaces = result =>
  buildSelector(
    selectEthnicityTypes,
    selectRaceTypes,
    selectUnableToDetermineCodes,
    () => result.getIn(['race_ethnicity', 'race_codes']) || List(),
    () => result.get('unable_to_determine_code'),
    (
      ethnicityTypes,
      raceTypes,
      unableToDetermineCodes,
      races,
      unableToDetermineCode
    ) => {
      if (unableToDetermineCode) {
        return List([
          systemCodeDisplayValue(unableToDetermineCode, unableToDetermineCodes),
        ])
      } else {
        return races.map(race =>
          Map({
            race: systemCodeDisplayValue(race.get('id'), raceTypes),
            race_detail: systemCodeDisplayValue(race.get('id'), ethnicityTypes),
          })
        )
      }
    }
  )

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
