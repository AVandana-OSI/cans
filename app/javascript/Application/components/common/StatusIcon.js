import React from 'react'
import PropTypes from 'prop-types'
import { AssessmentStatus } from '../Assessment/AssessmentHelper'

export function StatusIcon({ status }) {
  switch (status) {
    case AssessmentStatus.inProgress:
      return (
        <div>
          <i className="fa fa-spinner fa-2x" aria-hidden="true" />
          <span className="text-style"> In Progress </span>
        </div>
      )
    case AssessmentStatus.completed:
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
