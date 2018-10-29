import React from 'react'
import PropTypes from 'prop-types'

export function StatusIcon({ status }) {
  switch (status) {
    case 'IN_PROGRESS':
      return (
        <div>
          <i className="fa fa-spinner fa-2x" aria-hidden="true" />
          <span className="text-style"> In Progress </span>
        </div>
      )
    case 'COMPLETED':
      return (
        <div>
          <i className="fa fa-check-circle-o fa-2x" aria-hidden="true" />
          <span className="text-style"> Complete </span>
        </div>
      )
    default:
      return null
  }
}

StatusIcon.propTypes = {
  status: PropTypes.string,
}
export default StatusIcon
