import React, { Component } from 'react'
import PropTypes from 'prop-types'

class AssessmentRecordIcon extends Component {
  renderIcon = status => {
    switch (status) {
      case 'IN_PROGRESS':
        return <i className="fa fa-spinner fa-2x" aria-hidden="true" />
      case 'COMPLETED':
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
