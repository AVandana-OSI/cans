import { Map, List } from 'immutable'
import {
  selectAddressTypes,
  selectUnableToDetermineCodes,
  systemCodeDisplayValue,
} from '../../selectors/systemCodeSelectors'
import { RESIDENCE_TYPE } from '../../enums/AddressType'
import { isPlacementHome } from '../../util/isPlacementHome'
import { zipFormatter } from '../../util/zipFormatter'
import { Maybe } from '../../util/maybe'

export const mapCounties = result => {
  return result.get('client_counties') ? result.get('client_counties').map(county => county.get('description')) : List()
}

export const mapLanguages = result => {
  return result.get('languages')
    ? result
        .get('languages')
        .sort((first, second) => second.get('primary') - first.get('primary'))
        .map(language => language.get('name'))
    : List()
}

export const mapIsSensitive = result => result.get('sensitivity_indicator', '').toUpperCase() === 'S'
export const mapIsSealed = result => result.get('sensitivity_indicator', '').toUpperCase() === 'R'
export const mapIsProbationYouth = result => result.get('open_case_responsible_agency_code', '').toUpperCase() === 'P'

const getStreetAddress = address => `${address.get('street_number') || ''} ${address.get('street_name') || ''}`

const getDisplayType = (address, addressTypes) => {
  if (isPlacementHome(address)) {
    return 'Placement Home'
  } else {
    return systemCodeDisplayValue(address.getIn(['type', 'id']), addressTypes) || ''
  }
}

export const mapRaces = (result, systemCodes) => {
  const unableToDetermineCodes = selectUnableToDetermineCodes(systemCodes)

  if (result.get('race_ethnicity')) {
    if (result.get('race_ethnicity').get('unable_to_determine_code')) {
      const clientUnableToDetermineCode = result.get('race_ethnicity').get('unable_to_determine_code')

      return List([systemCodeDisplayValue(clientUnableToDetermineCode, unableToDetermineCodes)])
    } else if (result.get('race_ethnicity').get('race_codes')) {
      return result
        .get('race_ethnicity')
        .get('race_codes')
        .map(race => race.get('description'))
    } else {
      return List()
    }
  } else {
    return List()
  }
}

const isResidence = address => address.getIn(['type', 'id']) === RESIDENCE_TYPE

export const mapAddress = (result, systemCodes) => {
  const addressTypes = selectAddressTypes(systemCodes)

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

export const encodedSearchAfterParams = sortAfter => {
  return sortAfter
    ? sortAfter
        .map(item => `search_after${encodeURIComponent('[]')}=${encodeURIComponent(item)}`)
        .filter(Boolean)
        .join('&')
    : null
}
