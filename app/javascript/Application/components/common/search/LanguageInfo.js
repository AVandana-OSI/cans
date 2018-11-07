import PropTypes from 'prop-types'
import React from 'react'

export const MAX_LANGUAGES = 2

export const flagPrimaryLanguage = languages => {
  if (languages[0]) languages[0] += ' (Primary)'
  return languages
}

export const primaryLanguageOnly = languages => {
  return languages[0] ? languages[0] : ''
}

const LanguageInfo = ({ languages }) => {
  const lan = languages && primaryLanguageOnly(languages.filter(Boolean))
  return lan ? (
    <div>
      <span>{lan}</span>
    </div>
  ) : null
}
LanguageInfo.defaultProps = {
  languages: [],
}
LanguageInfo.propTypes = {
  languages: PropTypes.array,
}

export default LanguageInfo
