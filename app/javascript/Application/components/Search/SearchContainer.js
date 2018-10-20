import React, { Component, Fragment } from 'react';
// import { Link } from 'react-router-dom';
// import { Row, Col, Label, Input, Button as ButtonReactStrap } from 'reactstrap';
// import ClientService from './Client.service';
// import PaginationButtonFactory from '../common/pagination/PaginationButtonFactory';
// import Pagination from '../common/pagination/Pagination';
// import DateField from '../common/DateField';
// import { formatClientName } from './Client.helper';
// import { isoToLocalDate } from '../../util/dateHelper';
// import { LoadingState } from '../../util/loadingHelper';
// import { isEnterKeyPressed } from '../../util/events';
// import Button from '@material-ui/core/Button/Button';
import Card from '@material-ui/core/Card/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
// import DataGrid from '@cwds/components/lib/DataGrid';
import PersonSearchForm from './PersonSearchForm';
import SearchAssessmentHistory from './SearchAssessmentHistory';
// import './style.sass';

// const calculatePages = (recordsCount, pageSize) => Math.ceil(recordsCount / pageSize);

// const initialFilterState = {
//   firstName: '',
//   middleName: '',
//   lastName: '',
//   dob: '',
// };

class SearchContainer extends Component {
  constructor(props) {
    super(props);
  }

  renderAccessRestrictions = client =>
    client.sensitivity_type === 'SENSITIVE' ? 'Sensitive' : client.sensitivity_type === 'SEALED' ? 'Sealed' : null;

  renderPersonSearchForm() {
    return (
      <PersonSearchForm
        searchPrompt={this.props.searchPrompt}
        searchTitle={this.props.searchTitle}
        // isClientOnly={false}
        // onSelect={person => this.onSelectPerson(person)}
      />
    );
  }

  renderSearchAssessmentHistory() {
    // return <ClientAssessmentHistory clientId={50001} location={this.props.location} history={this.props.history} />;
    return <SearchAssessmentHistory clientIds={[50001, 50002, 50003]} historyTitle={'Assessment History'} />;
  }

  render = () => {
    return (
      <Fragment>
        {this.renderPersonSearchForm()}
        {this.renderSearchAssessmentHistory()}
      </Fragment>
    );
  };
}

export default SearchContainer;
