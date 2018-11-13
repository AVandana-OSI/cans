import { List, Map, fromJS } from 'immutable'
import { phoneNumberFormatter, isCommaSuffix, formatHighlightedSuffix } from '../util/formatters'
import {
  mapLanguages,
  mapIsSensitive,
  mapIsSealed,
  mapIsProbationYouth,
  mapRaces,
  mapAddress,
  mapPhoneNumber,
  mapCounties,
} from '../components/Search/searchHelper'

const formatSSN = ssn => ssn && ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3')
const formatDOB = (dob, highlight) => (highlight ? '<em>'.concat(dob, '</em>') : dob)
const formatPhoneNumber = phoneNumber =>
  phoneNumber
    ? Map({
        number: phoneNumberFormatter(phoneNumber.get('number')),
        type: phoneNumber.get('type'),
      })
    : null

// Try to find a match from a list of highlights by stripping out <em> tags
const highlightNameField = (exactName, highlights) =>
  highlights.find(highlight => highlight.replace(/<(\/)?em>/g, '') === exactName)

const maybeHighlightedField = (result, highlight, key) =>
  highlight.getIn([key, 0], highlightNameField(result.get(key), highlight.get('autocomplete_search_bar', List())))

const combineFullName = (firstName, middleName, lastName, nameSuffix, isCommaSuffix) => {
  const firstMiddleStem = [firstName, middleName].filter(Boolean).join(' ')
  const lastSuffixStem = nameSuffix
    ? [lastName, `${isCommaSuffix ? ', ' : ' '}${nameSuffix}`].filter(Boolean).join('')
    : lastName
  const fullName = [lastSuffixStem, firstMiddleStem].filter(Boolean).join(', ')

  return fullName
}

const formatFullName = (result, highlight) =>
  combineFullName(
    maybeHighlightedField(result, highlight, 'first_name') || result.get('first_name'),
    maybeHighlightedField(result, highlight, 'middle_name') || result.get('middle_name'),
    maybeHighlightedField(result, highlight, 'last_name') || result.get('last_name'),
    formatHighlightedSuffix(maybeHighlightedField(result, highlight, 'name_suffix') || result.get('name_suffix')),
    isCommaSuffix(result.get('name_suffix'))
  )

const hasActiveCsec = _result => false

export const selectPeopleResults = response => {
  const results = fromJS(response).get('results')
  const systemCodes = fromJS({ systemCodes: response.systemCodes })

  return results
    .map(fullResult => {
      const sort = fullResult.get('sort')
      const result = fullResult.get('_source', Map())
      const highlight = fullResult.get('highlight', Map())

      return Map({
        legacy_id: result.get('id'),
        fullName: formatFullName(result, highlight),
        legacyDescriptor: result.get('legacy_descriptor'),
        gender: result.get('gender'),
        languages: mapLanguages(result),
        races: mapRaces(result, systemCodes),
        dateOfBirth: formatDOB(result.get('date_of_birth'), highlight.has('searchable_date_of_birth')),
        isDeceased: Boolean(result.get('date_of_death')),
        isCsec: hasActiveCsec(result),
        ssn: formatSSN(maybeHighlightedField(result, highlight, 'ssn') || result.get('ssn')),
        clientCounties: mapCounties(result),
        address: mapAddress(result, systemCodes),
        phoneNumber: formatPhoneNumber(mapPhoneNumber(result).first()),
        isSensitive: mapIsSensitive(result),
        isSealed: mapIsSealed(result),
        isProbationYouth: mapIsProbationYouth(result),
        sort,
      })
    })
    .toJS()
}
