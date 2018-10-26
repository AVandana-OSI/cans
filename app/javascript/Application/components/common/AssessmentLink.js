import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { isoToLocalDate } from '../../util/dateHelper'

class AssessmentLink extends PureComponent {
  render() {
    const { id, event_date: eventDate, person } = this.props.assessment
    const formattedEventDate = isoToLocalDate(eventDate)

    return (
      <Link to={`/clients/${person.id}/assessments/${id}`} className={'underlined'}>
        {`${formattedEventDate} CANS`}
      </Link>
    )
  }
}

AssessmentLink.propTypes = {
  assessment: PropTypes.object.isRequired,
}

export default AssessmentLink
