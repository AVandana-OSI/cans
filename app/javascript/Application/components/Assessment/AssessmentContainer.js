import React, { Component, Fragment } from 'react'
import { Redirect, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CloseableAlert, alertType } from '../common/CloseableAlert'
import { clone } from '../../util/common'
import PageModal from '../common/PageModal'
import ConfidentialityWarning from '../common/ConfidentialityWarning'
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
      isCaregiverWarningShown: false,
      isSubmitWarningShown: false,
      focusedCaregiverId: '',
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

  handleSubmitWarning = switcher => {
    if (this.state.assessment.can_release_confidential_info === false) {
      this.setState({ isSubmitWarningShown: switcher })
    }
    return null
  }

  handleWarningShow = (switcher, caregiverIndex) => {
    caregiverIndex = caregiverIndex || null
    this.setState({ isCaregiverWarningShown: switcher, focusedCaregiverId: caregiverIndex })
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
      return this.setState({ assessmentServiceStatus: LoadingState.error })
    }
  }

  onFetchNewAssessmentSuccess(instrument) {
    const client = this.props.client
    const assessment = {
      instrument_id: instrument.id,
      person: client,
      service_source: client.service_source,
      service_source_id: client.service_source_id,
      service_source_ui_id: client.service_source_ui_id,
      county: client.county,
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
      return this.setState({ assessmentServiceStatus: LoadingState.error })
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

  handleCaregiverRemoveAll = (name, value) => {
    const tempAssessment = clone(this.state.assessment)
    tempAssessment[name] = value
    this.updateAssessment(tempAssessment)
  }

  handleCaregiverRemove = caregiverIndex => {
    const tempAssessment = clone(this.state.assessment)
    if (caregiverIndex !== null) {
      const domains = tempAssessment.state.domains
      const newDomains = domains.filter(domain => domain.caregiver_index !== caregiverIndex)
      tempAssessment.state.domains = newDomains
      this.updateAssessment(tempAssessment)
    } else {
      this.handleCaregiverRemoveAll('has_caregiver', false)
    }
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
    this.props.history.push(`/clients/${this.props.client.identifier}/assessments/${assessment.id}`)
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
    assessment.status = AssessmentStatus.completed
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

  renderWarning = () => {
    const caregiverWarning = (
      <div>
        You are about to remove the <strong className="cargiver-text-block">caregiver</strong> from this Assessment.
      </div>
    )
    return this.state.isCaregiverWarningShown ? (
      <PageModal
        isOpen={true}
        title={'Warning'}
        warningDescription={caregiverWarning}
        description={'This may effect some of your entries.'}
        removeButtonLabel={'Remove'}
        cancelButtonLabel={'Cancel'}
        onCancel={() => this.handleWarningShow(false)}
        onRemove={() => {
          this.handleWarningShow(false)
          this.handleCaregiverRemove(this.state.focusedCaregiverId)
        }}
      />
    ) : null
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
      isValidDate,
      shouldPrintNow,
    } = this.state
    const { shouldRedirect, successAssessmentId } = redirection
    if (shouldRedirect) {
      return <Redirect push to={{ pathname: `/clients/${client.identifier}`, state: { successAssessmentId } }} />
    }
    const pageTitle = isNewForm ? 'New CANS' : 'CANS Assessment Form'
    const canPerformUpdates = isReadyForAction(assessmentServiceStatus)
    const printButton = this.renderPrintButton()

    const isUnderSix = assessment && assessment.state && assessment.state.under_six

    return (
      <Fragment>
        {this.renderWarning()}
        {this.state.isSubmitWarningShown ? (
          <ConfidentialityWarning
            onCancel={() => this.handleSubmitWarning()}
            onRemove={() => {
              this.handleSubmitWarning()
              this.handleSubmitAssessment()
            }}
          />
        ) : null}
        <PageInfo title={pageTitle} actionNode={printButton} />
        {shouldPrintNow && (
          <Print node={<PrintAssessment assessment={assessment} i18n={i18n} />} onClose={this.togglePrintNow} />
        )}
        <AssessmentFormHeader
          client={client}
          assessment={assessment}
          onAssessmentUpdate={this.updateAssessment}
          onKeyUp={this.handleKeyUp}
          handleWarningShow={this.handleWarningShow}
          isCaregiverWarningShown={this.state.isCaregiverWarningShown}
        />
        <Assessment
          assessment={assessment}
          i18n={i18n}
          onAssessmentUpdate={this.updateAssessment}
          handleWarningShow={this.handleWarningShow}
        />
        {LoadingState.ready === assessmentServiceStatus &&
          isEditable &&
          !(isUnderSix === null || isUnderSix === undefined) && (
            <Typography variant="headline" className={'submit-validation-message'}>
              The Assessment Date and all assessment ratings must be completed before the Complete button becomes
              active.
            </Typography>
          )}
        {shouldRenderSaveSuccessMessage ? (
          <CloseableAlert
            type={alertType.SUCCESS}
            message={
              <Fragment>
                Success! CANS assessment has been saved. <Link to={`/clients/${client.identifier}`}>Click here</Link> to
                return to Child/Youth profile.
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
          isSaveButtonEnabled={isValidDate && isEditable && canPerformUpdates && Boolean(assessment.event_date)}
          onSaveAssessment={this.handleSaveAssessment}
          isSubmitButtonEnabled={isEditable && canPerformUpdates && isValidForSubmit}
          onSubmitAssessment={
            this.state.assessment.can_release_confidential_info === true
              ? this.handleSubmitAssessment
              : this.handleSubmitWarning
          }
          isUnderSix={isUnderSix}
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
