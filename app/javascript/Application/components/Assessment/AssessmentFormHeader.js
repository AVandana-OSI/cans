import React, { PureComponent, Fragment } from 'react'
import { Row, Col, Label } from 'reactstrap'
import { resetConfidentialByDefaultItems, AssessmentStatus } from './AssessmentHelper'
import { formatClientName } from '../Client/Client.helper'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import { Alert, Button } from '@cwds/components'
import { clone, stringify } from '../../util/common'
import './style.sass'
import DateField from '../common/DateField'
import ConductedByField from './ConductedByField'
import { Card, CardHeader, CardContent } from '@material-ui/core'

class AssessmentFormHeader extends PureComponent {
  handleValueChange = event => this.changeFieldAndUpdateAssessment(event.target.name, event.target.value)

  handleHasCaregiverSwitcher = event => {
    event.preventDefault()
    this.props.handleWarningShow(true)
  }

  handleHasCaregiverChange = event =>
    this.changeFieldAndUpdateAssessment(event.target.name, event.target.value === 'true')

  changeFieldAndUpdateAssessment(name, value) {
    const assessment = clone(this.props.assessment)
    assessment[name] = value
    this.props.onAssessmentUpdate(assessment)
  }

  handleCanReleaseInfoChange = event => {
    const canReleaseInfo = event.target.value === 'true'
    const assessment = clone(this.props.assessment)
    assessment.can_release_confidential_info = canReleaseInfo
    if (!canReleaseInfo) {
      resetConfidentialByDefaultItems(assessment)
    }
    this.props.onAssessmentUpdate(assessment)
  }

  handleSelectCaseNumber = event => {
    const assessment = clone(this.props.assessment)
    assessment.the_case = this.findCaseByExternalId(event.target.value)
    this.props.onAssessmentUpdate(assessment)
  }

  handleConductedByChange = event => {
    const assessment = clone(this.props.assessment)
    assessment.conducted_by = event.target.value
    this.props.onAssessmentUpdate(assessment)
  }

  findCaseByExternalId = externalId => (this.props.client.cases || []).find(aCase => aCase.external_id === externalId)

  updateUnderSix = value => {
    const assessment = clone(this.props.assessment)
    assessment.state.under_six = value
    this.props.onAssessmentUpdate(assessment)
  }

  renderClientName() {
    const { first_name: firstName, last_name: lastName } = this.props.client
    return (
      <div className={'child-name-block'}>
        {firstName && lastName ? (
          <span id={'child-name'}>{formatClientName(this.props.client)}</span>
        ) : (
          <span id={'no-data'}>Client Info</span>
        )}
      </div>
    )
  }
  renderCounty() {
    const county = this.props.assessment.county || {}
    const countyName = county.name ? `${county.name} County` : ''
    return (
      <div>
        {countyName ? (
          <div className={'county-name-block'}>
            <span id={'county-name'}>{countyName}</span>
          </div>
        ) : null}
      </div>
    )
  }

  renderDateSelect() {
    return (
      <Fragment>
        <Label required id={'assessment-date-label'} className={'assessment-form-header-label'}>
          Assessment Date *
        </Label>
        <DateField
          required={true}
          id={'assessment-date'}
          value={this.props.assessment.event_date}
          onChange={value => this.changeFieldAndUpdateAssessment('event_date', value)}
          onKeyUp={this.props.onKeyUp}
          ariaLabelledBy={'assessment-date-label'}
        />
      </Fragment>
    )
  }

  renderCaseNumber() {
    const { cases } = this.props.client
    const caseNumber = cases === undefined || cases.length === 0 ? '' : cases[0].external_id
    return (
      <Fragment>
        <Label for={'case-number'} className={'assessment-form-header-label'}>
          Case Number
        </Label>
        <div id={'case-number'} className={'assessment-form-header-case-number'}>
          {caseNumber}
        </div>
      </Fragment>
    )
  }

  renderConfidentialWarningAlertIfNeeded = () =>
    this.props.assessment.can_release_confidential_info ? null : (
      <Alert color={'warning'}>
        By selecting NO, Items 7, 48, and EC 41 (Substance Use Disorder Items) from this CANS assessment will be
        redacted when printed.
      </Alert>
    )

