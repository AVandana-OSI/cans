import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import Divider from '@material-ui/core/Divider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Input } from 'reactstrap'
import { DomainProgressBar, Item } from './'
import { shouldDomainBeRendered } from './AssessmentHelper'
import { getI18nByCode } from './I18nHelper'
import { isA11yAllowedInput } from '../../util/events'
import Grid from '@material-ui/core/Grid'

import './style.sass'

const mapPropsToState = props => ({
  title: props.i18n._title_ || '',
  description: props.i18n._description_ || 'No Description',
  caregiverName: props.domain.caregiver_name || '',
})

/* eslint-disable camelcase */
class Domain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...mapPropsToState(props),
      expanded: false,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(mapPropsToState(nextProps))
  }

  handleExpandedChange = () => {
    this.setState({
      expanded: !this.state.expanded,
    })
  }

  renderItems = items => {
    const i18nAll = this.props.i18nAll || {}
    const {
      isAssessmentUnderSix,
      onRatingUpdate,
      onConfidentialityUpdate,
      domain,
      canReleaseConfidentialInfo,
    } = this.props
    const caregiverIndex = domain.caregiver_index
    return items.map((item, index) => {
      const { id, code } = item
      const itemI18n = getI18nByCode(i18nAll, code)
      return (
        <div key={index}>
          <Item
            key={id}
            item={item}
            caregiverIndex={caregiverIndex}
            i18n={itemI18n}
            onRatingUpdate={onRatingUpdate}
            onConfidentialityUpdate={onConfidentialityUpdate}
            isAssessmentUnderSix={isAssessmentUnderSix}
            canReleaseConfidentialInfo={canReleaseConfidentialInfo}
          />
          <Divider />
        </div>
      )
    })
  }

  handleAddCaregiverDomain = event => {
    if (isA11yAllowedInput(event)) {
      this.props.onAddCaregiverDomain(this.props.domain.caregiver_index)
    }
  }

  handleRemoveCaregiverDomain = event => {
    if (isA11yAllowedInput(event)) {
      this.props.handleWarningShow(true, this.props.domain.caregiver_index)
    }
  }

  handleInternalCaregiverNameUpdate = event => {
    this.setState({ caregiverName: event.target.value })
  }

  handleCaregiverNameUpdate = () => {
    this.props.onCaregiverNameUpdate(this.props.domain.caregiver_index, this.state.caregiverName)
  }
  renderCaregiverName = () => {
    return (
      <div className={'caregiver-name-wrapper'}>
        <Input
          bsSize="lg"
          placeholder="Caregiver Name"
          className={'caregiver-name'}
          value={this.state.caregiverName}
          maxLength={50}
          onChange={this.handleInternalCaregiverNameUpdate}
          onBlur={this.handleCaregiverNameUpdate}
        />
      </div>
    )
  }

  renderCaregiverDomainControls() {
    return (
      <div className={'caregiver-domain-controls'}>
        <h5>
          <ul className={'caregiver-domain-controls-list'}>
            <li>
              <div
                onClick={this.handleRemoveCaregiverDomain}
                onKeyPress={this.handleRemoveCaregiverDomain}
                className={'caregiver-control'}
                role={'button'}
                aria-label="remove caregiver button"
                tabIndex={0}
              >
                - REMOVE CAREGIVER
              </div>
            </li>
            <li>
              <div
                onClick={this.handleAddCaregiverDomain}
                onKeyPress={this.handleAddCaregiverDomain}
                className={'caregiver-control'}
                role={'button'}
                aria-label="add caregiver button"
                tabIndex={0}
              >
                + ADD CAREGIVER
              </div>
            </li>
          </ul>
        </h5>
      </div>
    )
  }

  render = () => {
    const { isAssessmentUnderSix, domain, index } = this.props
    const { items, is_caregiver_domain } = domain
    const { title, description, caregiverName, expanded } = this.state
    const progressBar = <DomainProgressBar isAssessmentUnderSix={isAssessmentUnderSix} domain={domain} />
    return shouldDomainBeRendered(isAssessmentUnderSix, domain) ? (
      <Fragment>
        <ExpansionPanel expanded={expanded} onChange={this.handleExpandedChange} elevation={0}>
          <ExpansionPanelSummary
            expandIcon={
              <ExpandMoreIcon id={`domain${index}-expand`} style={{ height: '28px', color: '#000000', padding: '0' }} />
            }
          >
            <Grid container direction="row" justify="flex-end" alignItems="flex-end" spacing={0} style={{ padding: 0 }}>
              <Grid item xs={9}>
                <Typography variant="title" style={{ color: '#0e6f89', fontSize: 16 }}>
                  {title} {caregiverName && `- ${caregiverName}`}
                  {description ? (
                    <Tooltip title={description} placement="top" classes={{ tooltip: 'domain-tooltip' }}>
                      <i className="fa fa-question-circle domain-help-icon" />
                    </Tooltip>
                  ) : null}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                {progressBar}
              </Grid>
            </Grid>
          </ExpansionPanelSummary>
          {expanded && (
            <div>
              <ExpansionPanelDetails
                style={{
                  display: 'block',
                  padding: '0',
                  backgroundColor: 'white',
                }}
              >
                {is_caregiver_domain && this.renderCaregiverName()}
                {this.renderItems(items)}
                {is_caregiver_domain && this.renderCaregiverDomainControls()}
              </ExpansionPanelDetails>
            </div>
          )}
        </ExpansionPanel>
      </Fragment>
    ) : null
  }
}
/* eslint-enable camelcase */

/* eslint-disable react/no-unused-prop-types */
Domain.propTypes = {
  canReleaseConfidentialInfo: PropTypes.bool.isRequired,
  domain: PropTypes.object.isRequired,
  handleWarningShow: PropTypes.func,
  i18n: PropTypes.object.isRequired,
  i18nAll: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isAssessmentUnderSix: PropTypes.bool.isRequired,
  onAddCaregiverDomain: PropTypes.func.isRequired,
  onCaregiverNameUpdate: PropTypes.func.isRequired,
  onConfidentialityUpdate: PropTypes.func.isRequired,
  onRatingUpdate: PropTypes.func.isRequired,
}

Domain.defaultProps = {
  handleWarningShow: () => {},
}

export default Domain
