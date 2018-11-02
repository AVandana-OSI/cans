import NAME_SUFFIXES from '../enums/NameSuffixes'
import NUMBER_SUFFIXES from '../enums/NumberSuffixes'

/**
 * Trims the input string safely, returns empty string on null/undefined input
 * @param str {string}
 * @returns {string}
 */
export function trimSafely(str) {
  return str ? str.trim() : ''
}

/**
 * Adds a trailing slash to a string if there is no trailing slash.
 * Returns slash for an empty or undefined strings
 *
 * @param url
 */
export function addTrailingSlash(url) {
  if (!url) {
    return '/'
  }
  return url[url.length - 1] === '/' ? url : `${url}/`
}

export const isCommaSuffix = suffix =>
  Boolean(typeof suffix === 'string' && NAME_SUFFIXES[suffix.toLowerCase()])

export const formatNameSuffix = suffix => {
  const downCaseSuffix = typeof suffix === 'string' && suffix.toLowerCase()
  return NAME_SUFFIXES[downCaseSuffix] || NUMBER_SUFFIXES[downCaseSuffix]
}

export const formatHighlightedSuffix = highlightedSuffix => {
  if (typeof highlightedSuffix !== 'string') {
    return null
  }

  const suffix = highlightedSuffix.replace(/<\/?em>/gi, '')
  const formattedSuffix = formatNameSuffix(suffix)
  if (!formattedSuffix) {
    return formattedSuffix
  }
  const rehighlightedSuffix =
    suffix === highlightedSuffix
      ? formattedSuffix
      : `<em>${formattedSuffix}</em>`

  return rehighlightedSuffix
}

export const phoneNumberFormatter = phone => {
  if (phone && phone.replace) {
    phone = phone.replace(/[^\d]/g, '')
    const length = 10
    if (phone.length === length) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
    }
  }
  return null
}
