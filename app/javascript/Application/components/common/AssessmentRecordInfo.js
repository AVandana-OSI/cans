import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { isoToLocalDate } from '../../util/dateHelper'
import { getActionVerbByStatus } from '../Assessment/AssessmentHelper'

class AssessmentRecordInfo extends Component {
  renderAssessmentInfo = assessment => {
    const {
      updated_timestamp: updatedTimestamp,
      updated_by: updatedBy,
      created_timestamp: createdTimestamp,
      created_by: createdBy,
      the_case: theCase,
      status,
      county,
    } = assessment
    const actionVerb = getActionVerbByStatus(status)
    const formattedTimestamp = isoToLocalDate(updatedTimestamp || createdTimestamp)
    const user = updatedBy || createdBy || {}
    const updatedByName = `${user.first_name} ${user.last_name}`
    const caseNumber = (theCase || {}).external_id || ''
    return (
      <Typography variant={'title'} color={'textSecondary'} className={'item-info'}>
        <p>{`${actionVerb} on ${formattedTimestamp} by ${updatedByName}`}</p>
        <p>{`Case: ${caseNumber}`}</p>
        <p>{`County: ${county.name}`}</p>
      </Typography>
    )
  }

  render() {
    return this.renderAssessmentInfo(this.props.assessment)
  }
}

AssessmentRecordInfo.propTypes = {
  assessment: PropTypes.object.isRequired,
}

export default AssessmentRecordInfo
