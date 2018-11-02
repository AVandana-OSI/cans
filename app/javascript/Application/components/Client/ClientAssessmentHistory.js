import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button/Button'
import { ClientAssessmentHistoryRecord } from './'
import { Link } from 'react-router-dom'
import { AssessmentService } from '../Assessment/Assessment.service'
import { CloseableAlert, alertType } from '../common/CloseableAlert'
import { LoadingState } from '../../util/loadingHelper'

import './style.sass'

class ClientAssessmentHistory extends Component {
  constructor(context) {
    super(context)
    const { successAssessmentId } = (this.props.location || {}).state || {}
    if (successAssessmentId && this.props.history) {
      this.props.history.replace({ ...this.props.location, state: {} })
    }
    this.state = {
      assessments: [],
      fetchStatus: LoadingState.idle,
      shouldRenderSuccessMessage: Boolean(successAssessmentId),
    }
  }

  componentDidMount() {
    const { clientIdentifier } = this.props
    if (clientIdentifier) {
      return AssessmentService.search({ client_identifier: clientIdentifier }).then(data => {
        this.setState({
          assessments: data,
          fetchStatus: LoadingState.ready,
        })
      })
    }
    return null
  }

  renderAddCansButton() {
    const clientIdentifier = this.props.clientIdentifier
    return (
      <Link to={`/clients/${clientIdentifier}/assessments`}>
        <Button size="small" color="inherit" className={'card-header-cans-button'}>
          New CANS
        </Button>
      </Link>
    )
  }

  renderAssessments = (assessments, fetchStatus) => {
    return fetchStatus === LoadingState.ready && assessments.length === 0 ? (
      <div id="no-data">No assessments currently exist for this child/youth.</div>
    ) : (
      assessments.map(assessment => <ClientAssessmentHistoryRecord assessment={assessment} key={assessment.id} />)
    )
  }

  render() {
    const { assessments, fetchStatus, shouldRenderSuccessMessage } = this.state
    return (
      <Grid item xs={12}>
        <Card className={'card'}>
          <CardHeader className={'card-header-cans'} title="Assessment History" action={this.renderAddCansButton()} />

          <div className={'content'}>
            <CardContent>
              {shouldRenderSuccessMessage && (
                <CloseableAlert
                  type={alertType.SUCCESS}
                  message={'Success! CANS assessment has been completed.'}
                  isCloseable
                  isAutoCloseable
                />
              )}
              {this.renderAssessments(assessments, fetchStatus)}
            </CardContent>
          </div>
        </Card>
      </Grid>
    )
  }
}

ClientAssessmentHistory.propTypes = {
  clientIdentifier: PropTypes.string,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

ClientAssessmentHistory.defaultProps = {
  clientIdentifier: null,
}

export default ClientAssessmentHistory
