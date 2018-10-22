import React, { Component, Fragment } from 'react'
// import { Link } from 'react-router-dom';
// import { Row, Col, Label, Input, Button as ButtonReactStrap } from 'reactstrap';
import ClientService from '../Client/Client.service'
// import PaginationButtonFactory from '../common/pagination/PaginationButtonFactory';
// import Pagination from '../common/pagination/Pagination';
// import DateField from '../common/DateField';
// import { formatClientName } from './Client.helper';
// import { isoToLocalDate } from '../../util/dateHelper';
import { LoadingState } from '../../util/loadingHelper'
// import { isEnterKeyPressed } from '../../util/events';
// import Button from '@material-ui/core/Button/Button';
// import Card from '@material-ui/core/Card/Card'
// import CardHeader from '@material-ui/core/CardHeader'
// import CardContent from '@material-ui/core/CardContent'
// import DataGrid from '@cwds/components/lib/DataGrid';
import PersonSearchForm from './PersonSearchForm'
import SearchAssessmentHistory from './SearchAssessmentHistory'
import './style.sass'

const calculatePages = (recordsCount, pageSize) => Math.ceil(recordsCount / pageSize)

const initialFilterState = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
}

class SearchContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: initialFilterState,
      pagination: {
        page: 0,
        pages: 0,
        pageSize: 10,
      },
      records: [],
      // clientsStatus: LoadingState.idle,
    }
  }

  async componentDidMount() {
    await this.fetchClients()
  }

  fetchClients = () => {
    // this.setState({ clientsStatus: LoadingState.waiting })
    return ClientService.search({ ...this.state.filter, pagination: this.state.pagination })
      .then(this.onFetchClientsSuccess)
      .catch(error => {
        console.log(error)
        // this.setState({ clientsStatus: LoadingState.error })
      })
  }

  onFetchClientsSuccess = searchResult => {
    const pagination = this.state.pagination
    const pages = calculatePages(searchResult.total_records, pagination.pageSize)
    this.setState({
      pagination: {
        ...pagination,
        pages,
      },
      records: searchResult.records,
      // clientsStatus: LoadingState.ready,
    })
  }

  renderAccessRestrictions = client =>
    client.sensitivity_type === 'SENSITIVE' ? 'Sensitive' : client.sensitivity_type === 'SEALED' ? 'Sealed' : null

  renderPersonSearchForm() {
    return (
      <PersonSearchForm
        searchTitle={'Search Clients Only'}
        searchPrompt={'Search CWS-CMS for clients only'}
        // isClientOnly={false}
        // onSelect={person => this.onSelectPerson(person)}
      />
    )
  }

  renderSearchAssessmentHistory(clientIds) {
    return <SearchAssessmentHistory clientIds={clientIds} historyTitle={'Assessment History'} />
  }

  getClientIdsFromRecords(records) {
    return records.map(record => {
      return record.id
    })
  }

  render = () => {
    const { records } = this.state
    const clientIds = this.getClientIdsFromRecords(records)
    return (
      <Fragment>
        {this.renderPersonSearchForm()}
        {this.renderSearchAssessmentHistory(clientIds)}
      </Fragment>
    )
  }
}

export default SearchContainer
