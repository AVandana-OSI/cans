import React from 'react'
import PropTypes from 'prop-types'
import Genders from '../../../enums/Genders'

const Gender = ({ gender }) => {
  const genderInfo = [Genders[gender]].filter(Boolean)
  return genderInfo[0] ? <div>{genderInfo[0]}</div> : null
}
Gender.defaultProps = {
  gender: '',
}
Gender.propTypes = {
  gender: PropTypes.string,
}

export default Gender
