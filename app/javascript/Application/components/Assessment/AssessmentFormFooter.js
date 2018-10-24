import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'reactstrap'

import './style.sass'

class AssessmentFormFooter extends PureComponent {
  render() {
    const {
      onCancelClick,
      isSaveButtonEnabled,
      onSaveAssessment,
      isSubmitButtonEnabled,
      onSubmitAssessment,
    } = this.props
    return (
      <Row className={'form-footer'}>
        <Col sm={9}>
          <Button id={'cancel-assessment'} color={'link'} className={'cancel-button'} onClick={onCancelClick}>
            Cancel
          </Button>
          <Button id={'save-assessment'} color={'primary'} disabled={!isSaveButtonEnabled} onClick={onSaveAssessment}>
            Save
          </Button>
        </Col>
        <Col sm={3}>
          <Button
            id={'submit-assessment'}
            color={'primary'}
            disabled={!isSubmitButtonEnabled}
            onClick={onSubmitAssessment}
          >
            Complete
          </Button>
        </Col>
      </Row>
    )
  }
}

AssessmentFormFooter.propTypes = {
  isSaveButtonEnabled: PropTypes.bool.isRequired,
  isSubmitButtonEnabled: PropTypes.bool.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onSaveAssessment: PropTypes.func.isRequired,
  onSubmitAssessment: PropTypes.func.isRequired,
}

export default AssessmentFormFooter