  renderHasCaregiverQuestion() {
    const hasCaregiver = (this.props.assessment || {}).has_caregiver
    return (
      <Fragment>
        <Col sm={12}>
          <Typography id={'has-caregiver-label'} variant="headline" classes={{ root: 'assessment-form-header-label' }}>
            Child/Youth has Caregiver?
          </Typography>
        </Col>
        <Col sm={12}>
          <FormControl>
            <RadioGroup
              id={'has-caregiver'}
              name={'has_caregiver'}
              value={stringify(hasCaregiver)}
              onChange={this.handleHasCaregiverChange}
              className={'assessment-form-header-radio-group'}
            >
              <FormControlLabel
                id={'has-caregiver-yes'}
                value={stringify(true)}
                control={
                  <Radio
                    color="default"
                    inputProps={{
                      id: 'input-has-caregiver-yes',
                      'aria-labelledby': 'has-caregiver-label',
                    }}
                  />
                }
                label={'Yes'}
                classes={{ label: 'assessment-form-header-label' }}
              />
              <FormControlLabel
                id={'has-caregiver-no'}
                value={stringify(false)}
                control={
                  <Radio
                    onClick={this.handleHasCaregiverSwitcher}
                    color="default"
                    inputProps={{
                      id: 'input-has-caregiver-no',
                      'aria-labelledby': 'has-caregiver-label',
                    }}
                  />
                }
                label={'No'}
                classes={{ label: 'assessment-form-header-label' }}
              />
            </RadioGroup>
          </FormControl>
        </Col>
      </Fragment>
    )
  }

  renderCanReleaseInfoQuestion() {
    const canReleaseConfidentialInfo = (this.props.assessment || {}).can_release_confidential_info
    return (
      <Fragment>
        <Col sm={12}>
          <Typography id={'can-release-label'} variant="headline" classes={{ root: 'assessment-form-header-label' }}>
            Authorization for release of information on file?
          </Typography>
        </Col>
        <Col sm={12}>
          <FormControl>
            <RadioGroup
              name={'can_release_confidential_info'}
              value={stringify(canReleaseConfidentialInfo)}
              onChange={this.handleCanReleaseInfoChange}
              className={'assessment-form-header-radio-group'}
            >
              <FormControlLabel
                value={stringify(true)}
                control={
                  <Radio
                    color="default"
                    inputProps={{
                      id: 'input-can-release-yes',
                      'aria-labelledby': 'can-release-label',
                    }}
                  />
                }
                label={'Yes'}
                classes={{ label: 'assessment-form-header-label' }}
              />
              <FormControlLabel
                value={stringify(false)}
                control={
                  <Radio
                    color="default"
                    inputProps={{
                      id: 'input-can-release-no',
                      'aria-labelledby': 'can-release-label',
                    }}
                  />
                }
                label={'No'}
                classes={{ label: 'assessment-form-header-label' }}
              />
            </RadioGroup>
          </FormControl>
        </Col>
      </Fragment>
    )
  }

  renderToggleUnderSixQuestion() {
    const isUnderSix = this.props.assessment.state.under_six
    return (
      <Fragment>
        <Label className={'assessment-form-header-label'}>Select CANS Template</Label>
        <Button
          onClick={() => this.updateUnderSix(true)}
          className={isUnderSix === true ? 'age-button-selected' : 'age-button'}
        >
          Age: 0-5
        </Button>

        <Button
          onClick={() => this.updateUnderSix(false)}
          className={isUnderSix === false ? 'age-button-selected' : 'age-button'}
        >
          Age: 6-21
        </Button>
      </Fragment>
    )
  }

  render() {
    return (
      <Fragment>
        <Card style={{ marginBottom: 20, marginLeft: 0, marginRight: 0 }} className={'assessment-header-date'}>
          <CardHeader
            title={this.renderClientName()}
            action={this.renderCounty()}
            className={'assessment-header-card-header'}
          />
          <CardContent
            style={{
              textAlign: 'left',
              marginLeft: 0,
              marginRight: 0,
              backgroundColor: 'white',
            }}
          >
            <Row className={'assessment-form-header-inputs'}>
              <Col sm={3}>{this.renderDateSelect()}</Col>
              <Col xs={3}>{this.renderToggleUnderSixQuestion()}</Col>
              <Col sm={3}>
                <ConductedByField
                  id={'conducted-by'}
                  value={this.props.assessment.conducted_by}
                  onChange={this.handleConductedByChange}
                  isDisabled={this.props.assessment.status === AssessmentStatus.completed}
                />
              </Col>
              <Col sm={3}>{this.renderCaseNumber()}</Col>
            </Row>
            <Row>
              <Col xs={6}>{this.renderHasCaregiverQuestion()}</Col>
              <Col xs={6}>{this.renderCanReleaseInfoQuestion()}</Col>
            </Row>

            <Row>
              <Col xs={12}>{this.renderConfidentialWarningAlertIfNeeded()}</Col>
            </Row>
          </CardContent>
        </Card>
      </Fragment>
    )
  }
}
AssessmentFormHeader.defaultProps = {
  onKeyUp: () => {},
  handleWarningShow: () => {},
}
AssessmentFormHeader.propTypes = {
  assessment: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  handleWarningShow: PropTypes.func,
  onAssessmentUpdate: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func,
}

export default AssessmentFormHeader
