import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import sanitizeHtml from 'sanitize-html'

const AgeInfo = ({ dateOfBirth }) => {
  const sanitizedDob = sanitizeHtml(dateOfBirth, { allowedTags: [] })
  const dob = moment.utc(sanitizedDob, 'YYYY-MM-DD')

  if (!dob.isValid()) {
    return false
  }

  const ageInYears = moment().diff(dob, 'years')

  const genDobHtml = (dateOfBirth, sanitizedDob, dob) => {
    if (dateOfBirth === `<em>${sanitizedDob}</em>`) {
      return (
        <span>
          <strong className="client-search-matched-field">{dob.format('M/D/YYYY')}</strong>
        </span>
      )
    }
    if (dateOfBirth !== sanitizedDob) {
      return (
        <span>
          {dob.format('M/D/')}
          <strong className="client-search-matched-field">{dob.format('YYYY')}</strong>
        </span>
      )
    }
    return <span>{dob.format('M/D/YYYY')}</span>
  }
  return (
    <div className="highlighted date-of-birth">
      {genDobHtml(dateOfBirth, sanitizedDob, dob)}
      <span>
        <strong>{` (${ageInYears} ${ageInYears > 1 || ageInYears === 0 ? 'years' : 'year'})`}</strong>
      </span>
    </div>
  )
}
AgeInfo.defaultProps = {
  dateOfBirth: '',
}
AgeInfo.propTypes = {
  dateOfBirth: PropTypes.string,
}

export default AgeInfo
