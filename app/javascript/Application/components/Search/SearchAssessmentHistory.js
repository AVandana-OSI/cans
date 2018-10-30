import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SearchAssessmentHistoryRecord from './SearchAssessmentHistoryRecord'
import { AssessmentService } from '../Assessment/Assessment.service'
import { LoadingState } from '../../util/loadingHelper'
import moment from 'moment'
import { Card, CardHeader, CardBody } from '@cwds/components/lib/Cards'
import CardTitle from '@cwds/components/lib/Cards/CardTitle'

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
    AssessmentService.getAllAssessments({
      person_id: 0,
    })
      .then(assessments => {
        const filteredAssessments = assessments.filter(assessment => assessment.status === 'IN_PROGRESS')
        const sortedAssessments = this.sortAssessmentsByDate('desc', filteredAssessments)
        this.setState({
          assessments: sortedAssessments.slice(0, this.props.numAssessments),
          fetchStatus: LoadingState.ready,
        })
      })
      .catch(err => {
        throw err
      })
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
    const { assessments, fetchStatus } = this.state
    return (
      <Card className="card hidden-print">
        <CardHeader className="card-header-search">
          <CardTitle>{'Assessment History'}</CardTitle>
        </CardHeader>
        <CardBody className="card-body-search">{this.renderAssessments(assessments, fetchStatus)}</CardBody>
      </Card>
    )
  }
}

SearchAssessmentHistory.propTypes = {
  numAssessments: PropTypes.number.isRequired,
}

export default SearchAssessmentHistory
