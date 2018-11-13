import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'reactstrap'
import AssessmentRecordIcon from '../common/AssessmentRecordIcon'
import AssessmentLink from '../common/AssessmentLink'
import AssessmentRecordInfo from '../common/AssessmentRecordInfo'
import { getDisplayAssessmentStatus } from '../Assessment/AssessmentHelper'

class SearchAssessmentHistoryRecord extends PureComponent {
  render() {
    const { status } = this.props.assessment

    return (
      <Container className={'search-history-item'}>
        <Row>
          <div className="assessment-record-icon">{<AssessmentRecordIcon status={status} />}</div>
          <Col xs="11" className="assessment-status">
            <span>{getDisplayAssessmentStatus(status)}</span>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Row>
              <Col xs="12">{<AssessmentLink assessment={this.props.assessment} />}</Col>
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
