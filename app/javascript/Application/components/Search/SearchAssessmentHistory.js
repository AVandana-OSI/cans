import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SearchAssessmentHistoryRecord from './SearchAssessmentHistoryRecord'
import { AssessmentService } from '../Assessment/Assessment.service'
import { LoadingState } from '../../util/loadingHelper'
import moment from 'moment'
import { AssessmentStatus } from '../Assessment/AssessmentHelper'

class SearchAssessmentHistory extends Component {
  constructor(props) {
    super(props)

    this.state = {
      assessments: [],
      fetchStatus: LoadingState.idle,
    }
  }

  async componentDidMount() {
    await this.fetchAllAssessments()
  }

  fetchAllAssessments = () => {
    AssessmentService.getAllAssessments()
      .then(assessments => {
        const filteredAssessments = assessments.filter(assessment => assessment.status === AssessmentStatus.inProgress)
        const sortedAssessments = this.sortAssessmentsByDate('desc', filteredAssessments)
        this.setState({
          assessments: sortedAssessments.slice(0, this.props.numAssessments),
          fetchStatus: LoadingState.ready,
        })
      })
      .catch(err => {
        this.setState({ fetchStatus: LoadingState.error })
        throw err
      })
  }

  renderAssessments = (assessments, fetchStatus) => {
    return fetchStatus === LoadingState.ready && assessments.length === 0 ? (
      <div id="no-data">No assessments currently exist for the clients.</div>
    ) : (
      assessments.map(assessment => (
        <SearchAssessmentHistoryRecord navFrom={this.props.navFrom} assessment={assessment} key={assessment.id} />
      ))
    )
  }

  sortAssessmentsByDate(direction, assessments) {
    const newAssessmentList = assessments.map(assessment => {
      const timestamp = moment(assessment.updated_timestamp || assessment.created_timestamp)
      return { ...assessment, timestamp }
    })
    newAssessmentList.sort((left, right) => {
      return direction === 'asc' ? left.timestamp.diff(right.timestamp) : right.timestamp.diff(left.timestamp)
    })
    return newAssessmentList
  }

  render() {
    const { assessments, fetchStatus } = this.state
    return <div className="row">{this.renderAssessments(assessments, fetchStatus)}</div>
  }
}

SearchAssessmentHistory.propTypes = {
  navFrom: PropTypes.string.isRequired,
  numAssessments: PropTypes.number.isRequired,
}

export default SearchAssessmentHistory
