import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button/Button';
import SearchAssessmentHistoryRecord from './SearchAssessmentHistoryRecord';
import { assessment as mockAssessment } from './assessment.mocks.test';
import { Link } from 'react-router-dom';
import { AssessmentService } from '../Assessment/Assessment.service';
import { CloseableAlert, alertType } from '../common/CloseableAlert';
import { LoadingState } from '../../util/loadingHelper';
import moment from 'moment';

import '../Client/style.sass';

class SearchAssessmentHistory extends Component {
  constructor(props) {
    super(props);
    const { successAssessmentId } = (this.props.location || {}).state || {};
    if (successAssessmentId && this.props.history) {
      this.props.history.replace({ ...this.props.location, state: {} });
    }

    this.state = {
      assessments: [],
      fetchStatus: LoadingState.idle,
      shouldRenderSuccessMessage: !!successAssessmentId,
      numAssessments: 3,
    };
  }

  renderAssessments = (assessments, fetchStatus) => {
    return fetchStatus === LoadingState.ready && assessments.length === 0 ? (
      <div id="no-data">No assessments currently exist for this child/youth.</div>
    ) : (
      assessments.map(assessment => <SearchAssessmentHistoryRecord assessment={assessment} key={assessment.id} />)
    );
  };

  render() {
    const { historyTitle } = this.props;
    const { assessments, fetchStatus } = this.state;
    return (
      <div>
        <div className="card double-gap-bottom hidden-print" id="search-card">
          <div className="card-header">
            <h2>{historyTitle}</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">{this.renderAssessments(assessments, fetchStatus)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.clientIds !== prevProps.clientIds) {
      const { clientIds } = this.props;

      const promises = clientIds.map(clientId => {
        if (clientId) {
          return AssessmentService.search({ person_id: clientId });
        }
      });

      return Promise.all(promises)
        .then(assessmentData => {
          const assessments = [].concat.apply([], assessmentData).filter(assessment => {
            if (assessment.status === 'IN_PROGRESS') {
              return assessment;
            }
          });
          const sortedAssessments = this.sortAssessmentsByDate('desc', assessments);
          this.setState({
            assessments: sortedAssessments.slice(0, this.state.numAssessments),
            fetchStatus: LoadingState.ready,
          });
        })
        .catch(error => {
          console.log(error);
          this.setState({ clientsStatus: LoadingState.error });
        });
    }
  }

  sortAssessmentsByDate(direction, assessments) {
    const newAssessmentList = assessments.map(assessment => {
      const momentObj = moment(assessment.created_timestamp);
      assessment.moment = momentObj;
      return assessment;
    });
    newAssessmentList.sort((left, right) => {
      return direction === 'asc' ? left.moment.diff(right.moment) : right.moment.diff(left.moment);
    });
    return newAssessmentList;
  }
}

// SearchAssessmentHistory.propTypes = {
//   clientId: PropTypes.number,
//   history: PropTypes.object.isRequired,
//   location: PropTypes.object.isRequired,
// };

// SearchAssessmentHistory.defaultProps = {
//   clientId: null,
// };

export default SearchAssessmentHistory;
