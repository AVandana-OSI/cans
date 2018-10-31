import PropTypes from 'prop-types'
import React from 'react'
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
      return <em>{dob.format('M/D/YYYY')}</em>
    }
    if (dateOfBirth !== sanitizedDob) {
      return (
        <span>
          {dob.format('M/D/')}
          <em>{dob.format('YYYY')}</em>
        </span>
      )
    }
    return dob.format('M/D/YYYY')
  }

  return (
    <div className="highlighted">
      <span>{`${ageInYears} yrs old (DOB:`}</span>
      {genDobHtml(dateOfBirth, sanitizedDob, dob)}
      <span>)</span>
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
