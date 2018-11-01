import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AssessmentStatus } from '../Assessment/AssessmentHelper'

class AssessmentRecordIcon extends Component {
  renderIcon = status => {
    switch (status) {
      case AssessmentStatus.inProgress:
        return <i className="fa fa-spinner fa-2x" aria-hidden="true" />
      case AssessmentStatus.completed:
        return <i className="fa fa-check-circle-o fa-2x" aria-hidden="true" />
      default:
        return null
    }
  }

  render() {
    return this.renderIcon(this.props.status)
  }
}

AssessmentRecordIcon.propTypes = {
  status: PropTypes.string.isRequired,
}

export default AssessmentRecordIcon
