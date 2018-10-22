import React, { Component, Fragment } from 'react'
import { Redirect, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CloseableAlert, alertType } from '../common/CloseableAlert'
import {
  Assessment,
  AssessmentFormHeader,
  AssessmentFormFooter,
  AssessmentService,
  I18nService,
  SecurityService,
} from './'
import Typography from '@material-ui/core/Typography'
import { PageInfo } from '../Layout'
import { LoadingState, isReadyForAction } from '../../util/loadingHelper'
import { Print, PrintAssessment } from '../Print'
import {
  AssessmentStatus,
  AssessmentType,
  validateAssessmentForSubmit,
  defaultEmptyAssessment,
} from './AssessmentHelper'

import './style.sass'
import { getCurrentIsoDate } from '../../util/dateHelper'
import moment from 'moment'

class AssessmentContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assessment: defaultEmptyAssessment,
      assessmentServiceStatus: LoadingState.idle,
      i18n: {},
      isValidForSubmit: false,
      shouldRenderSaveSuccessMessage: false,
      redirection: {
        shouldRedirect: false,
        successAssessmentId: null,
      },
      isEditable: false,
      shouldPrintNow: false,
      isValidDate: true,
    }
  }

  async componentDidMount() {
    const assessmentId = this.props.match.params.id
    let isEditable = assessmentId === undefined
    if (!isEditable) {
      isEditable = await SecurityService.checkPermission(`assessment:write:${assessmentId}`)
    }
    this.setState({ isEditable: isEditable })
    assessmentId ? this.fetchAssessment(assessmentId) : this.fetchNewAssessment()
    this.activeCtrlP()
  }

  componentDidUpdate() {
    if (this.state.redirection.shouldRedirect) {
      this.setState({ redirection: { ...this.state.redirection, shouldRedirect: false } })
    }
  }

  componentWillUnmount() {
    this.muteCtrlP()
  }

  activeCtrlP = () => {
    if (!this.state.shouldPrintNow) {
      window.addEventListener('keydown', this.handleCtrlP, false)
    }
  }

  muteCtrlP = () => {
    window.removeEventListener('keydown', this.handleCtrlP, false)
  }

  handleCtrlP = event => {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'p') {
        this.togglePrintNow()
        event.preventDefault()
      }
    }
  }

  async fetchNewAssessment() {
    this.setState({ assessmentServiceStatus: LoadingState.waiting })
    try {
      const instrument = await AssessmentService.fetchNewAssessment()
      return this.onFetchNewAssessmentSuccess(instrument)
    } catch (e) {
      this.setState({ assessmentServiceStatus: LoadingState.error })
    }
  }

  onFetchNewAssessmentSuccess(instrument) {
    const assessment = {
      instrument_id: instrument.id,
      person: this.props.client,
      county: this.props.client.county,
      assessment_type: AssessmentType.initial,
      status: AssessmentStatus.inProgress,
      state: instrument.prototype,
      event_date: getCurrentIsoDate(),
      has_caregiver: true,
      completed_as: 'COMMUNIMETRIC',
      can_release_confidential_info: false,
    }
    this.setState({
      assessment,
      assessmentServiceStatus: LoadingState.ready,
    })
    this.fetchI18n(assessment.instrument_id)
  }

  async fetchAssessment(id) {
    this.setState({ assessmentServiceStatus: LoadingState.waiting })
    try {
      const assessment = await AssessmentService.fetch(id)
      return this.onFetchAssessmentSuccess(assessment)
    } catch (e) {
      this.setState({ assessmentServiceStatus: LoadingState.error })
    }
  }

  onFetchAssessmentSuccess(assessment) {
    this.updateAssessment(assessment)
    this.fetchI18n(assessment.instrument_id)
  }

  async fetchI18n(instrumentId) {
    try {
      const i18n = await I18nService.fetchByInstrumentId(instrumentId)
      this.onFetchI18nSuccess(i18n)
    } catch (e) {
      this.setState({ i18n: {} })
    }
  }

  onFetchI18nSuccess(i18n) {
    this.setState({
      i18n: i18n,
    })
  }

  updateAssessment = assessment => {
    const isValidForSubmit = validateAssessmentForSubmit(assessment)
    this.setState({
      assessment,
      assessmentServiceStatus: LoadingState.ready,
      isValidForSubmit,
    })
  }

  initialSave(assessment) {
    this.setState({
      assessment,
      assessmentServiceStatus: LoadingState.ready,
      shouldRenderSaveSuccessMessage: true,
    })
    this.updateUrlWithAssessment(assessment)
  }

  updateUrlWithAssessment(assessment) {
    this.props.history.push(`/clients/${this.props.client.id}/assessments/${assessment.id}`)
  }

  hideSaveSuccessMessage = () => {
    this.setState({ shouldRenderSaveSuccessMessage: false })
  }

  handleSaveAssessment = async () => {
    this.setState({ assessmentServiceStatus: LoadingState.updating })
    const assessment = this.state.assessment
    assessment.person = this.props.client
    if (assessment.id) {
      try {
        const updatedAssessment = await AssessmentService.update(assessment.id, assessment)
        this.setState({
          assessment: updatedAssessment,
          assessmentServiceStatus: LoadingState.ready,
          shouldRenderSaveSuccessMessage: true,
        })
      } catch (e) {
        this.setState({ assessmentServiceStatus: LoadingState.error })
      }
    } else {
      try {
        const updatedAssessment = await AssessmentService.postAssessment(assessment)
        this.initialSave(updatedAssessment)
      } catch (e) {
        this.setState({ assessmentServiceStatus: LoadingState.error })
      }
    }
  }

  handleSubmitAssessment = async () => {
    this.setState({ assessmentServiceStatus: LoadingState.updating })
    const assessment = Object.assign({}, this.state.assessment)
    assessment.status = AssessmentStatus.submitted
    assessment.person = this.props.client
    if (assessment.id) {
      try {
        const submittedAssessment = await AssessmentService.update(assessment.id, assessment)
        this.setState({
          assessmentServiceStatus: LoadingState.ready,
          redirection: {
            shouldRedirect: true,
            successAssessmentId: submittedAssessment.id,
          },
        })
      } catch (e) {
        this.setState({ assessmentServiceStatus: LoadingState.error })
      }
    } else {
      try {
        const submittedAssessment = await AssessmentService.postAssessment(assessment)
        this.updateUrlWithAssessment(submittedAssessment)
        this.setState({
          assessmentServiceStatus: LoadingState.ready,
          redirection: {
            shouldRedirect: true,
            successAssessmentId: submittedAssessment.id,
          },
        })
      } catch (e) {
        this.setState({ assessmentServiceStatus: LoadingState.error })
      }
    }
  }

  handleCancelClick = () => this.setState({ redirection: { shouldRedirect: true } })

  togglePrintNow = () => this.setState({ shouldPrintNow: !this.state.shouldPrintNow })

  renderPrintButton = () => (
    <div
      onClick={this.togglePrintNow}
      onKeyPress={this.togglePrintNow}
      className={'print-link'}
      role={'button'}
      tabIndex={0}
    >
      <i className={'fa fa-print'} /> Print
    </div>
  )

  validateDate(date) {
    return moment(date, 'MM/DD/YYYY', true).isValid()
  }

  handleKeyUp = date => {
    const dateValue = date.target.value
    this.setState({ isValidDate: this.validateDate(dateValue) })
  }

  render() {
    const { client, isNewForm } = this.props
    const {
      redirection,
      isValidForSubmit,
      assessment,
      i18n,
      assessmentServiceStatus,
      shouldRenderSaveSuccessMessage,
      isEditable,
      shouldPrintNow,
    } = this.state
    const { shouldRedirect, successAssessmentId } = redirection
    if (shouldRedirect) {
      return <Redirect push to={{ pathname: `/clients/${client.id}`, state: { successAssessmentId } }} />
    }
    const pageTitle = isNewForm ? 'New CANS' : 'CANS Assessment Form'
    const canPerformUpdates = isReadyForAction(assessmentServiceStatus)
    const printButton = this.renderPrintButton()

    return (
      <Fragment>
        <PageInfo title={pageTitle} actionNode={printButton} />
        {shouldPrintNow && (
          <Print node={<PrintAssessment assessment={assessment} i18n={i18n} />} onClose={this.togglePrintNow} />
        )}
        <AssessmentFormHeader
          client={client}
          assessment={assessment}
          onAssessmentUpdate={this.updateAssessment}
          onKeyUp={this.handleKeyUp}
        />
        <Assessment assessment={assessment} i18n={i18n} onAssessmentUpdate={this.updateAssessment} />
        {LoadingState.ready === assessmentServiceStatus &&
          isEditable && (
            <Typography variant="headline" className={'submit-validation-message'}>
              Prior to clicking the Submit button the Assessment Date and all assessment ratings for the child/youth and
              applicable caregiver(s) must be completed.
            </Typography>
          )}
        {shouldRenderSaveSuccessMessage ? (
          <CloseableAlert
            type={alertType.SUCCESS}
            message={
              <Fragment>
                Success! CANS assessment has been saved. <Link to={`/clients/${client.id}`}>Click here</Link> to return
                to Child/Youth profile.
              </Fragment>
            }
            onClose={this.hideSaveSuccessMessage}
            className={'assessment-save-success'}
            isCloseable
            isAutoCloseable
          />
        ) : null}
        {LoadingState.ready === assessmentServiceStatus &&
          !isEditable && (
            <div className={'permission-warning-alert'}>
              <CloseableAlert
                type={alertType.WARNING}
                message="This assessment was initiated in a county that is different than the User’s County. Saving and
              Submitting are disabled"
                isCloseable={false}
                isAutoCloseable={false}
              />
            </div>
          )}
        <AssessmentFormFooter
          onCancelClick={this.handleCancelClick}
          isSaveButtonEnabled={
            this.state.isValidDate && isEditable && canPerformUpdates && !!this.state.assessment.event_date
          }
          onSaveAssessment={this.handleSaveAssessment}
          isSubmitButtonEnabled={isEditable && canPerformUpdates && isValidForSubmit}
          onSubmitAssessment={this.handleSubmitAssessment}
        />
      </Fragment>
    )
  }
}

AssessmentContainer.propTypes = {
  client: PropTypes.object.isRequired,
  history: PropTypes.object,
  isNewForm: PropTypes.bool.isRequired,
  match: PropTypes.object,
}

AssessmentContainer.defaultProps = {
  match: {
    params: {},
  },
  history: {},
}

export default AssessmentContainer
