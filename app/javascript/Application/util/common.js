export function clone(object) {
  return JSON.parse(JSON.stringify(object))
}

export function stringify(value) {
  if (typeof value !== 'undefined') {
    return value === null ? '' : '' + value
  } else {
    return ''
  }
}

/**
 * Check whether input parametr is empty. Analog of Lodash _.isEmpty()
 * @param {Object} Any object
 * @returns {boolean} True if object is empty
 */
export function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  )
}

// Firefox browser behaves in a different way than other browsers with input fields type change
// and prints iframe, so we are detecting if user is in Firefox with this workaround
// https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
export const isFirefox = typeof InstallTrigger !== 'undefined'
