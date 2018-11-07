import React from 'react'
import PropTypes from 'prop-types'
import Genders from '../../../enums/Genders'

const LegacyInfo = ({ legacy_ui_id }) => {
  return legacy_ui_id ? <div>{legacy_ui_id}</div> : null
}
LegacyInfo.defaultProps = {
  legacy_ui_id: '',
}
LegacyInfo.propTypes = {
  legacy_ui_id: PropTypes.string,
}

export default LegacyInfo
