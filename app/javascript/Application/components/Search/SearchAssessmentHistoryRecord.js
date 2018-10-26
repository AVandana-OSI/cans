import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import { isoToLocalDate } from '../../util/dateHelper'
import AssessmentRecordIcon from '../common/AssessmentRecordIcon'
import AssessmentRecordInfo from '../common/AssessmentRecordInfo'
import { getDisplayAssessmentStatus } from '../Assessment/AssessmentHelper'

class SearchAssessmentHistoryRecord extends PureComponent {
  render() {
    const { id, event_date: eventDate, status, person } = this.props.assessment
    const formattedEventDate = isoToLocalDate(eventDate)
    return (
      <Container className={'history-item search-history-item'}>
        <Row>
          <Col xs="1">{<AssessmentRecordIcon status={status} />}</Col>
          <Col xs="11" className="assessment-status">
            <span>{getDisplayAssessmentStatus(status)}</span>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Row>
              <Col xs="12">
                <Link to={`/clients/${person.id}/assessments/${id}`} className={'underlined'}>
                  {`${formattedEventDate} CANS`}
                </Link>
              </Col>
            </Row>
            <Row>
              <Col xs="12">{<AssessmentRecordInfo assessment={this.props.assessment} />}</Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

SearchAssessmentHistoryRecord.propTypes = {
  assessment: PropTypes.object.isRequired,
}

export default SearchAssessmentHistoryRecord
