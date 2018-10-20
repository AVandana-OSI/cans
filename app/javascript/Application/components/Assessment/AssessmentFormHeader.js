import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Label, Input } from 'reactstrap';
import { resetConfidentialByDefaultItems } from './AssessmentHelper';
import { formatClientName } from '../Client/Client.helper';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import { Alert } from '@cwds/components';
import { clone, stringify } from '../../util/common';
import './style.sass';
import DateField from '../common/DateField';

class AssessmentFormHeader extends PureComponent {
  handleValueChange = event => this.changeFieldAndUpdateAssessment(event.target.name, event.target.value);

  handleHasCaregiverChange = event =>
    this.changeFieldAndUpdateAssessment(event.target.name, event.target.value === 'true');

  changeFieldAndUpdateAssessment(name, value) {
    const assessment = clone(this.props.assessment);
    assessment[name] = value;
    this.props.onAssessmentUpdate(assessment);
  }

  handleCanReleaseInfoChange = event => {
    const canReleaseInfo = event.target.value === 'true';
    const assessment = clone(this.props.assessment);
    assessment.can_release_confidential_info = canReleaseInfo;
    if (!canReleaseInfo) {
      resetConfidentialByDefaultItems(assessment);
    }
    this.props.onAssessmentUpdate(assessment);
  };

  handleSelectCaseNumber = event => {
    const assessment = clone(this.props.assessment);
    assessment.the_case = this.findCaseByExternalId(event.target.value);
    this.props.onAssessmentUpdate(assessment);
  };

  findCaseByExternalId = externalId => (this.props.client.cases || []).find(aCase => aCase.external_id === externalId);

  toggleUnderSix = () => {
    const assessment = clone(this.props.assessment);
    assessment.state.under_six = !assessment.state.under_six;
    this.props.onAssessmentUpdate(assessment);
  };

  renderClientNameAndCounty() {
    const { first_name: firstName, last_name: lastName } = this.props.client;
    const county = this.props.assessment.county || {};
    const countyName = county.name ? `${county.name} County` : '';
    return (
      <Col sm={12}>
        <div className={'child-name-block'}>
          {firstName && lastName ? (
            <span id={'child-name'}>{formatClientName(this.props.client)}</span>
          ) : (
            <span id={'no-data'}>Client Info</span>
          )}
        </div>
        {countyName ? (
          <div className={'county-name-block'}>
            <span id={'county-name'}>{countyName}</span>
          </div>
        ) : null}
      </Col>
    );
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
    );
  }

  renderCaseSelect() {
    return (
      <Fragment>
        <Label for={'select-case'} className={'assessment-form-header-label'}>
          Case Number
        </Label>
        <Input
          type={'select'}
          id={'select-case'}
          value={(this.props.assessment.the_case || {}).external_id}
          onChange={this.handleSelectCaseNumber}
          style={{ fontSize: '1.5rem', height: '3.6rem' }}
        >
          {this.renderCaseNumbersDropdownOptions()}
        </Input>
      </Fragment>
    );
  }

  renderCaseNumbersDropdownOptions = () => {
    const cases = this.props.client.cases || [];
    return [...cases, {}].reverse().map(theCase => (
      <option key={theCase.id || 0} value={theCase.external_id}>
        {theCase.external_id}
      </option>
    ));
  };

  renderCompletedAsSelect() {
    return (
      <Fragment>
        <Label for={'select-user'} className={'assessment-form-header-label'}>
          Complete as
        </Label>
        <Input
          type={'select'}
          name={'completed_as'}
          id={'select-user'}
          value={this.props.assessment.completed_as}
          onChange={this.handleValueChange}
          style={{ fontSize: '1.5rem', height: '3.6rem' }}
        >
          <option value={'COMMUNIMETRIC'}>Communimetric</option>
        </Input>
      </Fragment>
    );
  }

  renderConfidentialWarningAlertIfNeeded = () =>
    this.props.assessment.can_release_confidential_info ? null : (
      <Alert color={'warning'}>
        Since there is no Authorization for Release of Information on file, prior to sharing this CANS assessment redact
        the following domain item numbers: 7, 48, and EC.41.
      </Alert>
    );

  renderHasCaregiverQuestion() {
    const hasCaregiver = (this.props.assessment || {}).has_caregiver;
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
    );
  }

  renderCanReleaseInfoQuestion() {
    const canReleaseConfidentialInfo = (this.props.assessment || {}).can_release_confidential_info;
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
    );
  }

  renderToggleUnderSixQuestion() {
    const isUnderSix = this.props.assessment.state.under_six;
    return (
      <Typography variant="body1" style={{ textAlign: 'left' }} className={'assessment-form-header-label'}>
        Age: 0-5
        <FormControlLabel
          id={'age-switch'}
          control={
            <Switch
              checked={!isUnderSix}
              value={stringify(isUnderSix)}
              onChange={this.toggleUnderSix}
              color="default"
              inputProps={{ id: 'age-switch-input', 'aria-labelledby': 'age-switch' }}
            />
          }
          label={<span className={'assessment-form-header-label'}>6-21</span>}
          style={{ marginLeft: '0px', marginRight: '0px' }}
        />
      </Typography>
    );
  }

  render() {
    return (
      <Fragment>
        <Row>{this.renderClientNameAndCounty()}</Row>
        <Row className={'assessment-form-header-inputs'}>
          <Col sm={3}>{this.renderDateSelect()}</Col>
          <Col sm={5}>{this.renderCaseSelect()}</Col>
          <Col sm={4}>{this.renderCompletedAsSelect()}</Col>
        </Row>
        <Row>
          <Col xs={6}>{this.renderHasCaregiverQuestion()}</Col>
          <Col xs={6}>{this.renderCanReleaseInfoQuestion()}</Col>
        </Row>
        <Row>
          <Col xs={12}>{this.renderConfidentialWarningAlertIfNeeded()}</Col>
        </Row>
        <Row>
          <Col xs={12}>{this.renderToggleUnderSixQuestion()}</Col>
        </Row>
      </Fragment>
    );
  }
}
AssessmentFormHeader.defaultProps = {
  onKeyUp: () => {},
};
AssessmentFormHeader.propTypes = {
  assessment: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  onAssessmentUpdate: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func,
};

export default AssessmentFormHeader;
