import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import SearchAssessmentHistoryRecord from './SearchAssessmentHistoryRecord'
import { AssessmentService } from '../Assessment/Assessment.service'
import { LoadingState } from '../../util/loadingHelper'
import moment from 'moment'

class SearchAssessmentHistory extends Component {
  constructor(props) {
    super(props)

    this.state = {
      assessments: [],
      fetchStatus: LoadingState.idle,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.clientIds !== prevProps.clientIds) {
      const { clientIds } = this.props

      const promises = clientIds.map(clientId => {
        if (clientId) {
          return AssessmentService.search({ person_id: clientId })
        }
      })

      return Promise.all(promises)
        .then(assessmentData => {
          const assessments = [].concat(...assessmentData).filter(assessment => assessment.status === 'IN_PROGRESS')
          const sortedAssessments = this.sortAssessmentsByDate('desc', assessments)
          this.setState({
            assessments: sortedAssessments.slice(0, this.props.numAssessments),
            fetchStatus: LoadingState.ready,
          })
        })
        .catch(err => {
          throw err
        })
    }
  }

  renderAssessments = (assessments, fetchStatus) => {
    return fetchStatus === LoadingState.ready && assessments.length === 0 ? (
      <div id="no-data">No assessments currently exist for the clients.</div>
    ) : (
      assessments.map(assessment => <SearchAssessmentHistoryRecord assessment={assessment} key={assessment.id} />)
    )
  }

  sortAssessmentsByDate(direction, assessments) {
    const newAssessmentList = assessments.map(assessment => {
      return { ...assessment, moment: moment(assessment.created_timestamp) }
    })
    newAssessmentList.sort((left, right) => {
      return direction === 'asc' ? left.moment.diff(right.moment) : right.moment.diff(left.moment)
    })
    return newAssessmentList
  }

  render() {
    const { historyTitle } = this.props
    const { assessments, fetchStatus } = this.state
    return (
      <Grid item xs={12}>
        <div className="card double-gap-bottom hidden-print">
          <div className="card-header card-header-search">
            <h4>{historyTitle}</h4>
          </div>
          <div className="card-body card-body-search">
            <div className="row">
              <div className="col-md-12">{this.renderAssessments(assessments, fetchStatus)}</div>
            </div>
          </div>
        </div>
      </Grid>
    )
  }
}

SearchAssessmentHistory.propTypes = {
  clientIds: PropTypes.array.isRequired,
  historyTitle: PropTypes.string.isRequired,
  numAssessments: PropTypes.number.isRequired,
}

export default SearchAssessmentHistory
