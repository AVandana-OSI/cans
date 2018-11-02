import { List, Map, fromJS } from 'immutable'
import { isCommaSuffix, formatHighlightedSuffix } from '../util/formatters'
import { phoneNumberFormatter } from '../util/formatters'
import {
  mapLanguages,
  mapIsSensitive,
  mapIsSealed,
  mapIsProbationYouth,
  mapRaces,
  mapEthnicities,
  mapAddress,
  mapPhoneNumber,
} from '../components/Search/SearchHelper'
import { selectCounties, systemCodeDisplayValue } from './systemCodeSelectors'

export const selectSearchTermValue = state =>
  selectPeopleSearch(state).get('searchTerm')

export const selectSearchAddressValue = state =>
  selectPeopleSearch(state).get('isAddressIncluded')

export const selectResultsTotalValue = state =>
  selectPeopleSearch(state).get('total')

export const selectLastResultsSortValue = state => {
  const lastResult = selectPeopleSearch(state)
    .get('results')
    .last()
  return lastResult.get('sort').toJS()
}

const formatSSN = ssn => ssn && ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3')
const formatDOB = (dob, highlight) =>
  highlight ? '<em>'.concat(dob, '</em>') : dob
const formatPhoneNumber = phoneNumber =>
  phoneNumber
    ? Map({
        number: phoneNumberFormatter(phoneNumber.get('number')),
        type: phoneNumber.get('type'),
      })
    : null

// Try to find a match from a list of highlights by stripping out <em> tags
const highlightNameField = (exactName, highlights) =>
  highlights.find(
    highlight => highlight.replace(/<(\/)?em>/g, '') === exactName
  )

const maybeHighlightedField = (result, highlight, key) =>
  highlight.getIn(
    [key, 0],
    highlightNameField(
      result.get(key),
      highlight.get('autocomplete_search_bar', List())
    )
  )

const combineFullName = (
  firstName,
  middleName,
  lastName,
  nameSuffix,
  isCommaSuffix
) => {
  const nameStem = [firstName, middleName, lastName].filter(Boolean).join(' ')

  if (nameSuffix) {
    return `${nameStem}${isCommaSuffix ? ',' : ''} ${nameSuffix}`
  }

  return nameStem
}

const formatFullName = (result, highlight) =>
  combineFullName(
    maybeHighlightedField(result, highlight, 'first_name') ||
      result.get('first_name'),
    maybeHighlightedField(result, highlight, 'middle_name') ||
      result.get('middle_name'),
    maybeHighlightedField(result, highlight, 'last_name') ||
      result.get('last_name'),
    formatHighlightedSuffix(
      maybeHighlightedField(result, highlight, 'name_suffix') ||
        result.get('name_suffix')
    ),
    isCommaSuffix(result.get('name_suffix'))
  )

const mapCounties = (counties, countyCodes) =>
  counties.map(county => systemCodeDisplayValue(county.get('id'), countyCodes))

const hasActiveCsec = _result => false

export const selectPeopleResults = results =>
  results.map(record => {
    const fullResult = fromJS(record)
    const result = fullResult.get('_source', Map())
    const highlight = fullResult.get('highlight', Map())
    return Map({
      legacy_id: result.get('id'),
      fullName: formatFullName(result, highlight),
      legacyDescriptor: result.get('legacy_descriptor'),
      gender: result.get('gender'),
      // languages: mapLanguages(result),
      // races: mapRaces(result),
      languages: ['English'],
      races: ['Mexican'],
      ethnicity: { hispanic_latino_origin: 'Yes' },
      // ethnicity: mapEthnicities(result),
      dateOfBirth: formatDOB(
        result.get('date_of_birth'),
        highlight.has('searchable_date_of_birth')
      ),
      isDeceased: Boolean(result.get('date_of_death')),
      isCsec: hasActiveCsec(result),
      ssn: formatSSN(
        maybeHighlightedField(result, highlight, 'ssn') || result.get('ssn')
      ),
      clientCounties: mapCounties(
        result.get('client_counties', List()),
        selectCounties(fromJS(results))
      ),
      address: mapAddress(result),
      phoneNumber: formatPhoneNumber(mapPhoneNumber(result).first()),
      isSensitive: mapIsSensitive(result),
      isSealed: mapIsSealed(result),
      isProbationYouth: mapIsProbationYouth(result),
    }).toJS()
  })

export const selectStartTime = state =>
  selectPeopleSearch(state).get('startTime')

export const selectPersonCreatedAtTime = state =>
  state
    .get('relationshipsQueryCycleTime')
    .toJS()
    .map(t => t.personCreatedAtTime)
    .pop()

export const selectSearchAddress = state =>
  selectPeopleSearch(state).get('searchAddress')
export const selectSearchCity = state =>
  selectPeopleSearch(state).get('searchCity')
export const selectSearchCounty = state =>
  selectPeopleSearch(state).get('searchCounty')
